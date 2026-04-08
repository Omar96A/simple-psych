import { practiceQuestions } from "./data/practiceQuestions.js";

const app = document.querySelector("#practice-app");

const QUESTION_SET_SIZES = [10, 20, 30, 40, 50];
const QUESTION_TIME_SECONDS = 90;

const state = {
  screen: "setup",
  session: null,
  explorer: {
    questionNumber: 1,
    selectedOptionId: null,
    submitted: false,
  },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function randomQuestionNumber() {
  return Math.floor(Math.random() * practiceQuestions.length) + 1;
}

function getQuestionByNumber(number) {
  return practiceQuestions[number - 1];
}

function currentQuestion() {
  if (!state.session) {
    return null;
  }

  return state.session.questions[state.session.currentIndex] ?? null;
}

function getAnswerRecord(questionId) {
  return state.session?.answers?.[questionId] ?? { selectedOptionId: null, submitted: false };
}

function setAnswerRecord(questionId, patch) {
  const current = getAnswerRecord(questionId);
  state.session.answers[questionId] = { ...current, ...patch };
}

function clearTimer() {
  if (state.session?.timerId) {
    window.clearInterval(state.session.timerId);
    state.session.timerId = null;
  }
}

function startTotalTimer() {
  clearTimer();

  if (!state.session?.timed || state.screen !== "test") {
    return;
  }

  state.session.timerId = window.setInterval(() => {
    if (!state.session || state.screen !== "test") {
      clearTimer();
      return;
    }

    state.session.remainingSeconds -= 1;

    if (state.session.remainingSeconds <= 0) {
      state.session.remainingSeconds = 0;
      finishTest();
      return;
    }

    render();
  }, 1000);
}

function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function buildSession({ mode, size, timed = false }) {
  const questions = shuffle(practiceQuestions).slice(0, size);
  return {
    mode,
    questions,
    answers: {},
    currentIndex: 0,
    timed,
    remainingSeconds: size * QUESTION_TIME_SECONDS,
    timerId: null,
  };
}

function openExplorer(questionNumber = randomQuestionNumber()) {
  state.screen = "explorer";
  state.explorer = {
    questionNumber,
    selectedOptionId: null,
    submitted: false,
  };
  render();
}

function openStudySet(size) {
  clearTimer();
  state.session = buildSession({ mode: "study", size, timed: false });
  state.screen = "study";
  render();
}

function openTest(size, timed) {
  clearTimer();
  state.session = buildSession({ mode: "test", size, timed });
  state.screen = "test";
  startTotalTimer();
  render();
}

function finishTest() {
  clearTimer();
  state.screen = "results";
  render();
}

function getScore() {
  if (!state.session) {
    return { correct: 0, total: 0, percent: 0 };
  }

  const correct = state.session.questions.filter((question) => {
    const answer = state.session.answers[question.id];
    return question.options.find((option) => option.id === answer?.selectedOptionId)?.isCorrect;
  }).length;

  return {
    correct,
    total: state.session.questions.length,
    percent: Math.round((correct / state.session.questions.length) * 100),
  };
}

function moveQuestion(delta) {
  if (!state.session) {
    return;
  }

  const nextIndex = state.session.currentIndex + delta;
  if (nextIndex < 0 || nextIndex >= state.session.questions.length) {
    return;
  }

  state.session.currentIndex = nextIndex;
  render();
}

function renderOptions(question, { selectedOptionId, revealAnswers, groupName }) {
  return `
    <div class="practice-options">
      ${question.options
        .map((option) => {
          const selected = option.id === selectedOptionId;
          const classes = ["practice-option"];

          if (!revealAnswers && selected) {
            classes.push("practice-option--selected");
          }

          if (revealAnswers && option.isCorrect) {
            classes.push("practice-option--correct");
          }

          if (revealAnswers && selected && !option.isCorrect) {
            classes.push("practice-option--incorrect");
          }

          return `
            <label class="${classes.join(" ")}">
              <input type="radio" name="${groupName}" value="${escapeHtml(option.id)}" ${selected ? "checked" : ""} />
              <span class="practice-option__letter">${escapeHtml(option.id)}</span>
              <span>${escapeHtml(option.text)}</span>
            </label>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderExplanation(question, selectedOptionId) {
  return `
    <section class="profile-section practice-detail">
      <h3>Answer explanations</h3>
      <div class="card-stack">
        ${question.options
          .map((option) => {
            let label = option.isCorrect ? "Correct answer" : "Incorrect answer";
            if (selectedOptionId === option.id && !option.isCorrect) {
              label = "Your selected answer";
            }

            return `
              <article class="mini-card">
                <h4>${escapeHtml(option.id)}. ${escapeHtml(option.text)}</h4>
                <p class="practice-status">${escapeHtml(label)}</p>
                <p>${escapeHtml(option.explanation)}</p>
                <ul class="reference-list">
                  ${option.sources
                    .map(
                      (source) => `
                        <li><a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a></li>
                      `
                    )
                    .join("")}
                </ul>
              </article>
            `;
          })
          .join("")}
      </div>
      <div class="practice-reference-block">
        <h4>Study guide</h4>
        <p><a class="support-pillar-link" href="${question.studyGuidePath}" target="_blank" rel="noreferrer">Open the related diagnosis page in a new tab</a></p>
      </div>
    </section>
  `;
}

function renderSetupCard(title, description, buttonLabel, action, extraMarkup = "") {
  return `
    <article class="mini-card practice-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
      ${extraMarkup}
      <button class="practice-pill practice-action" data-action="${action}" type="button">${escapeHtml(buttonLabel)}</button>
    </article>
  `;
}

function renderSetup() {
  return `
    <section class="practice-panel">
      <section class="profile-section">
        <h2>Choose how you want to practice</h2>
        <div class="card-stack practice-mode-grid">
          ${renderSetupCard(
            "Question explorer",
            "Jump to any random question or go directly by question number, then review the explanation immediately after you submit an answer.",
            "Open explorer",
            "open-explorer",
            `
              <div class="practice-inline-controls">
                <button class="practice-pill practice-action" data-action="random-explorer" type="button">Random question</button>
                <label class="practice-jump">
                  <span>Question #</span>
                  <input id="explorer-number" type="number" min="1" max="${practiceQuestions.length}" value="${state.explorer.questionNumber}" />
                </label>
              </div>
            `
          )}
          ${renderSetupCard(
            "Study set",
            "Build a 10 to 50 question practice set. Each answer is graded immediately, with option-by-option explanations and source links after you submit.",
            "Start study set",
            "start-study-set",
            `
              <label class="practice-jump">
                <span>Study set size</span>
                <select id="study-size">
                  ${QUESTION_SET_SIZES.map((size) => `<option value="${size}">${size} questions</option>`).join("")}
                </select>
              </label>
            `
          )}
          ${renderSetupCard(
            "Test mode",
            "Build a 10 to 50 question exam. Answers stay hidden until the end, and timed mode gives you 90 seconds per question as one total test clock.",
            "Start test",
            "start-test",
            `
              <div class="practice-test-config">
                <label class="practice-jump">
                  <span>Test size</span>
                  <select id="test-size">
                    ${QUESTION_SET_SIZES.map((size) => `<option value="${size}">${size} questions</option>`).join("")}
                  </select>
                </label>
                <label class="practice-toggle">
                  <input id="test-timed" type="checkbox" />
                  <span>Timed mode</span>
                </label>
              </div>
            `
          )}
        </div>
      </section>
    </section>
  `;
}

function renderExplorer() {
  const question = getQuestionByNumber(state.explorer.questionNumber);
  return `
    <section class="practice-panel">
      <section class="profile-section">
        <div class="practice-toolbar">
          <button class="practice-pill practice-action" data-action="back-to-setup" type="button">Back</button>
          <div class="practice-toolbar__group">
            <button class="practice-pill practice-action" data-action="random-explorer" type="button">Random question</button>
            <label class="practice-jump">
              <span>Question #</span>
              <input id="explorer-active-number" type="number" min="1" max="${practiceQuestions.length}" value="${question.number}" />
            </label>
            <button class="practice-pill practice-action" data-action="go-explorer-number" type="button">Go</button>
          </div>
        </div>
        <p class="search-meta">Question ${question.number} of ${practiceQuestions.length}</p>
        <p class="practice-stem">${escapeHtml(question.stem)}</p>
        ${renderOptions(question, {
          selectedOptionId: state.explorer.selectedOptionId,
          revealAnswers: state.explorer.submitted,
          groupName: "explorer-answer",
        })}
        <div class="practice-toolbar">
          ${
            state.explorer.submitted
              ? `<button class="practice-pill practice-action" data-action="random-explorer" type="button">Next random question</button>`
              : `<button class="practice-pill practice-action" data-action="submit-explorer-answer" type="button" ${state.explorer.selectedOptionId ? "" : "disabled"}>Submit answer</button>`
          }
          <a class="practice-pill" href="${question.studyGuidePath}" target="_blank" rel="noreferrer">Open study guide</a>
        </div>
      </section>
      ${state.explorer.submitted ? renderExplanation(question, state.explorer.selectedOptionId) : ""}
    </section>
  `;
}

function renderStudySet() {
  const question = currentQuestion();
  const answer = getAnswerRecord(question.id);

  return `
    <section class="practice-panel">
      <section class="profile-section">
        <div class="practice-toolbar">
          <button class="practice-pill practice-action" data-action="back-to-setup" type="button">Back</button>
          <span class="search-meta">Study question ${state.session.currentIndex + 1} of ${state.session.questions.length}</span>
        </div>
        <p class="practice-stem">${escapeHtml(question.stem)}</p>
        ${renderOptions(question, {
          selectedOptionId: answer.selectedOptionId,
          revealAnswers: answer.submitted,
          groupName: `study-answer-${question.id}`,
        })}
        <div class="practice-toolbar">
          <button class="practice-pill practice-action" data-action="prev-study-question" type="button" ${state.session.currentIndex === 0 ? "disabled" : ""}>Previous</button>
          <div class="practice-toolbar__group">
            <a class="practice-pill" href="${question.studyGuidePath}" target="_blank" rel="noreferrer">Open study guide</a>
            ${
              answer.submitted
                ? `<button class="practice-pill practice-action" data-action="next-study-question" type="button">${state.session.currentIndex === state.session.questions.length - 1 ? "Finish set" : "Next question"}</button>`
                : `<button class="practice-pill practice-action" data-action="submit-study-answer" type="button" ${answer.selectedOptionId ? "" : "disabled"}>Submit answer</button>`
            }
          </div>
        </div>
      </section>
      ${answer.submitted ? renderExplanation(question, answer.selectedOptionId) : ""}
    </section>
  `;
}

function renderTest() {
  const question = currentQuestion();
  const answer = getAnswerRecord(question.id);

  return `
    <section class="practice-panel">
      <section class="profile-section">
        <div class="practice-toolbar">
          <button class="practice-pill practice-action" data-action="finish-test" type="button">Finish test</button>
          <div class="practice-toolbar__group">
            <span class="search-meta">Question ${state.session.currentIndex + 1} of ${state.session.questions.length}</span>
            ${
              state.session.timed
                ? `<span class="practice-timer">${formatDuration(state.session.remainingSeconds)} remaining</span>`
                : ""
            }
          </div>
        </div>
        <p class="practice-stem">${escapeHtml(question.stem)}</p>
        ${renderOptions(question, {
          selectedOptionId: answer.selectedOptionId,
          revealAnswers: false,
          groupName: `test-answer-${question.id}`,
        })}
        <div class="practice-toolbar">
          <button class="practice-pill practice-action" data-action="prev-test-question" type="button" ${state.session.currentIndex === 0 ? "disabled" : ""}>Previous</button>
          <div class="practice-toolbar__group">
            <a class="practice-pill" href="${question.studyGuidePath}" target="_blank" rel="noreferrer">Open study guide</a>
            <button class="practice-pill practice-action" data-action="next-test-question" type="button">${state.session.currentIndex === state.session.questions.length - 1 ? "Finish test" : "Next question"}</button>
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderResults() {
  const score = getScore();
  return `
    <section class="practice-panel">
      <section class="profile-section">
        <h2>Test complete</h2>
        <div class="card-stack practice-score-grid">
          <article class="mini-card">
            <h3>${score.correct} / ${score.total}</h3>
            <p>Correct answers</p>
          </article>
          <article class="mini-card">
            <h3>${score.percent}%</h3>
            <p>Percent correct</p>
          </article>
          ${
            state.session.timed
              ? `
                <article class="mini-card">
                  <h3>${formatDuration(state.session.remainingSeconds)}</h3>
                  <p>Time remaining</p>
                </article>
              `
              : ""
          }
        </div>
        <div class="practice-toolbar">
          <button class="practice-pill practice-action" data-action="review-test" type="button">Review test</button>
          <button class="practice-pill practice-action" data-action="restart-practice" type="button">Start over</button>
        </div>
      </section>
    </section>
  `;
}

function renderReview() {
  const question = currentQuestion();
  const answer = getAnswerRecord(question.id);
  const correct = question.options.find((option) => option.isCorrect);
  const selected = question.options.find((option) => option.id === answer.selectedOptionId);

  return `
    <section class="practice-panel">
      <section class="profile-section">
        <div class="practice-toolbar">
          <button class="practice-pill practice-action" data-action="back-to-results" type="button">Back to score</button>
          <span class="search-meta">Review ${state.session.currentIndex + 1} of ${state.session.questions.length}</span>
        </div>
        <p class="practice-stem">${escapeHtml(question.stem)}</p>
        ${renderOptions(question, {
          selectedOptionId: answer.selectedOptionId,
          revealAnswers: true,
          groupName: `review-answer-${question.id}`,
        })}
        <div class="practice-review-summary">
          <p><strong>Your answer:</strong> ${escapeHtml(selected ? `${selected.id}. ${selected.text}` : "No answer recorded")}</p>
          <p><strong>Correct answer:</strong> ${escapeHtml(`${correct.id}. ${correct.text}`)}</p>
          <p>${escapeHtml(question.takeaway)}</p>
        </div>
        <div class="practice-toolbar">
          <button class="practice-pill practice-action" data-action="prev-review-question" type="button" ${state.session.currentIndex === 0 ? "disabled" : ""}>Previous</button>
          <div class="practice-toolbar__group">
            <a class="practice-pill" href="${question.studyGuidePath}" target="_blank" rel="noreferrer">Open study guide</a>
            <button class="practice-pill practice-action" data-action="next-review-question" type="button" ${state.session.currentIndex === state.session.questions.length - 1 ? "disabled" : ""}>Next</button>
          </div>
        </div>
      </section>
      ${renderExplanation(question, answer.selectedOptionId)}
    </section>
  `;
}

function render() {
  if (!app) {
    return;
  }

  if (state.screen === "explorer") {
    app.innerHTML = renderExplorer();
    return;
  }

  if (state.screen === "study") {
    app.innerHTML = renderStudySet();
    return;
  }

  if (state.screen === "test") {
    app.innerHTML = renderTest();
    return;
  }

  if (state.screen === "results") {
    app.innerHTML = renderResults();
    return;
  }

  if (state.screen === "review") {
    app.innerHTML = renderReview();
    return;
  }

  app.innerHTML = renderSetup();
}

app?.addEventListener("change", (event) => {
  if (event.target.matches("input[name='explorer-answer']")) {
    state.explorer.selectedOptionId = event.target.value;
    render();
    return;
  }

  if (event.target.matches("input[name^='study-answer-']")) {
    const question = currentQuestion();
    setAnswerRecord(question.id, { selectedOptionId: event.target.value });
    render();
    return;
  }

  if (event.target.matches("input[name^='test-answer-']")) {
    const question = currentQuestion();
    setAnswerRecord(question.id, { selectedOptionId: event.target.value });
    render();
  }
});

app?.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) {
    return;
  }

  const action = trigger.dataset.action;

  if (action === "back-to-setup") {
    clearTimer();
    state.screen = "setup";
    state.session = null;
    render();
    return;
  }

  if (action === "open-explorer") {
    const input = document.querySelector("#explorer-number");
    const value = Number(input?.value) || randomQuestionNumber();
    openExplorer(Math.min(Math.max(value, 1), practiceQuestions.length));
    return;
  }

  if (action === "random-explorer") {
    openExplorer(randomQuestionNumber());
    return;
  }

  if (action === "go-explorer-number") {
    const input = document.querySelector("#explorer-active-number");
    const value = Number(input?.value);
    if (value >= 1 && value <= practiceQuestions.length) {
      openExplorer(value);
    }
    return;
  }

  if (action === "submit-explorer-answer" && state.explorer.selectedOptionId) {
    state.explorer.submitted = true;
    render();
    return;
  }

  if (action === "start-study-set") {
    const size = Number(document.querySelector("#study-size")?.value) || 10;
    openStudySet(size);
    return;
  }

  if (action === "submit-study-answer") {
    const question = currentQuestion();
    const answer = getAnswerRecord(question.id);
    if (answer.selectedOptionId) {
      setAnswerRecord(question.id, { submitted: true });
      render();
    }
    return;
  }

  if (action === "prev-study-question") {
    moveQuestion(-1);
    return;
  }

  if (action === "next-study-question") {
    if (state.session.currentIndex === state.session.questions.length - 1) {
      state.screen = "setup";
      state.session = null;
      render();
      return;
    }
    moveQuestion(1);
    return;
  }

  if (action === "start-test") {
    const size = Number(document.querySelector("#test-size")?.value) || 10;
    const timed = Boolean(document.querySelector("#test-timed")?.checked);
    openTest(size, timed);
    return;
  }

  if (action === "prev-test-question") {
    moveQuestion(-1);
    return;
  }

  if (action === "next-test-question") {
    if (state.session.currentIndex === state.session.questions.length - 1) {
      finishTest();
      return;
    }
    moveQuestion(1);
    return;
  }

  if (action === "finish-test") {
    finishTest();
    return;
  }

  if (action === "review-test") {
    state.screen = "review";
    state.session.currentIndex = 0;
    render();
    return;
  }

  if (action === "restart-practice") {
    clearTimer();
    state.screen = "setup";
    state.session = null;
    render();
    return;
  }

  if (action === "back-to-results") {
    state.screen = "results";
    render();
    return;
  }

  if (action === "prev-review-question") {
    moveQuestion(-1);
    return;
  }

  if (action === "next-review-question") {
    moveQuestion(1);
  }
});

window.addEventListener("beforeunload", () => {
  clearTimer();
});

render();
