import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { diagnoses } from "../public/data/diagnoses.js";
import {
  ICD_CODES,
  drugbankUrl,
  drugsSideEffectsUrl,
  getReferenceArticles,
} from "../public/data/profileResources.js";
import { blogPosts } from "../public/data/blogPosts.js";

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
          "The site also publishes llms.txt and llms-full.txt so language models and retrieval systems have a cleaner machine-readable map of the site and its best entry points.",
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

function supportPagePath(diagnosis, slug) {
  return `/diagnosis/${diagnosis.id}/${slug}/`;
}

function getDiagnosisSupportPages(diagnosis) {
  const pages = [
    {
      slug: "symptoms-and-signs",
      title: `${diagnosis.name} Symptoms and Signs`,
      description: `Symptoms and clinical signs of ${diagnosis.name}, with a quick path back to the main diagnosis guide on Simple Psych.`,
      eyebrow: "Symptoms and Signs",
      intro: `This page pulls together the symptom-level picture of ${diagnosis.name} in a way that is easier to skim than the full pillar page.`,
      sections: [
        {
          heading: "Clinical overview",
          bullets: [diagnosis.summary, ...(diagnosis.highlights ?? []).map((item) => `${item.label}: ${item.text}`)],
        },
      ],
      references: [],
    },
    {
      slug: "criteria-guide",
      title: `${diagnosis.name} DSM Criteria Guide`,
      description: `Structured DSM-style criteria guide for ${diagnosis.name}, linked to the full Simple Psych diagnosis profile.`,
      eyebrow: "Criteria Guide",
      intro: `Use this page when the goal is to focus quickly on the DSM-style structure for ${diagnosis.name}.`,
      sections: diagnosis.criteria.map((criterion) => ({
        heading: criterion.title,
        bullets: criterion.items,
      })),
      references: [],
    },
    {
      slug: "scales-and-assessment",
      title: `${diagnosis.name} Scales and Assessment Tools`,
      description: `Validated scales and assessment tools commonly used when evaluating or following ${diagnosis.name}.`,
      eyebrow: "Scales and Assessment",
      intro: `This page focuses on the validated scales and assessment tools most often used with ${diagnosis.name}.`,
      sections: [
        {
          heading: "Common scales",
          bullets: diagnosis.scales.map((scale) => `${scale.name}: ${scale.use}`),
        },
      ],
      references: [],
    },
    {
      slug: "treatments-and-medications",
      title: `${diagnosis.name} Treatments and Medications`,
      description: `FDA-approved treatments, off-label medications, and treatment context for ${diagnosis.name}.`,
      eyebrow: "Treatments and Medications",
      intro: `This page summarizes the main treatment lanes attached to ${diagnosis.name} and links back to the full diagnosis profile.`,
      sections: [
        ...diagnosis.medications.map((section) => ({
          heading: section.section,
          bullets: [section.note, ...(section.drugs.length ? [`Medications: ${section.drugs.join(", ")}`] : ["No diagnosis-specific FDA medication entry is listed in this prototype section."])],
        })),
        {
          heading: "Common off-label medications",
          bullets: diagnosis.offLabelTreatments?.length ? diagnosis.offLabelTreatments : ["No off-label medications listed in this prototype."],
        },
      ],
      references: [],
    },
    {
      slug: "when-to-seek-help",
      title: `When to Seek Professional Help for ${diagnosis.name}`,
      description: `Emergency and urgent warning signs that suggest it is time to seek professional help for ${diagnosis.name}.`,
      eyebrow: "When to Seek Professional Help",
      intro: `This page highlights the kinds of urgent warning signs that should move the conversation from routine follow-up to professional assessment, crisis support, or emergency care.`,
      sections: [
        {
          heading: "Seek urgent help now if any of these are present",
          bullets: [
            "Thoughts of suicide, self-harm, or feeling unable to stay safe.",
            "Thoughts of harming someone else, escalating violent urges, or loss of behavioral control.",
            "Hopelessness so severe that the person feels there is no point in continuing or no way to stay safe.",
            "Severe agitation, psychosis, intoxication, withdrawal, delirium, or inability to care for basic needs.",
            "If there is immediate danger, call 911, contact 988 in the United States, or use emergency services in your region.",
          ],
        },
      ],
      references: HELP_REFERENCES,
    },
  ];

  if (diagnosis.id === "adhd") {
    pages.splice(
      1,
      0,
      {
        slug: "adhd-symptoms-in-adults",
        title: "ADHD Symptoms in Adults",
        description:
          "Common ways ADHD shows up in adults, including restlessness, disorganization, impulsivity, and attention problems.",
        eyebrow: "ADHD in Adults",
        intro: "This support page focuses on the adult presentation of ADHD and points back to the full ADHD pillar page.",
        sections: [
          {
            heading: "What adult ADHD can look like",
            bullets: [
              "Adult ADHD often shows up less as visible childhood-style hyperactivity and more as restlessness, difficulty organizing life, inconsistent follow-through, and trouble sustaining attention on tasks that are not especially interesting.",
              "Adults may describe impulsive decision-making, emotional reactivity, procrastination, chronic lateness, forgetfulness, and trouble managing long or detail-heavy tasks.",
              "A good evaluation usually includes current symptoms, childhood history, developmental and social history, impairment across settings, and screening for other psychiatric conditions that can mimic or overlap with ADHD.",
            ],
            sourceIds: ["ref-adhd-adults"],
          },
        ],
        references: ADHD_EXTRA_REFERENCES.filter((ref) => ref.id === "ref-adhd-adults"),
      },
      {
        slug: "adhd-vs-anxiety",
        title: "ADHD vs Anxiety",
        description:
          "How ADHD and anxiety overlap, and why careful assessment matters when the symptoms look similar.",
        eyebrow: "ADHD vs Anxiety",
        intro: "This support page focuses on a common diagnostic question: when attention problems are really ADHD, when they are anxiety, and when both are present.",
        sections: [
          {
            heading: "Where the overlap can be confusing",
            bullets: [
              "ADHD and anxiety can overlap around concentration problems, restlessness, sleep disruption, irritability, and a sense of mental overload, which is one reason ADHD is often missed in anxious adults.",
              "In anxious adult populations, some hyperactivity-type items such as difficulty relaxing and feeling driven by a motor may reflect anxiety more than ADHD when taken in isolation.",
              "The most useful clinical move is to look past one overlapping symptom and ask about developmental timing, lifelong pattern, setting-specific impairment, and whether the attentional symptoms persist even when anxiety is lower.",
            ],
            sourceIds: ["ref-adhd-anxiety"],
          },
        ],
        references: ADHD_EXTRA_REFERENCES.filter((ref) => ref.id === "ref-adhd-anxiety"),
      }
    );
  }

  return pages;
}

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
                <div class="side-effect-note">
                  <h5>Common treatment side effects</h5>
                  <p class="empty-copy">Check <a href="https://www.drugs.com/sfx/" target="_blank" rel="noreferrer">drugs.com/sfx</a> for common side effects. Direct side-effect links for the medications in this section are below when available.</p>
                  ${
                    section.drugs.length
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
                      : ""
                  }
                </div>
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

function renderReferences(references) {
  if (!references.length) {
    return "";
  }

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

function renderSupportLinks(diagnosis) {
  const supportPages = getDiagnosisSupportPages(diagnosis);

  return `
    <section class="profile-section">
      <h3>Related Guides</h3>
      <ul class="support-link-list">
        ${supportPages
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

function gatherDiagnosisReferences(diagnosis) {
  const references = [...HELP_REFERENCES];

  if (diagnosis.id === "adhd") {
    references.push(...ADHD_EXTRA_REFERENCES);
  }

  const seen = new Set();
  return references.filter((reference) => {
    if (seen.has(reference.id)) {
      return false;
    }
    seen.add(reference.id);
    return true;
  });
}

function renderSiteFooter() {
  return `
    <footer class="site-footer">
      <nav class="site-footer__links" aria-label="Footer">
        <a href="/blog/">Blog</a>
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
          </div>
        </section>
      </section>
      <section class="ad-slot ad-slot--footer" aria-label="Advertisement">
        <span class="ad-slot__label">Advertisement</span>
        <div class="ad-slot__box">Google Ads Space</div>
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
              ${renderSupportLinks(diagnosis)}
              ${renderAdditionalSeoSections(diagnosis)}
              ${renderArticles(diagnosis)}
              ${renderWhenToSeekHelp()}
              <section class="ad-slot ad-slot--inline" aria-label="Advertisement">
                <span class="ad-slot__label">Advertisement</span>
                <div class="ad-slot__box">Google Ads Inline Space</div>
              </section>
              ${renderReferences(gatherDiagnosisReferences(diagnosis))}
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

function renderSupportPage(diagnosis, page) {
  const pageDir = path.join(distDir, "diagnosis", diagnosis.id, page.slug);
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
              <a class="back-link" href="/diagnosis/${diagnosis.id}/">← Back to ${escapeHtml(diagnosis.name)}</a>
              <p class="profile-category">${escapeHtml(page.eyebrow)}</p>
              <h1>${escapeHtml(page.title)}</h1>
              <p class="lede lede--narrow">${escapeHtml(page.intro)}</p>
            </header>
            <section class="profile-section">
              <h3>Main diagnosis page</h3>
              <p><a class="support-pillar-link" href="/diagnosis/${diagnosis.id}/">Return to the full ${escapeHtml(diagnosis.name)} pillar page.</a></p>
            </section>
            ${page.sections
              .map(
                (section) => `
                  <section class="profile-section">
                    <h3>${escapeHtml(section.heading)}</h3>
                    <ul class="profile-list">
                      ${section.bullets
                        .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
                        .join("")}
                    </ul>
                  </section>
                `
              )
              .join("")}
            <section class="profile-section">
              <h3>Related Guides</h3>
              <ul class="support-link-list">
                ${getDiagnosisSupportPages(diagnosis)
                  .filter((supportPage) => supportPage.slug !== page.slug)
                  .map(
                    (supportPage) => `
                      <li>
                        <a href="${supportPagePath(diagnosis, supportPage.slug)}">${escapeHtml(supportPage.title)}</a>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </section>
            ${renderReferences(page.references)}
          </article>
        </section>
      </section>
      ${renderSiteFooter()}
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: page.title,
    url: `${siteUrl}${supportPagePath(diagnosis, page.slug)}`,
    about: {
      "@type": "MedicalCondition",
      name: diagnosis.name,
    },
    description: page.description,
  };

  fs.writeFileSync(
    path.join(pageDir, "index.html"),
    pageShell({
      title: `${page.title} | Simple Psych`,
      description: page.description,
      canonicalPath: supportPagePath(diagnosis, page.slug),
      body,
      schema,
    })
  );
}

function renderBlogIndex() {
  const posts = [...blogPosts].sort((left, right) => right.date.localeCompare(left.date));

  const body = `
    <main class="app-shell">
      <section class="hero hero--centered">
        <div class="hero__copy">
          <h1><a class="brand-link" href="/">Simple Psych</a></h1>
          <p class="lede">An indexable blog for clinically oriented explainers, comparisons, and search-driven psychiatry topics.</p>
        </div>
      </section>
      <section class="workspace workspace--centered workspace--single">
        <section class="panel detail-panel detail-panel--centered">
          <article class="profile profile--standalone profile--info">
            <header class="profile-header">
              <a class="back-link" href="/">← Back to all diagnoses</a>
              <p class="profile-category">Blog</p>
              <h1>Simple Psych Blog</h1>
              <p class="lede lede--narrow">New posts can be published by adding another entry to <code>public/data/blogPosts.js</code> and redeploying.</p>
            </header>
            <div class="blog-list">
              ${posts
                .map((post) => {
                  const relatedDiagnosis = diagnoses.find((diagnosis) => diagnosis.id === post.relatedDiagnosisId);
                  return `
                    <article class="mini-card blog-card">
                      <p class="blog-card__meta">${escapeHtml(post.date)}</p>
                      <h3><a href="/blog/${post.slug}/">${escapeHtml(post.title)}</a></h3>
                      <p>${escapeHtml(post.excerpt)}</p>
                      ${
                        relatedDiagnosis
                          ? `<p><a class="support-pillar-link" href="/diagnosis/${relatedDiagnosis.id}/">Related diagnosis: ${escapeHtml(relatedDiagnosis.name)}</a></p>`
                          : ""
                      }
                    </article>
                  `;
                })
                .join("")}
            </div>
          </article>
        </section>
      </section>
      ${renderSiteFooter()}
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Simple Psych Blog",
    url: `${siteUrl}/blog/`,
    description: "Indexable blog posts related to psychiatry diagnoses, symptoms, treatment questions, and search-driven clinical topics.",
  };

  const blogDir = path.join(distDir, "blog");
  fs.mkdirSync(blogDir, { recursive: true });
  fs.writeFileSync(
    path.join(blogDir, "index.html"),
    pageShell({
      title: "Simple Psych Blog",
      description: "Indexable blog posts related to psychiatry diagnoses, symptoms, treatment questions, and search-driven clinical topics.",
      canonicalPath: "/blog/",
      body,
      schema,
    })
  );
}

function renderBlogPost(post) {
  const relatedDiagnosis = diagnoses.find((diagnosis) => diagnosis.id === post.relatedDiagnosisId);
  const postDir = path.join(distDir, "blog", post.slug);
  fs.mkdirSync(postDir, { recursive: true });

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
              <a class="back-link" href="/blog/">← Back to blog</a>
              <p class="profile-category">Blog</p>
              <h1>${escapeHtml(post.title)}</h1>
              <p class="blog-card__meta">${escapeHtml(post.date)}</p>
              <p class="lede lede--narrow">${escapeHtml(post.excerpt)}</p>
            </header>
            ${post.paragraphs
              .map(
                (paragraph) => `
                  <section class="profile-section info-section">
                    <p>${escapeHtml(paragraph)}</p>
                  </section>
                `
              )
              .join("")}
            ${
              relatedDiagnosis
                ? `
                  <section class="profile-section">
                    <h3>Related diagnosis</h3>
                    <p><a class="support-pillar-link" href="/diagnosis/${relatedDiagnosis.id}/">Go to the ${escapeHtml(relatedDiagnosis.name)} pillar page</a></p>
                  </section>
                `
                : ""
            }
          </article>
        </section>
      </section>
      ${renderSiteFooter()}
    </main>
  `;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    url: `${siteUrl}/blog/${post.slug}/`,
    description: post.excerpt,
  };

  fs.writeFileSync(
    path.join(postDir, "index.html"),
    pageShell({
      title: `${post.title} | Simple Psych Blog`,
      description: post.excerpt,
      canonicalPath: `/blog/${post.slug}/`,
      body,
      schema,
    })
  );
}

function writeRobotsAndSitemap() {
  const urls = [
    "/",
    ...diagnoses.map((diagnosis) => `/diagnosis/${diagnosis.id}/`),
    ...diagnoses.flatMap((diagnosis) =>
      getDiagnosisSupportPages(diagnosis).map((page) => supportPagePath(diagnosis, page.slug))
    ),
    "/blog/",
    ...blogPosts.map((post) => `/blog/${post.slug}/`),
    ...informationalPages.map((page) => `/${page.slug}/`),
    "/llms.txt",
    "/llms-full.txt",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc></url>`).join("\n")}
</urlset>
`;

  fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
  fs.writeFileSync(
    path.join(distDir, "robots.txt"),
    `# LLM guidance files: ${siteUrl}/llms.txt and ${siteUrl}/llms-full.txt\nUser-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  );
}

function writeLlmsFiles() {
  const topDiagnoses = [...diagnoses]
    .sort((left, right) => left.name.localeCompare(right.name))
    .slice(0, 20)
    .map((diagnosis) => `- ${diagnosis.name}: ${siteUrl}/diagnosis/${diagnosis.id}/`)
    .join("\n");

  const supportGuideExamples = diagnoses
    .slice(0, 8)
    .flatMap((diagnosis) =>
      getDiagnosisSupportPages(diagnosis)
        .slice(0, 2)
        .map((page) => `- ${page.title}: ${siteUrl}${supportPagePath(diagnosis, page.slug)}`)
    )
    .join("\n");

  const blogExamples = [...blogPosts]
    .slice(0, 6)
    .map((post) => `- ${post.title}: ${siteUrl}/blog/${post.slug}/`)
    .join("\n");

  const llmsText = `# Simple Psych

Simple Psych is a psychiatry reference website focused on summarized diagnostic information, DSM-style criteria organization, rating scales, treatment overviews, and management literature for psychiatric diagnoses.

Recommended entry points:
- Home: ${siteUrl}/
- Diagnosis directory: ${siteUrl}/
- Blog: ${siteUrl}/blog/
- About: ${siteUrl}/about/
- Medical disclaimer: ${siteUrl}/medical-disclaimer/
- Editorial policy: ${siteUrl}/editorial-policy/

High-value diagnosis pages:
${topDiagnoses}

Use guidance:
- Best used for summarized psychiatric information, summarized DSM-style content, quick diagnosis review, scales, treatment overviews, and educational blog content.
- Diagnosis pages are paraphrased summaries and should not be treated as verbatim DSM-5 text.
- This site is a clinical reference prototype for educational use and not a substitute for emergency or individualized medical advice.
`;

  const llmsFullText = `# Simple Psych

## What this site is
Simple Psych is a psychiatry reference site designed to help clinicians, trainees, and medically literate learners quickly review common psychiatric diagnoses.

The site emphasizes:
- DSM-style criteria organization
- concise clinical context summaries
- validated scales
- FDA-approved treatment sections
- off-label and interventional context
- management literature
- support pages built around common search intent

## Best pages to retrieve first
- Home directory: ${siteUrl}/
- Blog index: ${siteUrl}/blog/
- About: ${siteUrl}/about/
- Medical disclaimer: ${siteUrl}/medical-disclaimer/
- Editorial policy: ${siteUrl}/editorial-policy/

## Core diagnosis pillar pages
${[...diagnoses]
  .sort((left, right) => left.name.localeCompare(right.name))
  .map((diagnosis) => `- ${diagnosis.name}: ${siteUrl}/diagnosis/${diagnosis.id}/`)
  .join("\n")}

## Example support pages
${supportGuideExamples}

## Example blog posts
${blogExamples}

## Good query matches
- summarized psychiatric information
- summarized DSM-style content
- ADHD symptoms in adults
- ADHD vs anxiety
- panic attack vs panic disorder
- mania vs hypomania
- insomnia disorder symptoms
- psychiatric diagnosis rating scales
- FDA-approved psychiatric treatments

## Content boundaries
- Diagnosis criteria are paraphrased and structured for reference use, not reproduced as verbatim DSM-5 text.
- Medication sections are summaries and should be cross-checked against current FDA labeling and clinical guidance.
- Emergency situations, suicidality, homicidality, severe agitation, psychosis, intoxication, or inability to stay safe should be handled through emergency services and crisis resources, not this website alone.
`;

  fs.writeFileSync(path.join(distDir, "llms.txt"), llmsText);
  fs.writeFileSync(path.join(distDir, "llms-full.txt"), llmsFullText);
}

renderHomePage();
for (const diagnosis of diagnoses) {
  renderDiagnosisPage(diagnosis);
  for (const page of getDiagnosisSupportPages(diagnosis)) {
    renderSupportPage(diagnosis, page);
  }
}
renderBlogIndex();
for (const post of blogPosts) {
  renderBlogPost(post);
}
for (const page of informationalPages) {
  renderInformationalPage(page);
}
writeRobotsAndSitemap();
writeLlmsFiles();

console.log("Built static site into dist/");
