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
const siteUrl = (process.env.SITE_URL || "https://simplepsych.net").replace(/\/$/, "");
const analyticsId = process.env.GA_MEASUREMENT_ID || "G-5QYX920HMP";

const informationalPages = [
  {
    slug: "about",
    title: "About Simple Psych",
    description:
      "About Simple Psych, a psychiatry reference built to help clinicians quickly review criteria, context, scales, treatments, and supporting literature.",
    schemaType: "AboutPage",
    introEyebrow: "About",
    introTitle: "Built for fast, clinically oriented review.",
    introText:
      "Simple Psych is designed as a clean psychiatry reference that helps clinicians and trainees move quickly from a diagnosis name to the most useful decision-support information on the page.",
    sections: [
      {
        heading: "What the site is for",
        paragraphs: [
          "The goal is to make common psychiatric diagnoses easier to review in one place. Each diagnosis page is structured around criteria, concise DSM-context notes, validated scales, treatment sections, and management literature.",
          "The site is intended to be simple, navigable, and fast enough to use during study, chart review, supervision, and teaching.",
        ],
      },
      {
        heading: "Who it is for",
        paragraphs: [
          "Simple Psych is primarily built for psychiatrists, psychiatry trainees, therapists, primary care clinicians, and other healthcare professionals who want a concise reference layer around common psychiatric diagnoses.",
          "It may also be useful for medical students and other learners, but it is not designed to replace formal clinical training or licensed source materials.",
        ],
      },
      {
        heading: "How the content is organized",
        paragraphs: [
          "Diagnosis pages use DSM-style criterion structure, short contextual summaries, rating scales, treatment groupings, and literature links so the user can scan the most relevant information quickly.",
          "Medication and article sections are organized for navigation and review convenience, not as individualized treatment advice.",
        ],
      },
    ],
  },
  {
    slug: "medical-disclaimer",
    title: "Medical Disclaimer | Simple Psych",
    description:
      "Medical disclaimer for Simple Psych, including limitations of use, clinical judgment, emergency guidance, and source-material expectations.",
    schemaType: "WebPage",
    introEyebrow: "Medical Disclaimer",
    introTitle: "Reference support, not medical advice.",
    introText:
      "Simple Psych is an informational reference tool. It does not provide medical advice, diagnosis, treatment recommendations for a specific person, or emergency guidance tailored to an individual case.",
    sections: [
      {
        heading: "Not a substitute for clinical judgment",
        paragraphs: [
          "The information on this website should not replace clinician judgment, direct patient evaluation, supervision, or consultation with appropriate specialists.",
          "Diagnosis and treatment decisions should always be based on the full clinical picture, comorbidities, patient preferences, risk assessment, and current authoritative guidance.",
        ],
      },
      {
        heading: "Diagnostic and treatment limitations",
        paragraphs: [
          "DSM-style criteria on this site are paraphrased for educational and navigational use. They should be cross-checked against licensed source materials and institutional practice standards when precision is required.",
          "Medication sections summarize FDA-approved and commonly used off-label options at a high level. They are not individualized prescribing advice and do not replace review of labeling, contraindications, interactions, monitoring needs, or local standards of care.",
        ],
      },
      {
        heading: "Emergency and high-risk situations",
        paragraphs: [
          "Do not rely on this website for emergency, crisis, or urgent psychiatric decision-making. If there is concern for suicidality, homicidality, severe withdrawal, catatonia, delirium, acute psychosis, or another emergency condition, use emergency services and appropriate local protocols immediately.",
        ],
      },
    ],
  },
  {
    slug: "editorial-policy",
    title: "Editorial Policy | Simple Psych",
    description:
      "Editorial policy for Simple Psych, including content approach, source expectations, review philosophy, and update standards.",
    schemaType: "WebPage",
    introEyebrow: "Editorial Policy",
    introTitle: "Clarity, structure, and source-aware summaries.",
    introText:
      "Simple Psych is built around structured, scan-friendly summaries of psychiatric diagnoses, scales, treatments, and management literature with an emphasis on clear organization over exhaustive textbook reproduction.",
    sections: [
      {
        heading: "Content approach",
        paragraphs: [
          "Content is written to help users rapidly locate the key clinical elements of a diagnosis page. That includes DSM-style criterion organization, short contextual summaries, commonly used scales, treatment groupings, and selected literature links.",
          "Where copyrighted source material applies, content is paraphrased rather than reproduced verbatim.",
        ],
      },
      {
        heading: "Sources and evidence expectations",
        paragraphs: [
          "Diagnosis structure is informed by DSM-style diagnostic organization, while treatment and literature sections are meant to orient the user toward further review of current evidence and primary sources.",
          "Medication information should be confirmed against current FDA labeling, guidelines, and institution-specific practice expectations before clinical use.",
        ],
      },
      {
        heading: "Updates and revisions",
        paragraphs: [
          "Content may be revised as pages expand, citations improve, and additional diagnoses, medications, and scales are added. Users should expect iterative improvement rather than final or exhaustive coverage.",
          "If a page seems incomplete or unclear, it should be treated as a prompt for further source verification rather than a definitive endpoint.",
        ],
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact | Simple Psych",
    description:
      "Contact and feedback page for Simple Psych, including how to report corrections, request additions, and share collaboration ideas.",
    schemaType: "ContactPage",
    introEyebrow: "Contact",
    introTitle: "Feedback helps the site get better.",
    introText:
      "Simple Psych is still growing. Feedback about missing diagnoses, criteria clarity, treatment sections, broken links, and citation quality is useful and welcome.",
    sections: [
      {
        heading: "What to send",
        paragraphs: [
          "Helpful feedback includes suspected factual errors, broken page behavior, requests for additional diagnoses, suggestions for scales or treatments to include, and recommendations for higher-quality management literature.",
        ],
      },
      {
        heading: "How to reach out",
        paragraphs: [
          "For now, the simplest contact path is a direct email from the site owner or a linked professional profile. If a public contact address is added later, it should live on this page.",
          "If you want, this page can be updated next with a dedicated email address, a contact form, or links to professional profiles.",
        ],
      },
      {
        heading: "Corrections policy",
        paragraphs: [
          "When reporting a correction, include the page URL, the specific issue, and if possible the source or rationale for the change. That makes updates much faster and more reliable.",
        ],
      },
    ],
  },
];

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

function renderSiteFooter() {
  return `
    <footer class="site-footer">
      <nav class="site-footer__links" aria-label="Footer">
        <a href="/about/">About</a>
        <a href="/medical-disclaimer/">Medical Disclaimer</a>
        <a href="/editorial-policy/">Editorial Policy</a>
        <a href="/contact/">Contact</a>
      </nav>
      <p class="site-footer__note">
        Simple Psych is a clinical reference prototype for educational use and should be cross-checked against licensed source material and current guidance.
      </p>
    </footer>
  `;
}

function pageShell({ title, description, canonicalPath, body, schema }) {
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const analyticsSnippet = analyticsId
    ? `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${analyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      window.SIMPLE_PSYCH_ANALYTICS_ID = ${JSON.stringify(analyticsId)};
      gtag('js', new Date());
      gtag('config', ${JSON.stringify(analyticsId)}, { send_page_view: false });
    </script>`
    : "";
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
    ${analyticsSnippet}
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
      ${renderSiteFooter()}
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
      ${renderSiteFooter()}
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

function renderInformationalPage(page) {
  const pageDir = path.join(distDir, page.slug);
  fs.mkdirSync(pageDir, { recursive: true });

  const body = `
    <main class="app-shell">
      <section class="hero hero--centered">
        <div class="hero__copy">
          <h1><a class="brand-link" href="/">Simple Psych</a></h1>
        </div>
      </section>
      <section class="workspace workspace--centered workspace--single">
        <section class="panel detail-panel detail-panel--centered">
          <article class="profile profile--standalone profile--info">
            <header class="profile-header">
              <a class="back-link" href="/">← Back to all diagnoses</a>
              <p class="profile-category">${escapeHtml(page.introEyebrow)}</p>
              <h1>${escapeHtml(page.introTitle)}</h1>
              <p class="lede lede--narrow">${escapeHtml(page.introText)}</p>
            </header>
            ${page.sections
              .map(
                (section) => `
                  <section class="profile-section info-section">
                    <h3>${escapeHtml(section.heading)}</h3>
                    ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
                  </section>
                `
              )
              .join("")}
          </article>
        </section>
      </section>
      ${renderSiteFooter()}
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": page.schemaType,
    name: page.title,
    url: `${siteUrl}/${page.slug}/`,
    description: page.description,
  };

  fs.writeFileSync(
    path.join(pageDir, "index.html"),
    pageShell({
      title: page.title,
      description: page.description,
      canonicalPath: `/${page.slug}/`,
      body,
      schema,
    })
  );
}

function writeRobotsAndSitemap() {
  const urls = [
    "/",
    ...diagnoses.map((diagnosis) => `/diagnosis/${diagnosis.id}/`),
    ...informationalPages.map((page) => `/${page.slug}/`),
  ];

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
for (const page of informationalPages) {
  renderInformationalPage(page);
}
writeRobotsAndSitemap();

console.log("Built static site into dist/");
