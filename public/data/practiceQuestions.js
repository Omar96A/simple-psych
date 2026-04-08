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

function pickDistractors(currentDiagnosis, count, seed, matcher = () => true) {
  const pool = diagnoses.filter((diagnosis) => diagnosis.id !== currentDiagnosis.id && matcher(diagnosis));
  return seededShuffle(pool, seed).slice(0, count);
}

function getCriterionItems(diagnosis) {
  return diagnosis.criteria.flatMap((criterion) =>
    criterion.items.map((item) => ({
      criterion: criterion.title,
      item,
    }))
  );
}

function getRuleOutItem(diagnosis) {
  return (
    getCriterionItems(diagnosis).find(({ item }) =>
      /not attributable|not due|better explained|ruled out|never been|substance|medical condition|psychotic disorder/i.test(item)
    ) ?? {
      criterion: diagnosis.criteria.at(-1)?.title ?? "Criterion",
      item: diagnosis.criteria.at(-1)?.items?.[0] ?? diagnosis.summary,
    }
  );
}

function getSymptomCluster(diagnosis) {
  return (
    getCriterionItems(diagnosis).find(({ item }) =>
      /symptom|include|delusions|hallucinations|obsessions|compulsions|worry|hyperactivity|inattention|sleep|binge|panic|decreased need for sleep|goal-directed/i.test(
        item
      )
    ) ?? {
      criterion: diagnosis.criteria[0]?.title ?? "Criterion A",
      item: diagnosis.criteria[0]?.items?.[0] ?? diagnosis.summary,
    }
  );
}

function getDiagnosisSources(diagnosis) {
  return getReferenceArticles(diagnosis.id, diagnosis.name).slice(0, 3).map((article, index) => ({
    label: `${index + 1}. ${article.title}`,
    url: article.url,
  }));
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

function choosePatientProfile(diagnosis, seed) {
  const childLike =
    /autism|adhd|nightmare|sleep|narcolepsy|anorexia|bulimia|binge|panic/i.test(diagnosis.id) ||
    /Neurodevelopmental Disorders|Sleep-Wake Disorders/.test(diagnosis.category);
  const ages = childLike ? [8, 11, 14, 16, 17, 19] : [22, 27, 31, 36, 42, 54];
  const roles = childLike
    ? ["student", "middle-school student", "high-school student", "college student"]
    : ["teacher", "graduate student", "accountant", "nurse", "engineer", "office manager"];
  const pronouns = [
    { subject: "he", object: "him", possessive: "his" },
    { subject: "she", object: "her", possessive: "her" },
    { subject: "they", object: "them", possessive: "their" },
  ];
  const choice = seededShuffle(
    ages.flatMap((age) =>
      roles.flatMap((role) =>
        pronouns.map((pronoun) => ({
          age,
          role,
          pronoun,
        }))
      )
    ),
    seed
  )[0];
  return choice;
}

function buildVignette(diagnosis, seed) {
  const patient = choosePatientProfile(diagnosis, `${diagnosis.id}-${seed}`);
  const symptomCluster = getSymptomCluster(diagnosis).item;
  const clinicalFrame = diagnosis.highlights?.[0]?.text ?? diagnosis.summary;
  return `A ${patient.age}-year-old ${patient.role} presents for psychiatric evaluation. The clinical picture is summarized as follows: ${diagnosis.summary} ${clinicalFrame} Additional findings are most consistent with this statement: ${symptomCluster}`;
}

function option(id, text, isCorrect, explanation, sources) {
  return { id, text, isCorrect, explanation, sources };
}

function distractorDiagnoses(diagnosis, seed) {
  const sameCategory = pickDistractors(
    diagnosis,
    4,
    `${seed}-same-category`,
    (candidate) => candidate.category === diagnosis.category
  );

  if (sameCategory.length === 4) {
    return sameCategory;
  }

  return [
    ...sameCategory,
    ...pickDistractors(diagnosis, 4 - sameCategory.length, `${seed}-fallback`),
  ].slice(0, 4);
}

function buildRecognitionQuestion(diagnosis) {
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-recognition`);
  const options = [
    option(
      "A",
      diagnosis.name,
      true,
      `${diagnosis.name} is correct because the vignette mirrors the syndrome-level summary and high-yield framing points used in the source set for this diagnosis.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      option(
        String.fromCharCode(66 + index),
        candidate.name,
        false,
        `${candidate.name} is less likely because its defining syndrome in the cited literature emphasizes a different diagnostic anchor, time course, or symptom constellation.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-recognition`,
    diagnosisId: diagnosis.id,
    stem: `${buildVignette(diagnosis, "recognition")} Which diagnosis is the best match?`,
    options: seededShuffle(options, `${diagnosis.id}-recognition-options`),
    takeaway:
      "The most efficient first step on psychiatry board items is usually to identify the organizing syndrome before chasing individual details.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildDiagnosticThresholdQuestion(diagnosis) {
  const correct = diagnosis.criteria[0]?.items?.[0] ?? diagnosis.summary;
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-threshold`);
  const options = [
    option(
      "A",
      correct,
      true,
      `This option best reflects the threshold statement that opens the DSM-style summary for ${diagnosis.name}, which is usually the sentence that determines whether the syndrome is even on the table.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      option(
        String.fromCharCode(66 + index),
        candidate.criteria[0]?.items?.[0] ?? candidate.summary,
        false,
        `This threshold statement belongs more closely to ${candidate.name} and would redirect the differential toward that diagnosis instead.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-threshold`,
    diagnosisId: diagnosis.id,
    stem: `According to the diagnostic summary and supporting literature for ${diagnosis.name}, which statement best captures the threshold feature that makes the diagnosis possible?`,
    options: seededShuffle(options, `${diagnosis.id}-threshold-options`),
    takeaway:
      "Board-style questions frequently hinge on the opening threshold statement, so it is worth knowing the first criterion in clean language.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildDifferentialQuestion(diagnosis) {
  const ruleOut = getRuleOutItem(diagnosis);
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-differential`);
  const options = [
    option(
      "A",
      ruleOut.item,
      true,
      `This is the most defensible answer because the exclusion summarized under ${ruleOut.criterion} directly limits overdiagnosis of ${diagnosis.name} in a broad psychiatric differential.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) => {
      const candidateRuleOut = getRuleOutItem(candidate);
      return option(
        String.fromCharCode(66 + index),
        candidateRuleOut.item,
        false,
        `This exclusion statement is clinically valid, but it is aligned more strongly with ${candidate.name} than with ${diagnosis.name}.`,
        getDiagnosisSources(candidate)
      );
    }),
  ];

  return {
    id: `${diagnosis.id}-differential`,
    diagnosisId: diagnosis.id,
    stem: `A resident wants to avoid premature closure on ${diagnosis.name}. Which statement is the best exclusionary or differential-diagnosis principle to keep in mind?`,
    options: seededShuffle(options, `${diagnosis.id}-differential-options`),
    takeaway:
      "Differential diagnosis questions are often won by recognizing what would argue against the diagnosis, not just what initially points toward it.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildScaleQuestion(diagnosis) {
  const correctScale = diagnosis.scales[0];
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-scale`);
  const options = [
    option(
      "A",
      correctScale.name,
      true,
      `${correctScale.name} is correct because it is listed as a validated instrument for ${diagnosis.name} and is the strongest match for the severity-tracking use case described in the source summary.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      option(
        String.fromCharCode(66 + index),
        candidate.scales[0]?.name ?? candidate.name,
        false,
        `${candidate.scales[0]?.name ?? candidate.name} is associated more strongly with ${candidate.name}; using it here would reduce diagnostic specificity.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-scale`,
    diagnosisId: diagnosis.id,
    stem: `A clinician wants a validated rating scale to follow severity over time in a patient with ${diagnosis.name}. Which of the following is the best match?`,
    options: seededShuffle(options, `${diagnosis.id}-scale-options`),
    takeaway:
      "Knowing which scales go with which disorder is a high-yield board skill because it links diagnosis, monitoring, and treatment response.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildTreatmentQuestion(diagnosis) {
  const correct = diagnosis.medications?.[0]?.drugs?.[0] ?? diagnosis.offLabelTreatments?.[0] ?? diagnosis.name;
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-treatment`);
  const options = [
    option(
      "A",
      correct,
      true,
      `${correct} is the best answer because it appears in the FDA-approved treatment section for ${diagnosis.name} and aligns with the management literature linked for this diagnosis.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) => {
      const drug = candidate.medications?.[0]?.drugs?.[0] ?? candidate.offLabelTreatments?.[0] ?? candidate.name;
      return option(
        String.fromCharCode(66 + index),
        drug,
        false,
        `${drug} is a plausible psychiatry medication distractor, but in the cited source set it is linked more directly to ${candidate.name} than to ${diagnosis.name}.`,
        getDiagnosisSources(candidate)
      );
    }),
  ];

  return {
    id: `${diagnosis.id}-treatment`,
    diagnosisId: diagnosis.id,
    stem: `A board-style treatment question asks which medication is FDA-approved for the core syndrome summarized as ${diagnosis.name}. Which option is best supported by the cited management literature?`,
    options: seededShuffle(options, `${diagnosis.id}-treatment-options`),
    takeaway:
      "When several medications seem familiar, separate FDA-labeled options from merely common psychiatric medications.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildManagementQuestion(diagnosis) {
  const article = getReferenceArticles(diagnosis.id, diagnosis.name)[0];
  const correctText = diagnosis.highlights?.[1]?.text ?? diagnosis.highlights?.[0]?.text ?? diagnosis.summary;
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-management`);
  const options = [
    option(
      "A",
      correctText,
      true,
      `This answer is most consistent with the management emphasis reflected in the supporting literature for ${diagnosis.name}, especially ${article?.title ?? "the linked review literature"}.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      option(
        String.fromCharCode(66 + index),
        candidate.highlights?.[1]?.text ?? candidate.highlights?.[0]?.text ?? candidate.summary,
        false,
        `This management framing is more characteristic of ${candidate.name}; it does not best capture the clinical priority set described for ${diagnosis.name}.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-management`,
    diagnosisId: diagnosis.id,
    stem: `According to the core management literature linked for ${diagnosis.name}, which clinical principle is the most defensible first-pass framing point for decision-making?`,
    options: seededShuffle(options, `${diagnosis.id}-management-options`),
    takeaway:
      "The strongest management answer is usually the one that reframes the case around risk, polarity, syndrome structure, or diagnostic uncertainty.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildCourseQuestion(diagnosis) {
  const correct = diagnosis.highlights?.[0]?.text ?? diagnosis.summary;
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-course`);
  const options = [
    option(
      "A",
      correct,
      true,
      `This option best captures the longitudinal or syndrome-level pattern that should orient the clinician toward ${diagnosis.name}.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      option(
        String.fromCharCode(66 + index),
        candidate.highlights?.[0]?.text ?? candidate.summary,
        false,
        `This longitudinal pattern would be more typical for ${candidate.name}, not ${diagnosis.name}.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-course`,
    diagnosisId: diagnosis.id,
    stem: `Which description of course, pattern, or overall syndrome organization is most consistent with ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-course-options`),
    takeaway:
      "Course-based language is common in board questions because it separates disorders that share symptoms but not trajectory.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildInterventionalQuestion(diagnosis) {
  const correct = diagnosis.interventionalOptions?.[0] ?? diagnosis.summary;
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-interventional`);
  const options = [
    option(
      "A",
      correct,
      true,
      `This is the best answer because it reflects how interventional psychiatry is currently summarized for ${diagnosis.name} in relation to severity, refractoriness, or specific clinical states.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      option(
        String.fromCharCode(66 + index),
        candidate.interventionalOptions?.[0] ?? candidate.summary,
        false,
        `This interventional statement is more consistent with ${candidate.name} than with ${diagnosis.name}.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-interventional`,
    diagnosisId: diagnosis.id,
    stem: `A treatment-resistant case prompts review of interventional options. Which statement best matches the current evidence-oriented summary for ${diagnosis.name}?`,
    options: seededShuffle(options, `${diagnosis.id}-interventional-options`),
    takeaway:
      "Interventional questions are usually testing whether you know when severity or refractoriness changes the usual treatment ladder.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildVignetteManagementQuestion(diagnosis) {
  const patient = choosePatientProfile(diagnosis, `${diagnosis.id}-vignette-management`);
  const article = getReferenceArticles(diagnosis.id, diagnosis.name)[0];
  const correct = diagnosis.medications?.[0]?.note ?? diagnosis.highlights?.[1]?.text ?? diagnosis.summary;
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-vignette-management`);
  const options = [
    option(
      "A",
      correct,
      true,
      `This is the strongest answer because it matches the management note emphasized for ${diagnosis.name} and is the most consistent with ${article?.title ?? "the linked review literature"}.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) =>
      option(
        String.fromCharCode(66 + index),
        candidate.medications?.[0]?.note ?? candidate.highlights?.[1]?.text ?? candidate.summary,
        false,
        `This would be more defensible if the vignette were pointing toward ${candidate.name}; it does not best fit the syndrome described here.`,
        getDiagnosisSources(candidate)
      )
    ),
  ];

  return {
    id: `${diagnosis.id}-vignette-management`,
    diagnosisId: diagnosis.id,
    stem: `A ${patient.age}-year-old ${patient.role} is being discussed on rounds after the team identifies ${diagnosis.name} as the working diagnosis. According to the linked review literature, which management statement is most appropriate at a broad board-review level?`,
    options: seededShuffle(options, `${diagnosis.id}-vignette-management-options`),
    takeaway:
      "Many board-review management items are really asking whether you know the treatment lane before you know the exact medication choice.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function buildScientificComparisonQuestion(diagnosis) {
  const correct = getSymptomCluster(diagnosis);
  const distractors = distractorDiagnoses(diagnosis, `${diagnosis.id}-scientific-comparison`);
  const options = [
    option(
      "A",
      correct.item,
      true,
      `This answer is correct because it names the symptom cluster or phenomenon most strongly emphasized under ${correct.criterion} for ${diagnosis.name}.`,
      getDiagnosisSources(diagnosis)
    ),
    ...distractors.map((candidate, index) => {
      const candidateCluster = getSymptomCluster(candidate);
      return option(
        String.fromCharCode(66 + index),
        candidateCluster.item,
        false,
        `This clinical description is scientifically coherent, but it maps more closely onto ${candidate.name} than onto ${diagnosis.name}.`,
        getDiagnosisSources(candidate)
      );
    }),
  ];

  return {
    id: `${diagnosis.id}-scientific-comparison`,
    diagnosisId: diagnosis.id,
    stem: `Which finding would most specifically support ${diagnosis.name} over other plausible psychiatric diagnoses in a board-style differential?`,
    options: seededShuffle(options, `${diagnosis.id}-scientific-comparison-options`),
    takeaway:
      "High-quality differential questions reward the answer that is most specific, not merely compatible.",
    studyGuidePath: diagnosisPath(diagnosis.id),
  };
}

function decorateQuestion(question, index) {
  return {
    ...question,
    number: index + 1,
    references: dedupeSources(question.options.flatMap((item) => item.sources)),
  };
}

const builders = [
  buildRecognitionQuestion,
  buildDiagnosticThresholdQuestion,
  buildDifferentialQuestion,
  buildScaleQuestion,
  buildTreatmentQuestion,
  buildManagementQuestion,
  buildCourseQuestion,
  buildInterventionalQuestion,
  buildVignetteManagementQuestion,
];

const practiceQuestions = diagnoses
  .flatMap((diagnosis) => builders.map((builder) => builder(diagnosis)))
  .concat(diagnoses.slice(0, 7).map((diagnosis) => buildScientificComparisonQuestion(diagnosis)))
  .slice(0, 200)
  .map(decorateQuestion);

export { practiceQuestions };
