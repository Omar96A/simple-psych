import { diagnoses } from "./data/diagnoses.js";
import {
  ICD_CODES,
  drugbankUrl,
  drugsSideEffectsUrl,
  getReferenceArticles as getSharedReferenceArticles,
} from "./data/profileResources.js";

const searchInput = document.querySelector("#diagnosis-search");
const searchMeta = document.querySelector("#search-meta");
const diagnosisList = document.querySelector("#diagnosis-list");
const detailView = document.querySelector("#detail-view");

const state = {
  query: "",
};

const desktopMediaQuery = window.matchMedia("(min-width: 981px)");

const HELP_REFERENCES = [
  {
    id: "ref-988-help",
    href: "https://988lifeline.org/get-help/",
    label: "988 Lifeline Get Help page (updated date not listed by source; accessed April 7, 2026)",
  },
  {
    id: "ref-988-faq",
    href: "https://988lifeline.org/current-events/the-lifeline-and-988/",
    label: "988 Lifeline overview of 988 and crisis support (updated date not listed by source; accessed April 7, 2026)",
  },
];

const ADHD_EXTRA_REFERENCES = [
  {
    id: "ref-adhd-adults",
    href: "https://www.psychiatry.org/patients-families/adhd/adhd-in-adults",
    label:
      "American Psychiatric Association, ADHD in Adults (physician review listed; updated date not listed by source; accessed April 7, 2026)",
  },
  {
    id: "ref-adhd-anxiety",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11409565/",
    label:
      "Are We Measuring ADHD or Anxiety? Examining the Factor Structure and Discriminant Validity of the Adult ADHD Self-Report Scale in an Adult Anxiety Disorder Population (published January 30, 2024; PMC article accessed April 7, 2026)",
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function trackPageView() {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
}

function slugForDiagnosis(diagnosis) {
  return `/diagnosis/${diagnosis.id}`;
}

function supportPagePath(diagnosis, slug) {
  return `/diagnosis/${diagnosis.id}/${slug}/`;
}

function getDiagnosisSupportPages(diagnosis) {
  const pages = [
    { slug: "symptoms-and-signs", title: `${diagnosis.name} Symptoms and Signs` },
    { slug: "criteria-guide", title: `${diagnosis.name} DSM Criteria Guide` },
    { slug: "scales-and-assessment", title: `${diagnosis.name} Scales and Assessment Tools` },
    { slug: "treatments-and-medications", title: `${diagnosis.name} Treatments and Medications` },
    { slug: "when-to-seek-help", title: `When to Seek Professional Help for ${diagnosis.name}` },
  ];

  if (diagnosis.id === "adhd") {
    pages.splice(
      1,
      0,
      { slug: "adhd-symptoms-in-adults", title: "ADHD Symptoms in Adults" },
      { slug: "adhd-vs-anxiety", title: "ADHD vs Anxiety" }
    );
  }

  return pages;
}

function gatherDiagnosisReferences(diagnosis) {
  const references = [...HELP_REFERENCES];

  if (diagnosis.id === "adhd") {
    references.push(...ADHD_EXTRA_REFERENCES);
  }

  return references.filter((reference, index, array) => array.findIndex((item) => item.id === reference.id) === index);
}

function getSelectedDiagnosis() {
  const match = window.location.pathname.match(/^\/diagnosis\/([^/]+)$/);
  if (!match) {
    return null;
  }

  return diagnoses.find((diagnosis) => diagnosis.id === match[1]) ?? null;
}

function isDesktopMode() {
  return desktopMediaQuery.matches;
}

function getFilteredDiagnoses() {
  const query = state.query.trim().toLowerCase();

  if (!query) {
    return [...diagnoses].sort((left, right) => left.name.localeCompare(right.name));
  }

  return diagnoses
    .filter((diagnosis) => {
      const haystack = [
        diagnosis.name,
        diagnosis.category,
        ...(diagnosis.aliases ?? []),
        ...(diagnosis.searchTerms ?? []),
        ...diagnosis.criteria.flatMap((group) => group.items),
        ...diagnosis.scales.map((scale) => scale.name),
        ...diagnosis.medications.flatMap((section) => section.drugs),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function buildSummaryBullets(diagnosis) {
  const bullets = [
    diagnosis.summary,
    ...(diagnosis.highlights ?? []).map((highlight) => `${highlight.label}: ${highlight.text}`),
  ];

  while (bullets.length < 5) {
    if (bullets.length === 4) {
      bullets.push(`Clinical focus: ${diagnosis.scales[0]?.use ?? "Track symptom burden and impairment over time."}`);
    } else {
      bullets.push(
        `Boundary check: ${diagnosis.criteria[diagnosis.criteria.length - 1]?.items?.[0] ?? "Rule out substances, medical causes, and overlapping syndromes."}`
      );
    }
  }

  return bullets.slice(0, 5);
}

function getReferenceArticles(diagnosis) {
  return getSharedReferenceArticles(diagnosis.id, diagnosis.name);
}

function renderHomePage() {
  const items = getFilteredDiagnoses();

  document.body.dataset.page = "home";
  document.title = "Simple Psych";
  window.scrollTo({ top: 0, behavior: "auto" });

  searchMeta.textContent = `${items.length} diagnosis${items.length === 1 ? "" : "es"}`;

  diagnosisList.innerHTML = `
    <ul class="directory-list">
      ${items
        .map(
          (diagnosis) => `
            <li class="directory-list__item">
              <a class="directory-link" href="${slugForDiagnosis(diagnosis)}">${escapeHtml(diagnosis.name)}</a>
              <span class="directory-meta">${escapeHtml(diagnosis.category)}</span>
            </li>
          `
        )
        .join("")}
    </ul>
  `;

  detailView.innerHTML = `
    <div class="home-note">
      <p class="home-note__eyebrow">Diagnosis Profiles</p>
      <h2>Select a diagnosis.</h2>
      <p>
        Open any diagnosis to get a clean, clinician-friendly summary with criteria, context,
        assessment tools, treatment options, and practical reference points you can scan quickly.
      </p>
    </div>
  `;
}

function renderDesktopDetailPane(diagnosis) {
  document.body.dataset.page = "home";
  document.title = `${diagnosis.name} | Simple Psych`;
  searchMeta.textContent = `${getFilteredDiagnoses().length} diagnosis${getFilteredDiagnoses().length === 1 ? "" : "es"}`;

  detailView.innerHTML = renderProfileMarkup(diagnosis, { standalone: false });
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

function renderSummaryBullets(diagnosis) {
  return `
    <section class="profile-section profile-section--summary">
      <h3 class="summary-title">2. Context</h3>
      <ul class="profile-list">
        ${buildSummaryBullets(diagnosis)
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}
      </ul>
    </section>
  `;
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

function renderMedications(diagnosis) {
  const medications = diagnosis.medications ?? [];
  const offLabelTreatments = diagnosis.offLabelTreatments ?? [];
  const interventionalOptions = diagnosis.interventionalOptions ?? [];

  return `
    <section class="profile-section">
      <h3>4. FDA approved treatments</h3>
      <div class="card-stack">
        ${medications
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
                <div class="side-effect-note">
                  <h5>Common treatment side effects</h5>
                  <p class="empty-copy">Check <a href="https://www.drugs.com/sfx/" target="_blank" rel="noreferrer">drugs.com/sfx</a> for common side effects. Direct side-effect links for the medications in this section are below when available.</p>
                  ${section.drugs.length
                    ? `<ul class="support-link-list">
                        ${section.drugs
                          .map(
                            (drug) => `
                              <li>
                                <a href="${drugsSideEffectsUrl(drug)}" target="_blank" rel="noreferrer">${escapeHtml(drug)} side effects</a>
                              </li>
                            `
                          )
                          .join("")}
                      </ul>`
                    : ""}
                </div>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="treatment-extras">
        <article class="mini-card">
          <h4>Common off-label medications</h4>
          ${offLabelTreatments.length
            ? `<ul class="tag-list">
                ${offLabelTreatments
                  .map(
                    (drug) => `
                      <li>
                        <a class="tag" href="${drugbankUrl(drug)}" target="_blank" rel="noreferrer">${escapeHtml(drug)}</a>
                      </li>
                    `
                  )
                  .join("")}
              </ul>`
            : `<p class="empty-copy">No off-label medications listed in this prototype.</p>`}
        </article>
        <article class="mini-card">
          <h4>Interventional psychiatry modalities</h4>
          ${interventionalOptions.length
            ? `<ul class="profile-list">
                ${interventionalOptions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>`
            : `<p class="empty-copy">No interventional modalities listed in this prototype.</p>`}
        </article>
      </div>
    </section>
  `;
}

function renderArticles(diagnosis) {
  return `
    <section class="profile-section">
      <h3>5. Top management articles</h3>
      <ol class="article-list">
        ${getReferenceArticles(diagnosis)
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

function renderSupportLinks(diagnosis) {
  return `
    <section class="profile-section">
      <h3>Related Guides</h3>
      <ul class="support-link-list">
        ${getDiagnosisSupportPages(diagnosis)
          .map(
            (page) => `
              <li>
                <a href="${supportPagePath(diagnosis, page.slug)}">${escapeHtml(page.title)}</a>
              </li>
            `
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderAdditionalSeoSections(diagnosis) {
  if (diagnosis.id !== "adhd") {
    return "";
  }

  return `
    <section class="profile-section">
      <h3>6. ADHD symptoms in adults</h3>
      <ul class="profile-list">
        <li>Adult ADHD often looks less like obvious childhood hyperactivity and more like restlessness, difficulty organizing life, inconsistent follow-through, and trouble sustaining attention on tasks that are not especially interesting.<sup><a href="#ref-adhd-adults">1</a></sup></li>
        <li>Adults may describe impulsive decision-making, emotional reactivity, procrastination, chronic lateness, forgetfulness, and trouble managing long or detail-heavy tasks.<sup><a href="#ref-adhd-adults">1</a></sup></li>
        <li>A good evaluation usually includes current symptoms, childhood history, developmental and social history, impairment across settings, and screening for other psychiatric conditions that can mimic or overlap with ADHD.<sup><a href="#ref-adhd-adults">1</a></sup></li>
      </ul>
    </section>
    <section class="profile-section">
      <h3>7. ADHD vs anxiety</h3>
      <ul class="profile-list">
        <li>ADHD and anxiety can overlap around concentration problems, restlessness, sleep disruption, irritability, and a sense of mental overload, which is one reason ADHD is often missed in anxious adults.<sup><a href="#ref-adhd-anxiety">2</a></sup></li>
        <li>In anxious adult populations, some hyperactivity-type items such as difficulty relaxing and feeling driven by a motor may reflect anxiety more than ADHD when taken in isolation.<sup><a href="#ref-adhd-anxiety">2</a></sup></li>
        <li>The most useful clinical move is to look past one overlapping symptom and ask about developmental timing, lifelong pattern, setting-specific impairment, and whether the attentional symptoms persist even when anxiety is lower.<sup><a href="#ref-adhd-anxiety">2</a></sup></li>
      </ul>
    </section>
  `;
}

function renderWhenToSeekHelp() {
  return `
    <section class="profile-section">
      <h3>When to seek professional help</h3>
      <ul class="profile-list">
        <li>Seek urgent help if there are thoughts of suicide, self-harm, or feeling unable to stay safe.<sup><a href="#ref-988-help">3</a></sup></li>
        <li>Seek urgent help if there are thoughts of harming someone else, escalating violent urges, or loss of behavioral control.<sup><a href="#ref-988-help">3</a></sup></li>
        <li>Take hopelessness seriously, especially if the person feels trapped, cannot imagine staying safe, or is withdrawing from support.<sup><a href="#ref-988-faq">4</a></sup></li>
        <li>Use emergency services if there is immediate danger, severe agitation, psychosis, intoxication, or inability to care for basic needs. In the United States, call or text 988 for crisis support and call 911 for immediate danger. Use emergency services in your region if you are outside the U.S.<sup><a href="#ref-988-help">3</a></sup></li>
      </ul>
    </section>
  `;
}

function renderReferences(diagnosis) {
  const references = gatherDiagnosisReferences(diagnosis);

  return `
    <section class="profile-section">
      <h3>References</h3>
      <ul class="reference-list">
        ${references
          .map(
            (reference) => `
              <li id="${escapeHtml(reference.id)}">
                <a href="${reference.href}" target="_blank" rel="noreferrer">${escapeHtml(reference.label)}</a>
              </li>
            `
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderProfileMarkup(diagnosis, { standalone }) {
  return `
    <article class="profile ${standalone ? "profile--standalone" : "profile--embedded"}">
      <header class="profile-header">
        ${standalone ? `<a class="back-link" href="/">← Back to all diagnoses</a>` : ""}
        <p class="profile-category">${escapeHtml(diagnosis.category)}</p>
        <h1>${escapeHtml(diagnosis.name)}</h1>
        <p class="profile-icd">ICD-10-CM: ${escapeHtml((ICD_CODES[diagnosis.id] ?? ["Not listed"]).join(", "))}</p>
      </header>

      <section class="profile-section">
        <h3 class="criteria-title">1. Criteria</h3>
        ${renderCriteria(diagnosis.criteria)}
      </section>

      ${renderSummaryBullets(diagnosis)}
      ${renderScales(diagnosis.scales)}
      ${renderMedications(diagnosis)}
      ${renderSupportLinks(diagnosis)}
      ${renderAdditionalSeoSections(diagnosis)}
      ${renderArticles(diagnosis)}
      ${renderWhenToSeekHelp()}
      <section class="ad-slot ad-slot--inline" aria-label="Advertisement">
        <span class="ad-slot__label">Advertisement</span>
        <div class="ad-slot__box">Google Ads Inline Space</div>
      </section>
      ${renderReferences(diagnosis)}
    </article>
  `;
}

function renderDetailPage(diagnosis) {
  document.body.dataset.page = "detail";
  document.title = `${diagnosis.name} | Simple Psych`;
  window.scrollTo({ top: 0, behavior: "auto" });

  searchMeta.textContent = "";
  diagnosisList.innerHTML = "";

  detailView.innerHTML = renderProfileMarkup(diagnosis, { standalone: true });
}

function renderNotFound() {
  document.body.dataset.page = "detail";
  window.scrollTo({ top: 0, behavior: "auto" });
  searchMeta.textContent = "";
  diagnosisList.innerHTML = "";
  detailView.innerHTML = `
    <div class="home-note">
      <a class="back-link" href="/">← Back to all diagnoses</a>
      <h2>Diagnosis not found</h2>
      <p>Return to the directory and select one of the diagnoses currently profiled in the app.</p>
    </div>
  `;
}

function render() {
  const selectedDiagnosis = getSelectedDiagnosis();

  if (window.location.pathname.startsWith("/diagnosis/")) {
    if (selectedDiagnosis) {
      if (isDesktopMode()) {
        renderHomePage();
        renderDesktopDetailPane(selectedDiagnosis);
      } else {
        renderDetailPage(selectedDiagnosis);
      }
    } else {
      renderNotFound();
    }
    trackPageView();
    return;
  }

  renderHomePage();
  trackPageView();
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

diagnosisList.addEventListener("click", (event) => {
  const link = event.target.closest("a[href^=\"/diagnosis/\"]");

  if (!link || !isDesktopMode()) {
    return;
  }

  event.preventDefault();
  window.history.pushState({}, "", link.getAttribute("href"));
  render();
});

window.addEventListener("popstate", () => {
  render();
});

desktopMediaQuery.addEventListener("change", () => {
  render();
});

render();
