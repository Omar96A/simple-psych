import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { diagnoses } from "../public/data/diagnoses.js";
import {
  ICD_CODES,
  drugbankUrl,
  getReferenceArticles,
} from "../public/data/profileResources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const distDir = path.join(rootDir, "dist");
const siteUrl = (process.env.SITE_URL || "https://simplepsych.com").replace(/\/$/, "");

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
fs.cpSync(publicDir, distDir, { recursive: true });

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildSummaryBullets(diagnosis) {
  const bullets = [
    diagnosis.summary,
    ...(diagnosis.highlights ?? []).map((highlight) => `${highlight.label}: ${highlight.text}`),
  ];

  while (bullets.length < 5) {
    bullets.push(
      `Clinical focus: ${diagnosis.scales?.[0]?.use ?? "Track symptom burden and impairment over time."}`
    );
  }

  return bullets.slice(0, 5);
}

function renderCriteria(criteria) {
  return criteria
    .map(
      (group, index) => `
        <section class="criterion-card criterion-card--${index % 4}">
          <div class="criterion-card__header">
            <p class="criterion-card__eyebrow">DSM Criteria</p>
            <h3>${escapeHtml(group.title)}</h3>
          </div>
          <ul class="profile-list">
            ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
      `
    )
    .join("");
}

function renderScales(scales) {
  return `
    <section class="profile-section">
      <h3>3. Validated scales</h3>
      <div class="card-stack">
        ${scales
          .map(
            (scale) => `
              <article class="mini-card">
                <h4>${escapeHtml(scale.name)}</h4>
                <p>${escapeHtml(scale.use)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderTreatments(diagnosis) {
  return `
    <section class="profile-section">
      <h3>4. FDA approved treatments</h3>
      <div class="card-stack">
        ${diagnosis.medications
          .map(
            (section) => `
              <article class="mini-card">
                <h4>${escapeHtml(section.section)}</h4>
                <p>${escapeHtml(section.note)}</p>
                ${
                  section.drugs.length
                    ? `<ul class="tag-list">
                        ${section.drugs
                          .map(
                            (drug) => `
                              <li>
                                <a class="tag" href="${drugbankUrl(drug)}" target="_blank" rel="noreferrer">${escapeHtml(drug)}</a>
                              </li>
                            `
                          )
                          .join("")}
                      </ul>`
                    : `<p class="empty-copy">No diagnosis-specific FDA medication entry is listed in this prototype section.</p>`
                }
              </article>
            `
          )
          .join("")}
      </div>
      <div class="treatment-extras">
        <article class="mini-card">
          <h4>Common off-label medications</h4>
          ${
            (diagnosis.offLabelTreatments ?? []).length
              ? `<ul class="tag-list">
                  ${diagnosis.offLabelTreatments
                    .map(
                      (drug) => `
                        <li>
                          <a class="tag" href="${drugbankUrl(drug)}" target="_blank" rel="noreferrer">${escapeHtml(drug)}</a>
                        </li>
                      `
                    )
                    .join("")}
                </ul>`
              : `<p class="empty-copy">No off-label medications listed in this prototype.</p>`
          }
        </article>
        <article class="mini-card">
          <h4>Interventional psychiatry modalities</h4>
          ${
            (diagnosis.interventionalOptions ?? []).length
              ? `<ul class="profile-list">
                  ${diagnosis.interventionalOptions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>`
              : `<p class="empty-copy">No interventional modalities listed in this prototype.</p>`
          }
        </article>
      </div>
    </section>
  `;
}

function renderArticles(diagnosis) {
  const articles = getReferenceArticles(diagnosis.id, diagnosis.name);
  return `
    <section class="profile-section">
      <h3>5. Top management articles</h3>
      <ol class="article-list">
        ${articles
          .map(
            (article) => `
              <li>
                <a href="${article.url}" target="_blank" rel="noreferrer">${escapeHtml(article.title)}</a>
                <span>${escapeHtml(article.journal)}</span>
              </li>
            `
          )
          .join("")}
      </ol>
    </section>
  `;
}

function pageShell({ title, description, canonicalPath, body, schema }) {
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="Simple Psych" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <link rel="stylesheet" href="/styles.css" />
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>
  <body data-page="${canonicalPath === "/" ? "home" : "detail"}">
    ${body}
  </body>
</html>`;
}

function renderHomePage() {
  const diagnosisItems = [...diagnoses].sort((a, b) => a.name.localeCompare(b.name));
  const description =
    "Simple Psych is a psychiatry diagnosis directory with criteria, context, scales, treatments, and literature for common psychiatric disorders.";

  const body = `
    <main class="app-shell">
      <section class="hero hero--centered">
        <div class="hero__copy">
          <h1><a class="brand-link" href="/">Simple Psych</a></h1>
          <p class="lede">
            A diagnosis directory for psychiatry with profile pages that surface explicit DSM
            criteria, concise DSM-context summaries, validated scales, treatment sections, and
            linked management literature.
          </p>
        </div>
      </section>
      <section class="workspace workspace--centered">
        <aside class="panel search-panel search-panel--centered">
          <label class="search-label" for="diagnosis-search">Search here</label>
          <div class="search-input-wrap">
            <input
              id="diagnosis-search"
              name="query"
              type="search"
              placeholder="Search diagnoses, meds, symptoms"
              autocomplete="off"
            />
          </div>
          <p id="search-meta" class="search-meta">${diagnosisItems.length} diagnoses</p>
          <div id="diagnosis-list" class="diagnosis-list" aria-live="polite">
            <ul class="directory-list">
              ${diagnosisItems
                .map(
                  (diagnosis) => `
                    <li class="directory-list__item">
                      <a class="directory-link" href="/diagnosis/${diagnosis.id}/">${escapeHtml(diagnosis.name)}</a>
                      <span class="directory-meta">${escapeHtml(diagnosis.category)}</span>
                    </li>
                  `
                )
                .join("")}
            </ul>
          </div>
        </aside>
        <section class="panel detail-panel detail-panel--centered">
          <div id="detail-view" class="detail-view" aria-live="polite">
            <div class="home-note">
              <p class="home-note__eyebrow">Diagnosis Profiles</p>
              <h2>Select a diagnosis.</h2>
              <p>
                Each profile includes explicit DSM-style criteria, a five-bullet DSM summary,
                validated scales, FDA-approved treatment sections, and key management literature.
              </p>
            </div>
            <section class="ad-slot ad-slot--banner" aria-label="Advertisement">
              <span class="ad-slot__label">Advertisement</span>
              <div class="ad-slot__box">Google Ads Banner Space</div>
            </section>
          </div>
        </section>
      </section>
    </main>
    <script type="module" src="/app.js"></script>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Simple Psych",
    url: `${siteUrl}/`,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  fs.writeFileSync(
    path.join(distDir, "index.html"),
    pageShell({
      title: "Simple Psych",
      description,
      canonicalPath: "/",
      body,
      schema,
    })
  );
}

function renderDiagnosisPage(diagnosis) {
  const diagnosisDir = path.join(distDir, "diagnosis", diagnosis.id);
  fs.mkdirSync(diagnosisDir, { recursive: true });

  const description = `${diagnosis.name}: criteria, context, validated scales, FDA approved treatments, off-label strategies, interventional psychiatry options, and management literature.`;
  const codes = ICD_CODES[diagnosis.id] ?? [];

  const body = `
    <main class="app-shell">
      <section class="hero hero--centered">
        <div class="hero__copy">
          <h1><a class="brand-link" href="/">Simple Psych</a></h1>
        </div>
      </section>
      <section class="workspace workspace--centered">
        <section class="panel detail-panel detail-panel--centered">
          <div class="detail-view">
            <article class="profile profile--standalone">
              <header class="profile-header">
                <a class="back-link" href="/">← Back to all diagnoses</a>
                <p class="profile-category">${escapeHtml(diagnosis.category)}</p>
                <h1>${escapeHtml(diagnosis.name)}</h1>
                <p class="profile-icd">ICD-10-CM: ${escapeHtml(codes.length ? codes.join(", ") : "Not listed")}</p>
              </header>

              <section class="ad-slot ad-slot--banner" aria-label="Advertisement">
                <span class="ad-slot__label">Advertisement</span>
                <div class="ad-slot__box">Google Ads Banner Space</div>
              </section>

              <section class="profile-section">
                <h3 class="criteria-title">1. Criteria</h3>
                ${renderCriteria(diagnosis.criteria)}
              </section>

              <section class="profile-section profile-section--summary">
                <h3 class="summary-title">2. Context</h3>
                <ul class="profile-list">
                  ${buildSummaryBullets(diagnosis).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
              </section>

              ${renderScales(diagnosis.scales)}
              ${renderTreatments(diagnosis)}
              <section class="ad-slot ad-slot--inline" aria-label="Advertisement">
                <span class="ad-slot__label">Advertisement</span>
                <div class="ad-slot__box">Google Ads Inline Space</div>
              </section>
              ${renderArticles(diagnosis)}
            </article>
          </div>
        </section>
      </section>
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${diagnosis.name} | Simple Psych`,
    url: `${siteUrl}/diagnosis/${diagnosis.id}/`,
    about: {
      "@type": "MedicalCondition",
      name: diagnosis.name,
      code: codes.join(", "),
    },
    description,
  };

  fs.writeFileSync(
    path.join(diagnosisDir, "index.html"),
    pageShell({
      title: `${diagnosis.name} | Simple Psych`,
      description,
      canonicalPath: `/diagnosis/${diagnosis.id}/`,
      body,
      schema,
    })
  );
}

function writeRobotsAndSitemap() {
  const urls = ["/", ...diagnoses.map((diagnosis) => `/diagnosis/${diagnosis.id}/`)];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc></url>`).join("\n")}
</urlset>
`;

  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
  fs.writeFileSync(
    path.join(distDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  );
}

renderHomePage();
for (const diagnosis of diagnoses) {
  renderDiagnosisPage(diagnosis);
}
writeRobotsAndSitemap();

console.log("Built static site into dist/");
