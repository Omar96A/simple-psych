import { diagnoses } from "./diagnoses.js";
import { getReferenceArticles } from "./profileResources.js";

function diagnosisPath(diagnosisId) {
  return `/diagnosis/${diagnosisId}/`;
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle(items, seed) {
  const result = [...items];
  let state = hashString(seed) || 1;

  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) % 4294967296;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function formatArticleReference(article, index) {
  return {
    label: `${index + 1}. ${article.title}`,
    url: article.url,
  };
}

function getDiagnosisSources(diagnosis) {
  const articles = getReferenceArticles(diagnosis.id, diagnosis.name);
  return [
    {
      label: `${diagnosis.name} study guide`,
      url: diagnosisPath(diagnosis.id),
    },
    ...articles.slice(0, 2).map(formatArticleReference),
  ];
}

function dedupeSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    const key = `${source.label}|${source.url}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function pickOtherDiagnoses(currentDiagnosis, count, seed, matcher = () => true) {
  const pool = diagnoses.filter((diagnosis) => diagnosis.id !== currentDiagnosis.id && matcher(diagnosis));
  return seededShuffle(pool, seed).slice(0, count);
}

function findRuleOutItem(diagnosis) {
  return (
    diagnosis.criteria
      .flatMap((criterion) =>
        criterion.items.map((item) => ({
          title: criterion.title,
          item,
        }))
      )
      .find(({ item }) =>
        /not attributable|better explained|ruled out|never been|not due|not better explained|substance|medical/i.test(item)
      ) ?? {
      title: diagnosis.criteria[diagnosis.criteria.length - 1]?.title ?? "Criterion",
      item: diagnosis.criteria[diagnosis.criteria.length - 1]?.items?.[0] ?? diagnosis.summary,
    }
  );
}

function buildOption(id, text, isCorrect, explanation, sources) {
  return {
    id,
    text,
    isCorrect,
    explanation,
    sources,
  };
}

function buildRecognitionQuestion(diagnosis, index) {
  const distractors = pickOtherDiagnoses(
    diagnosis,
    3,
    `${diagnosis.id}-recognition-${index}`,
    (candidate) => candidate.category === diagnosis.category
  );
  const fallbackDistractors =
    distractors.length === 3
      ? distractors
      : [
          ...distractors,
          ...pickOtherDiagnoses(diagnosis, 3 - distractors.length, `${diagnosis.id}-recognition-fallback-${index}`),
        ];

  const stem = `A psychiatry resident is reviewing a case that fits this description: ${diagnosis.summary} ${diagnosis.highlights?.[0]?.text ?? ""} Which diagnosis best fits this clinical picture?`;
  const options = [
    buildOption(
      "A",
      diagnosis.name,
      true,
      `${diagnosis.name} is the best fit because the vignette is built from this diagnosis page's summary and high-yield framing points.`,
      getDiagnosisSources(diagnosis)
    ),
    ...fallbackDistractors.map((candidate, optionIndex) =>
      buildOption(
        String.fromCharCode(66 + optionIndex),
        candidate.name,
        false,
        `${candidate.name} is a reasonable distractor, but its core framing on Simple Psych emphasizes a different syndrome and diagnostic anchor.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-recognition`,
    diagnosisId: diagnosis.id,
    mode: "recognition",
    stem,
    options: seededShuffle(options, `${diagnosis.id}-recognition-options`),
    takeaway: `When a board-style vignette is broad, anchor yourself to the central diagnostic frame rather than any single isolated symptom.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildThresholdQuestion(diagnosis) {
  const distractors = pickOtherDiagnoses(diagnosis, 3, `${diagnosis.id}-threshold`);
  const correctText = diagnosis.criteria[0]?.items?.[0] ?? diagnosis.summary;
  const options = [
    buildOption(
      "A",
      correctText,
      true,
      `This is the threshold language summarized under ${diagnosis.criteria[0]?.title ?? "the opening criterion"} for ${diagnosis.name}.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      buildOption(
        String.fromCharCode(66 + index),
        candidate.criteria[0]?.items?.[0] ?? candidate.summary,
        false,
        `This threshold statement belongs to ${candidate.name}, not ${diagnosis.name}.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-threshold`,
    diagnosisId: diagnosis.id,
    mode: "criteria-threshold",
    stem: `Which statement best matches the DSM-style threshold language summarized for ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-threshold-options`),
    takeaway: `Board questions often hinge on the opening threshold statement, so it helps to know the first criterion almost by reflex.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildSymptomClusterQuestion(diagnosis) {
  const symptomItem =
    diagnosis.criteria
      .flatMap((criterion) =>
        criterion.items
          .filter((item) => /include|symptoms|talkative|obsessions|worry|delusions|compulsions|inattention|hyperactivity|decreased need for sleep/i.test(item))
          .map((item) => ({ item, title: criterion.title }))
      )[0] ??
    { item: diagnosis.criteria[0]?.items?.[diagnosis.criteria[0].items.length - 1] ?? diagnosis.summary, title: diagnosis.criteria[0]?.title ?? "Criterion A" };
  const distractors = pickOtherDiagnoses(diagnosis, 3, `${diagnosis.id}-symptom-cluster`);
  const options = [
    buildOption(
      "A",
      symptomItem.item,
      true,
      `This symptom cluster is listed under ${symptomItem.title} on the ${diagnosis.name} page.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) => {
      const candidateItem =
        candidate.criteria
          .flatMap((criterion) =>
            criterion.items
              .filter((item) => /include|symptoms|talkative|obsessions|worry|delusions|compulsions|inattention|hyperactivity|decreased need for sleep/i.test(item))
              .map((item) => item)
          )[0] ??
        candidate.criteria[0]?.items?.[0] ??
        candidate.summary;

      return buildOption(
        String.fromCharCode(66 + index),
        candidateItem,
        false,
        `This symptom description is tied more closely to ${candidate.name}.`,
        getDiagnosisSources(candidate)
      );
    }),
  ];

  return {
    id: `${diagnosis.id}-symptom-cluster`,
    diagnosisId: diagnosis.id,
    mode: "criteria-symptom-cluster",
    stem: `A PRITE-style item asks you to recognize the symptom cluster most characteristic of ${diagnosis.name}. Which option is the best match?`,
    options: seededShuffle(options, `${diagnosis.id}-symptom-cluster-options`),
    takeaway: `When several diagnoses seem possible, the symptom cluster itself often tells you which page you should open first.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildScaleQuestion(diagnosis) {
  const distractors = pickOtherDiagnoses(diagnosis, 3, `${diagnosis.id}-scale`);
  const correctScale = diagnosis.scales[0];
  const options = [
    buildOption(
      "A",
      correctScale.name,
      true,
      `${correctScale.name} is listed on the ${diagnosis.name} page as a validated scale and is described as ${correctScale.use.toLowerCase()}`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      buildOption(
        String.fromCharCode(66 + index),
        candidate.scales[0]?.name ?? candidate.name,
        false,
        `${candidate.scales[0]?.name ?? candidate.name} is associated more directly with ${candidate.name} in this question bank.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-scale`,
    diagnosisId: diagnosis.id,
    mode: "scale-selection",
    stem: `Which validated scale from the Simple Psych library is the best match for following ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-scale-options`),
    takeaway: `Residents are often tested on which scales go with which disorder, not just on the diagnosis itself.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildTreatmentQuestion(diagnosis) {
  const distractors = pickOtherDiagnoses(diagnosis, 3, `${diagnosis.id}-treatment`);
  const correctDrug = diagnosis.medications?.[0]?.drugs?.[0] ?? diagnosis.offLabelTreatments?.[0] ?? diagnosis.name;
  const options = [
    buildOption(
      "A",
      correctDrug,
      true,
      `${correctDrug} appears in the FDA-approved treatment section for ${diagnosis.name} on Simple Psych.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) => {
      const distractorDrug = candidate.medications?.[0]?.drugs?.[0] ?? candidate.offLabelTreatments?.[0] ?? candidate.name;
      return buildOption(
        String.fromCharCode(66 + index),
        distractorDrug,
        false,
        `${distractorDrug} is presented in this bank as more closely tied to ${candidate.name}.`,
        getDiagnosisSources(candidate)
      );
    }),
  ];

  return {
    id: `${diagnosis.id}-treatment`,
    diagnosisId: diagnosis.id,
    mode: "treatment-selection",
    stem: `Which medication is listed in the FDA-approved treatment section for ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-treatment-options`),
    takeaway: `For boards and PRITE review, separating FDA-labeled options from off-label patterns is a useful first pass.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildOffLabelQuestion(diagnosis) {
  const distractors = pickOtherDiagnoses(diagnosis, 3, `${diagnosis.id}-offlabel`);
  const correctDrug = diagnosis.offLabelTreatments?.[0] ?? diagnosis.medications?.[0]?.drugs?.[0] ?? diagnosis.name;
  const options = [
    buildOption(
      "A",
      correctDrug,
      true,
      `${correctDrug} is listed in the off-label treatment section for ${diagnosis.name}.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) => {
      const candidateDrug = candidate.offLabelTreatments?.[0] ?? candidate.medications?.[0]?.drugs?.[0] ?? candidate.name;
      return buildOption(
        String.fromCharCode(66 + index),
        candidateDrug,
        false,
        `${candidateDrug} is used here as a distractor because it is linked more closely to ${candidate.name}.`,
        getDiagnosisSources(candidate)
      );
    }),
  ];

  return {
    id: `${diagnosis.id}-offlabel`,
    diagnosisId: diagnosis.id,
    mode: "offlabel-selection",
    stem: `Which option is listed as a common off-label treatment pattern for ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-offlabel-options`),
    takeaway: `Off-label items are common distractors, so it helps to know which medications live outside the FDA-labeled section for a diagnosis.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildInterventionalQuestion(diagnosis) {
  const distractors = pickOtherDiagnoses(diagnosis, 3, `${diagnosis.id}-interventional`);
  const correctText = diagnosis.interventionalOptions?.[0] ?? diagnosis.summary;
  const options = [
    buildOption(
      "A",
      correctText,
      true,
      `This statement appears in the interventional psychiatry section for ${diagnosis.name}.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      buildOption(
        String.fromCharCode(66 + index),
        candidate.interventionalOptions?.[0] ?? candidate.summary,
        false,
        `This interventional framing is summarized more closely under ${candidate.name}.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-interventional`,
    diagnosisId: diagnosis.id,
    mode: "interventional-selection",
    stem: `Which interventional psychiatry statement best matches the current Simple Psych summary for ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-interventional-options`),
    takeaway: `Interventional options are easiest to remember when you connect them to the polarity, severity, or treatment-resistance pattern of the disorder.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildRuleOutQuestion(diagnosis) {
  const distractors = pickOtherDiagnoses(diagnosis, 3, `${diagnosis.id}-ruleout`);
  const correctRuleOut = findRuleOutItem(diagnosis);
  const options = [
    buildOption(
      "A",
      correctRuleOut.item,
      true,
      `This rule-out or exclusion point is listed under ${correctRuleOut.title} for ${diagnosis.name}.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) => {
      const candidateRuleOut = findRuleOutItem(candidate);
      return buildOption(
        String.fromCharCode(66 + index),
        candidateRuleOut.item,
        false,
        `This exclusion statement belongs more directly to ${candidate.name}.`,
        getDiagnosisSources(candidate)
      );
    }),
  ];

  return {
    id: `${diagnosis.id}-ruleout`,
    diagnosisId: diagnosis.id,
    mode: "ruleout-selection",
    stem: `Which exclusion or rule-out statement best fits the diagnostic summary for ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-ruleout-options`),
    takeaway: `A lot of psychiatry questions turn on what rules a diagnosis out, not just what points toward it.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildCategoryQuestion(diagnosis) {
  const distractors = seededShuffle(
    [...new Set(diagnoses.map((candidate) => candidate.category).filter((category) => category !== diagnosis.category))],
    `${diagnosis.id}-category`
  ).slice(0, 3);
  const options = [
    buildOption(
      "A",
      diagnosis.category,
      true,
      `${diagnosis.name} is filed under ${diagnosis.category} on the site.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((category, index) => {
      const matchingDiagnosis = diagnoses.find((candidate) => candidate.category === category);
      return buildOption(
        String.fromCharCode(66 + index),
        category,
        false,
        `${category} is a real DSM-style grouping, but it is not the category used for ${diagnosis.name} here.`,
        matchingDiagnosis ? getDiagnosisSources(matchingDiagnosis) : getDiagnosisSources(diagnosis)
      );
    }),
  ];

  return {
    id: `${diagnosis.id}-category`,
    diagnosisId: diagnosis.id,
    mode: "category-selection",
    stem: `Which DSM-style category on Simple Psych contains ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-category-options`),
    takeaway: `Board questions often get easier when you organize diagnoses by their broader category before narrowing to details.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildHighestYieldQuestion(diagnosis) {
  const distractors = pickOtherDiagnoses(diagnosis, 3, `${diagnosis.id}-highyield`);
  const correctText = diagnosis.highlights?.[0]?.text ?? diagnosis.summary;
  const options = [
    buildOption(
      "A",
      correctText,
      true,
      `This is the high-yield clinical framing point emphasized on the ${diagnosis.name} page.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      buildOption(
        String.fromCharCode(66 + index),
        candidate.highlights?.[0]?.text ?? candidate.summary,
        false,
        `This framing point is more characteristic of ${candidate.name}.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-highyield`,
    diagnosisId: diagnosis.id,
    mode: "highyield-framing",
    stem: `Which high-yield framing statement best matches ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-highyield-options`),
    takeaway: `Good psychiatry test-taking often starts with the one sentence that most cleanly frames the disorder.`,
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function decorateQuestion(question, index) {
  const references = dedupeSources(question.options.flatMap((option) => option.sources));
  return {
    ...question,
    number: index + 1,
    references,
  };
}

const questionBuilders = [
  buildRecognitionQuestion,
  buildThresholdQuestion,
  buildSymptomClusterQuestion,
  buildScaleQuestion,
  buildTreatmentQuestion,
  buildOffLabelQuestion,
  buildInterventionalQuestion,
  buildRuleOutQuestion,
  buildCategoryQuestion,
];

const practiceQuestions = diagnoses
  .flatMap((diagnosis) => questionBuilders.map((builder, index) => builder(diagnosis, index)))
  .concat(diagnoses.slice(0, 7).map((diagnosis) => buildHighestYieldQuestion(diagnosis)))
  .slice(0, 200)
  .map(decorateQuestion);

export { practiceQuestions };
