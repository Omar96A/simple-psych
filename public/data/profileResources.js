function pubmedSearchUrl(query) {
  return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query)}`;
}

export const ICD_CODES = {
  "major-depressive-disorder": ["F32.9", "F33.9"],
  "bipolar-i-disorder": ["F31.9"],
  schizophrenia: ["F20.9"],
  adhd: ["F90.9"],
  "obsessive-compulsive-disorder": ["F42.9"],
  "generalized-anxiety-disorder": ["F41.1"],
  "panic-disorder": ["F41.0"],
  "social-anxiety-disorder": ["F40.10"],
  "posttraumatic-stress-disorder": ["F43.10"],
  "bipolar-ii-disorder": ["F31.81"],
  "autism-spectrum-disorder": ["F84.0"],
  "anorexia-nervosa": ["F50.00", "F50.01", "F50.02"],
  "bulimia-nervosa": ["F50.2"],
  "binge-eating-disorder": ["F50.81"],
  "alcohol-use-disorder": ["F10.20"],
  "borderline-personality-disorder": ["F60.3"],
};

export const ARTICLE_REFERENCES = {
  "major-depressive-disorder": [
    {
      title:
        "Comparative efficacy and acceptability of 21 antidepressant drugs for the acute treatment of adults with major depressive disorder",
      journal: "The Lancet, 2018",
      url: pubmedSearchUrl(
        "Comparative efficacy and acceptability of 21 antidepressant drugs for the acute treatment of adults with major depressive disorder"
      ),
    },
    {
      title:
        "Acute and longer-term outcomes in depressed outpatients requiring one or several treatment steps: a STAR*D report",
      journal: "American Journal of Psychiatry, 2006",
      url: pubmedSearchUrl(
        "Acute and longer-term outcomes in depressed outpatients requiring one or several treatment steps a STAR D report"
      ),
    },
    {
      title: "Practice guideline for the treatment of patients with major depressive disorder",
      journal: "American Psychiatric Association guideline",
      url: pubmedSearchUrl("Practice guideline for the treatment of patients with major depressive disorder"),
    },
  ],
  "bipolar-i-disorder": [
    {
      title:
        "The CANMAT and ISBD guidelines for the management of patients with bipolar disorder",
      journal: "Bipolar Disorders, 2018 update lineage",
      url: pubmedSearchUrl("CANMAT ISBD guidelines management patients with bipolar disorder"),
    },
    {
      title: "Treatment of bipolar disorder",
      journal: "The Lancet, 2013",
      url: pubmedSearchUrl("Treatment of bipolar disorder Lancet 2013"),
    },
    {
      title: "Maintenance treatment in bipolar disorder: what do guidelines recommend?",
      journal: "Review literature",
      url: pubmedSearchUrl("maintenance treatment bipolar disorder guideline review"),
    },
  ],
  "bipolar-ii-disorder": [
    {
      title:
        "The CANMAT and ISBD guidelines for the management of patients with bipolar disorder",
      journal: "Bipolar Disorders, 2018 update lineage",
      url: pubmedSearchUrl("CANMAT ISBD guidelines management patients with bipolar disorder"),
    },
    {
      title: "Treatment of bipolar disorder",
      journal: "The Lancet, 2013",
      url: pubmedSearchUrl("Treatment of bipolar disorder Lancet 2013"),
    },
    {
      title: "Bipolar II disorder: modelling, measuring, and managing",
      journal: "Focused review literature",
      url: pubmedSearchUrl("Bipolar II disorder management review"),
    },
  ],
  schizophrenia: [
    {
      title:
        "Comparative efficacy and tolerability of 15 antipsychotic drugs in schizophrenia",
      journal: "The Lancet, 2013",
      url: pubmedSearchUrl(
        "Comparative efficacy and tolerability of 15 antipsychotic drugs in schizophrenia"
      ),
    },
    {
      title: "Clozapine for the treatment-resistant schizophrenic",
      journal: "Archives of General Psychiatry, 1988",
      url: pubmedSearchUrl("Clozapine for the treatment-resistant schizophrenic"),
    },
    {
      title: "The American Psychiatric Association practice guideline for the treatment of patients with schizophrenia",
      journal: "APA guideline",
      url: pubmedSearchUrl(
        "American Psychiatric Association practice guideline treatment patients with schizophrenia"
      ),
    },
  ],
  adhd: [
    {
      title:
        "Comparative efficacy and tolerability of medications for attention-deficit hyperactivity disorder in children, adolescents, and adults",
      journal: "The Lancet Psychiatry, 2018",
      url: pubmedSearchUrl(
        "Comparative efficacy and tolerability of medications for attention-deficit hyperactivity disorder in children adolescents and adults"
      ),
    },
    {
      title:
        "A 14-month randomized clinical trial of treatment strategies for attention-deficit/hyperactivity disorder",
      journal: "Archives of General Psychiatry, MTA study",
      url: pubmedSearchUrl(
        "14-month randomized clinical trial treatment strategies attention-deficit/hyperactivity disorder"
      ),
    },
    {
      title: "World Federation of ADHD international consensus statement",
      journal: "Consensus literature",
      url: pubmedSearchUrl("ADHD international consensus statement"),
    },
  ],
  "obsessive-compulsive-disorder": [
    {
      title: "Drug treatment of obsessive-compulsive disorder",
      journal: "Review literature",
      url: pubmedSearchUrl("drug treatment obsessive-compulsive disorder review"),
    },
    {
      title: "Exposure and response prevention for obsessive-compulsive disorder",
      journal: "Psychotherapy literature",
      url: pubmedSearchUrl("exposure and response prevention obsessive-compulsive disorder"),
    },
    {
      title: "Practice guideline for the treatment of patients with obsessive-compulsive disorder",
      journal: "APA guideline",
      url: pubmedSearchUrl(
        "practice guideline treatment patients with obsessive-compulsive disorder"
      ),
    },
  ],
  "generalized-anxiety-disorder": [
    {
      title: "Evidence-based pharmacological treatment of generalized anxiety disorder",
      journal: "Review literature",
      url: pubmedSearchUrl("evidence based pharmacological treatment generalized anxiety disorder"),
    },
    {
      title:
        "Efficacy of cognitive behavioral therapy for anxiety-related disorders: a meta-analysis",
      journal: "Meta-analysis literature",
      url: pubmedSearchUrl("cognitive behavioral therapy meta-analysis generalized anxiety disorder"),
    },
    {
      title: "Guidelines for the pharmacological treatment of anxiety disorders",
      journal: "Guideline literature",
      url: pubmedSearchUrl("guidelines pharmacological treatment anxiety disorders"),
    },
  ],
  "panic-disorder": [
    {
      title: "Panic disorder and agoraphobia",
      journal: "The Lancet review",
      url: pubmedSearchUrl("panic disorder and agoraphobia Lancet"),
    },
    {
      title: "CBT and medication for panic disorder",
      journal: "Comparative treatment literature",
      url: pubmedSearchUrl("cognitive behavioral therapy medication panic disorder meta-analysis"),
    },
    {
      title: "Guidelines for the treatment of panic disorder",
      journal: "Guideline literature",
      url: pubmedSearchUrl("guideline treatment panic disorder"),
    },
  ],
  "social-anxiety-disorder": [
    {
      title: "Social anxiety disorder",
      journal: "The Lancet review",
      url: pubmedSearchUrl("social anxiety disorder Lancet"),
    },
    {
      title: "Cognitive behavioral therapy for social anxiety disorder",
      journal: "Treatment literature",
      url: pubmedSearchUrl("cognitive behavioral therapy social anxiety disorder review"),
    },
    {
      title: "Pharmacotherapy for social anxiety disorder",
      journal: "Review literature",
      url: pubmedSearchUrl("pharmacotherapy social anxiety disorder review"),
    },
  ],
  "posttraumatic-stress-disorder": [
    {
      title:
        "Clinician-Administered PTSD Scale for DSM-5 and the broader PTSD treatment literature",
      journal: "Assessment and management literature",
      url: pubmedSearchUrl("PTSD treatment guideline CAPS-5 review"),
    },
    {
      title: "Psychological therapies for chronic post-traumatic stress disorder in adults",
      journal: "Systematic review literature",
      url: pubmedSearchUrl(
        "psychological therapies for chronic post-traumatic stress disorder in adults systematic review"
      ),
    },
    {
      title: "VA/DoD clinical practice guideline for the management of PTSD",
      journal: "Guideline literature",
      url: pubmedSearchUrl("VA DoD clinical practice guideline management PTSD"),
    },
  ],
  "alcohol-use-disorder": [
    {
      title:
        "Pharmacotherapy for adults with alcohol use disorders in outpatient settings: a systematic review and meta-analysis",
      journal: "JAMA, 2014",
      url: pubmedSearchUrl(
        "Pharmacotherapy for adults with alcohol use disorders in outpatient settings a systematic review and meta-analysis"
      ),
    },
    {
      title:
        "Combined pharmacotherapies and behavioral interventions for alcohol dependence: the COMBINE study",
      journal: "JAMA, 2006",
      url: pubmedSearchUrl(
        "combined pharmacotherapies and behavioral interventions for alcohol dependence the COMBINE study"
      ),
    },
    {
      title: "Management of alcohol use disorder in adults",
      journal: "Guideline literature",
      url: pubmedSearchUrl("management of alcohol use disorder in adults guideline"),
    },
  ],
};

export function getReferenceArticles(diagnosisId, diagnosisName) {
  return (
    ARTICLE_REFERENCES[diagnosisId] ?? [
      {
        title: `Management review for ${diagnosisName}`,
        journal: "PubMed search",
        url: pubmedSearchUrl(`${diagnosisName} management review`),
      },
      {
        title: `${diagnosisName} treatment guideline`,
        journal: "PubMed search",
        url: pubmedSearchUrl(`${diagnosisName} treatment guideline`),
      },
      {
        title: `${diagnosisName} pharmacotherapy or psychotherapy review`,
        journal: "PubMed search",
        url: pubmedSearchUrl(`${diagnosisName} treatment systematic review`),
      },
    ]
  );
}

export function drugbankUrl(drugName) {
  return `https://go.drugbank.com/unearth/q?query=${encodeURIComponent(drugName)}&searcher=drugs`;
}
