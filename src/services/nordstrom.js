import * as cheerio from "cheerio";
import fs from "fs";
import puppeteer from "puppeteer-core";
import { NYC_NORDSTROM_STORES } from "../data/nycStores.js";
import { getDistanceInMiles } from "../lib/distance.js";

const NORDSTROM_ORIGIN = "https://www.nordstrom.com";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const DEFAULT_CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

class HttpError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function normalizeNordstromUrl(url) {
  const parsed = new URL(url);

  if (!parsed.hostname.includes("nordstrom.com")) {
    throw new HttpError("Please use a Nordstrom product URL.", 400);
  }

  parsed.search = "";
  parsed.hash = "";
  return parsed.toString();
}

function isBotChallengeDocument(html, currentUrl = "") {
  return (
    currentUrl.includes("siteclosed.nordstrom.com") ||
    html.includes("window['istlWasHere']") ||
    html.includes("invitation.html")
  );
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
    },
  });

  if (!response.ok) {
    throw new HttpError(`Nordstrom returned ${response.status} while loading the product page.`, 502);
  }

  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      referer: NORDSTROM_ORIGIN,
      origin: NORDSTROM_ORIGIN,
    },
  });

  if (!response.ok) {
    let details = null;

    try {
      details = await response.text();
    } catch {
      details = null;
    }

    throw new HttpError(
      `Nordstrom returned ${response.status} while loading live inventory.`,
      502,
      details
    );
  }

  return response.json();
}

function parseEmbeddedJson(html) {
  const $ = cheerio.load(html);
  const scriptCandidates = $("script")
    .map((_, element) => $(element).html() ?? "")
    .get();

  const keys = [
    "styleId",
    "productId",
    "skuId",
    "productTitle",
    "name"
  ];

  for (const scriptText of scriptCandidates) {
    if (!scriptText.includes("styleId") && !scriptText.includes("__INITIAL_STATE__")) {
      continue;
    }

    for (const key of keys) {
      const regex = new RegExp(`"${key}"\\s*:\\s*(".*?"|\\d+)`, "g");
      const match = regex.exec(scriptText);

      if (match) {
        return scriptText;
      }
    }
  }

  return $.html();
}

function extractProductMetadata(html, productUrl) {
  const blob = parseEmbeddedJson(html);
  const matchValue = (key) => {
    const regex = new RegExp(`"${key}"\\s*:\\s*("([^"]+)"|(\\d+))`);
    const match = blob.match(regex);
    return match?.[2] ?? match?.[3] ?? null;
  };

  const styleId = matchValue("styleId");
  const productId = matchValue("productId");
  const skuId = matchValue("skuId");
  const productTitle = matchValue("productTitle") ?? matchValue("name") ?? "Nordstrom Product";

  const [, firstSegment, secondSegment] = new URL(productUrl).pathname.split("/");
  const productSlug = firstSegment === "s" ? secondSegment ?? null : firstSegment ?? null;

  if (!styleId && !productId && !productSlug) {
    throw new HttpError(
      "Could not identify this product from the Nordstrom page. The page structure may have changed.",
      502
    );
  }

  return {
    styleId,
    productId,
    skuId,
    productTitle,
    productSlug
  };
}

function buildAvailabilityUrls(metadata) {
  const urls = [];

  if (metadata.skuId) {
    urls.push(`${NORDSTROM_ORIGIN}/api/product/availability?skuId=${metadata.skuId}`);
  }

  if (metadata.styleId) {
    urls.push(`${NORDSTROM_ORIGIN}/api/product/availability?styleId=${metadata.styleId}`);
  }

  if (metadata.productId) {
    urls.push(`${NORDSTROM_ORIGIN}/api/product/availability?productId=${metadata.productId}`);
  }

  if (metadata.productSlug) {
    urls.push(`${NORDSTROM_ORIGIN}/browse/productAvailability/${metadata.productSlug}`);
  }

  return [...new Set(urls)];
}

function pickStoreId(candidate) {
  return String(
    candidate.storeId ??
      candidate.storeNumber ??
      candidate.locationId ??
      candidate.id ??
      ""
  );
}

function flattenAvailability(payload) {
  const stores = payload?.stores ?? payload?.pickupAvailability ?? payload?.data?.stores ?? [];
  const sizes = payload?.sizes ?? payload?.skus ?? payload?.data?.sizes ?? [];

  if (!Array.isArray(stores) && !Array.isArray(sizes)) {
    return [];
  }

  const sizeBuckets = new Map();

  if (Array.isArray(sizes)) {
    for (const sizeEntry of sizes) {
      const label =
        sizeEntry.size ??
        sizeEntry.sizeName ??
        sizeEntry.displaySize ??
        sizeEntry.label ??
        "Unknown";

      const storeAvailabilities =
        sizeEntry.stores ?? sizeEntry.availabilityByStore ?? sizeEntry.storeAvailability ?? [];

      if (!Array.isArray(storeAvailabilities)) {
        continue;
      }

      for (const storeEntry of storeAvailabilities) {
        const storeId = pickStoreId(storeEntry);

        if (!storeId) {
          continue;
        }

        const quantity =
          Number(
            storeEntry.quantity ??
              storeEntry.availableQuantity ??
              storeEntry.available ??
              storeEntry.inventory ??
              0
          ) || 0;

        if (!sizeBuckets.has(storeId)) {
          sizeBuckets.set(storeId, []);
        }

        if (quantity > 0) {
          sizeBuckets.get(storeId).push({
            size: label,
            quantity
          });
        }
      }
    }
  }

  const normalizedStores = Array.isArray(stores)
    ? stores.map((store) => {
        const storeId = pickStoreId(store);
        const sizeBreakdown = sizeBuckets.get(storeId) ?? [];
        const inStockCount = sizeBreakdown.reduce((sum, item) => sum + item.quantity, 0);

        return {
          storeId,
          name: store.name ?? store.storeName ?? null,
          inStockCount,
          sizeBreakdown,
          pickupEligible:
            store.pickupEligible ??
            store.availableForPickup ??
            store.isAvailableForPickup ??
            false
        };
      })
    : [];

  return normalizedStores;
}

function looksLikeAvailabilityPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return (
    Array.isArray(payload.stores) ||
    Array.isArray(payload.sizes) ||
    Array.isArray(payload.pickupAvailability) ||
    Array.isArray(payload.skus) ||
    Array.isArray(payload?.data?.stores) ||
    Array.isArray(payload?.data?.sizes)
  );
}

function resolveChromePath() {
  const configured = process.env.CHROME_PATH;

  if (configured && fs.existsSync(configured)) {
    return configured;
  }

  if (fs.existsSync(DEFAULT_CHROME_PATH)) {
    return DEFAULT_CHROME_PATH;
  }

  throw new HttpError(
    "Chrome could not be found. Set CHROME_PATH to a local Chrome executable to enable browser scraping.",
    500
  );
}

async function fetchBrowserArtifacts(productUrl) {
  const executablePath = resolveChromePath();
  const headlessMode = process.env.HEADLESS === "false" ? false : "new";
  const browser = await puppeteer.launch({
    executablePath,
    headless: headlessMode,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: {
      width: 1440,
      height: 1200
    }
  });

  const page = await browser.newPage();
  const payloads = [];

  page.on("response", async (response) => {
    const resourceType = response.request().resourceType();
    const url = response.url();

    if (resourceType !== "xhr" && resourceType !== "fetch") {
      return;
    }

    if (!/availability|inventory|pickup|store/i.test(url)) {
      return;
    }

    try {
      const json = await response.json();

      if (looksLikeAvailabilityPayload(json)) {
        payloads.push(json);
      }
    } catch {
      // Ignore non-JSON or malformed payloads.
    }
  });

  try {
    await page.setUserAgent(USER_AGENT);
    await page.goto(productUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await sleep(8000);

    const currentUrl = page.url();
    const html = await page.content();

    if (isBotChallengeDocument(html, currentUrl)) {
      throw new HttpError(
        "Nordstrom presented an anti-bot challenge in browser mode. Try running with HEADLESS=false and complete the challenge in the opened Chrome window.",
        502
      );
    }

    const clickedChooseStore = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const target = buttons.find((button) => {
        const text = button.textContent?.trim() ?? "";
        return /choose store|pick up|pickup/i.test(text);
      });

      if (!target) {
        return false;
      }

      target.click();
      return true;
    });

    if (clickedChooseStore) {
      await sleep(5000);
    }

    return {
      html: await page.content(),
      payloads
    };
  } finally {
    await browser.close();
  }
}

async function fetchAvailability(metadata) {
  const urls = buildAvailabilityUrls(metadata);
  const errors = [];

  for (const url of urls) {
    try {
      const payload = await fetchJson(url);
      const normalized = flattenAvailability(payload);

      if (normalized.length > 0) {
        return normalized;
      }
    } catch (error) {
      errors.push({
        url,
        message: error.message
      });
    }
  }

  throw new HttpError(
    "Could not load live store availability from Nordstrom. Their API may have changed or blocked the request.",
    502,
    errors
  );
}

function mergeAvailabilityCandidates(payloads) {
  for (const payload of payloads) {
    const normalized = flattenAvailability(payload);

    if (normalized.length > 0) {
      return normalized;
    }
  }

  return [];
}

export async function fetchNordstromInventory({ productUrl, latitude, longitude }) {
  const normalizedUrl = normalizeNordstromUrl(productUrl);
  let html = await fetchText(normalizedUrl);
  let browserPayloads = [];

  if (isBotChallengeDocument(html)) {
    const browserArtifacts = await fetchBrowserArtifacts(normalizedUrl);
    html = browserArtifacts.html;
    browserPayloads = browserArtifacts.payloads;
  }

  const metadata = extractProductMetadata(html, normalizedUrl);
  let availability = mergeAvailabilityCandidates(browserPayloads);

  if (!availability.length) {
    availability = await fetchAvailability(metadata);
  }

  const userLocation =
    typeof latitude === "number" && typeof longitude === "number"
      ? { latitude, longitude }
      : null;

  const stores = NYC_NORDSTROM_STORES.map((store) => {
    const liveAvailability = availability.find((entry) => entry.storeId === store.id);
    const totalInStock = liveAvailability?.inStockCount ?? 0;

    return {
      ...store,
      distanceMiles: getDistanceInMiles(userLocation, store),
      inStockCount: totalInStock,
      sizesAvailable: liveAvailability?.sizeBreakdown ?? [],
      pickupEligible: Boolean(liveAvailability?.pickupEligible),
      isInStock: totalInStock > 0
    };
  })
    .filter((store) => store.isInStock)
    .sort((left, right) => {
      if (left.distanceMiles == null && right.distanceMiles == null) {
        return right.inStockCount - left.inStockCount;
      }

      if (left.distanceMiles == null) {
        return 1;
      }

      if (right.distanceMiles == null) {
        return -1;
      }

      return left.distanceMiles - right.distanceMiles;
    });

  return {
    product: {
      title: metadata.productTitle,
      url: normalizedUrl
    },
    stores
  };
}
