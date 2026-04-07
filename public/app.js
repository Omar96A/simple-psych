import { diagnoses } from "./data/diagnoses.js";
import {
  ICD_CODES,
  drugbankUrl,
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
        Each profile includes explicit DSM-style criteria, a five-bullet DSM summary, validated
        scales, FDA-approved treatment sections, and key management literature.
      </p>
    </div>
    <section class="ad-slot ad-slot--banner" aria-label="Advertisement">
      <span class="ad-slot__label">Advertisement</span>
      <div class="ad-slot__box">Google Ads Banner Space</div>
    </section>
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

function renderProfileMarkup(diagnosis, { standalone }) {
  return `
    <article class="profile ${standalone ? "profile--standalone" : "profile--embedded"}">
      <header class="profile-header">
        ${standalone ? `<a class="back-link" href="/">← Back to all diagnoses</a>` : ""}
        <p class="profile-category">${escapeHtml(diagnosis.category)}</p>
        <h1>${escapeHtml(diagnosis.name)}</h1>
        <p class="profile-icd">ICD-10-CM: ${escapeHtml((ICD_CODES[diagnosis.id] ?? ["Not listed"]).join(", "))}</p>
      </header>

      <section class="ad-slot ad-slot--banner" aria-label="Advertisement">
        <span class="ad-slot__label">Advertisement</span>
        <div class="ad-slot__box">Google Ads Banner Space</div>
      </section>

      <section class="profile-section">
        <h3 class="criteria-title">1. Criteria</h3>
        ${renderCriteria(diagnosis.criteria)}
      </section>

      ${renderSummaryBullets(diagnosis)}
      ${renderScales(diagnosis.scales)}
      ${renderMedications(diagnosis)}
      <section class="ad-slot ad-slot--inline" aria-label="Advertisement">
        <span class="ad-slot__label">Advertisement</span>
        <div class="ad-slot__box">Google Ads Inline Space</div>
      </section>
      ${renderArticles(diagnosis)}
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
