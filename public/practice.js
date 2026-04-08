import { practiceQuestions } from "./data/practiceQuestions.js";

const app = document.querySelector("#practice-app");

const TEST_SIZES = [10, 20, 30, 40, 50];
const QUESTION_TIME_LIMIT = 90;

const state = {
  screen: "setup",
  study: {
    questionNumber: randomQuestionNumber(),
    selectedOptionId: null,
    reveal: false,
  },
  testConfig: {
    size: 10,
    timed: false,
  },
  test: null,
};

function randomQuestionNumber() {
  return Math.floor(Math.random() * practiceQuestions.length) + 1;
}

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

function getQuestionByNumber(questionNumber) {
  return practiceQuestions[questionNumber - 1];
}

function getCurrentStudyQuestion() {
  return getQuestionByNumber(state.study.questionNumber);
}

function getTestQuestion(index) {
  return state.test?.questions?.[index] ?? null;
}

function clearTimer() {
  if (state.test?.timerId) {
    window.clearInterval(state.test.timerId);
    state.test.timerId = null;
  }
}

function startTimer() {
  clearTimer();

  if (!state.test?.timed || state.screen !== "test") {
    return;
  }

  state.test.timeRemaining = QUESTION_TIME_LIMIT;
  state.test.timerId = window.setInterval(() => {
    if (!state.test || state.screen !== "test") {
      clearTimer();
      return;
    }

    state.test.timeRemaining -= 1;

    if (state.test.timeRemaining <= 0) {
      goToNextTestQuestion(true);
      return;
    }

    render();
  }, 1000);
}

function formatSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function startTest() {
  const questions = shuffle(practiceQuestions).slice(0, state.testConfig.size);
  state.test = {
    questions,
    answers: {},
    currentIndex: 0,
    timed: state.testConfig.timed,
    timeRemaining: QUESTION_TIME_LIMIT,
    timerId: null,
  };
  state.screen = "test";
  startTimer();
  render();
}

function finishTest() {
  clearTimer();
  state.screen = "results";
  render();
}

function goToPreviousTestQuestion() {
  if (!state.test || state.test.currentIndex === 0) {
    return;
  }

  state.test.currentIndex -= 1;
  startTimer();
  render();
}

function goToNextTestQuestion(fromTimer = false) {
  if (!state.test) {
    return;
  }

  if (state.test.currentIndex >= state.test.questions.length - 1) {
    finishTest();
    return;
  }

  state.test.currentIndex += 1;
  if (state.test.timed && fromTimer) {
    const currentQuestion = getTestQuestion(state.test.currentIndex - 1);
    if (currentQuestion && !state.test.answers[currentQuestion.id]) {
      state.test.answers[currentQuestion.id] = null;
    }
  }
  startTimer();
  render();
}

function getScore() {
  if (!state.test) {
    return { correct: 0, total: 0, percent: 0 };
  }

  const correct = state.test.questions.filter((question) => {
    const selectedOptionId = state.test.answers[question.id];
    return question.options.find((option) => option.id === selectedOptionId)?.isCorrect;
  }).length;

  return {
    correct,
    total: state.test.questions.length,
    percent: Math.round((correct / state.test.questions.length) * 100),
  };
}

function renderQuestionOptions(question, { selectedOptionId, revealAnswers, name }) {
  return `
    <div class="practice-options">
      ${question.options
        .map((option) => {
          const selected = option.id === selectedOptionId;
          const correctnessClass = revealAnswers
            ? option.isCorrect
              ? "practice-option--correct"
              : selected
                ? "practice-option--incorrect"
                : ""
            : selected
              ? "practice-option--selected"
              : "";

          return `
            <label class="practice-option ${correctnessClass}">
              <input type="radio" name="${name}" value="${escapeHtml(option.id)}" ${selected ? "checked" : ""} />
              <span class="practice-option__letter">${escapeHtml(option.id)}</span>
              <span>${escapeHtml(option.text)}</span>
            </label>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderExplanationBlock(question, selectedOptionId) {
  return `
    <section class="practice-explanations">
      <h3>Answer explanations</h3>
      <div class="card-stack">
        ${question.options
          .map((option) => {
            const isSelected = selectedOptionId === option.id;
            const status = option.isCorrect ? "Correct answer" : isSelected ? "Your answer" : "Why not this option";
            return `
              <article class="mini-card">
                <h4>${escapeHtml(option.id)}. ${escapeHtml(option.text)}</h4>
                <p class="practice-status">${escapeHtml(status)}</p>
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
    </section>
    <section class="profile-section">
      <h3>References</h3>
      <ul class="reference-list">
        ${question.references
          .map(
            (source) => `
              <li><a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a></li>
            `
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderStudyScreen() {
  const question = getCurrentStudyQuestion();
  return `
    <section class="practice-panel">
      <div class="practice-toolbar">
        <button class="tag practice-action" data-action="back-to-setup" type="button">Back</button>
        <div class="practice-toolbar__group">
          <button class="tag practice-action" data-action="random-study-question" type="button">Random question</button>
          <label class="practice-jump">
            <span>Go to question #</span>
            <input id="study-question-number" type="number" min="1" max="${practiceQuestions.length}" value="${question.number}" />
          </label>
          <button class="tag practice-action" data-action="go-to-study-question" type="button">Go</button>
        </div>
      </div>
      <section class="profile-section">
        <h2>Study mode</h2>
        <p class="search-meta">Question ${question.number} of ${practiceQuestions.length}</p>
        <p class="practice-stem">${escapeHtml(question.stem)}</p>
        ${renderQuestionOptions(question, {
          selectedOptionId: state.study.selectedOptionId,
          revealAnswers: state.study.reveal,
          name: "study-answer",
        })}
        <div class="practice-toolbar">
          <button class="tag practice-action" data-action="reveal-study-answer" type="button">Show answer</button>
          <a class="tag" href="${question.studyGuidePath}" target="_blank" rel="noreferrer">Open study guide</a>
        </div>
      </section>
      ${
        state.study.reveal
          ? `
            <section class="profile-section">
              <h3>Key takeaway</h3>
              <p>${escapeHtml(question.takeaway)}</p>
            </section>
            ${renderExplanationBlock(question, state.study.selectedOptionId)}
          `
          : ""
      }
    </section>
  `;
}

function renderSetupScreen() {
  return `
    <section class="practice-panel">
      <section class="profile-section">
        <h2>Choose a practice mode</h2>
        <div class="card-stack practice-mode-grid">
          <article class="mini-card">
            <h3>Study mode</h3>
            <p>Review one random question at a time, reveal explanations immediately, and jump out to the diagnosis study guide in a separate tab.</p>
            <button class="tag practice-action" data-action="enter-study" type="button">Start studying</button>
          </article>
          <article class="mini-card">
            <h3>Test mode</h3>
            <p>Build a 10 to 50 question exam, choose timed or untimed mode, then review every item after your score is shown.</p>
            <button class="tag practice-action" data-action="show-test-setup" type="button">Build a test</button>
          </article>
        </div>
      </section>
      ${
        state.screen === "test-setup"
          ? `
            <section class="profile-section">
              <h3>Build your test</h3>
              <div class="practice-config-row">
                <label>
                  <span>Question count</span>
                  <select id="test-size">
                    ${TEST_SIZES.map(
                      (size) => `<option value="${size}" ${state.testConfig.size === size ? "selected" : ""}>${size} questions</option>`
                    ).join("")}
                  </select>
                </label>
                <label class="practice-toggle">
                  <input id="timed-mode" type="checkbox" ${state.testConfig.timed ? "checked" : ""} />
                  <span>Timed mode, 1 minute 30 seconds per question</span>
                </label>
              </div>
              <div class="practice-toolbar">
                <button class="tag practice-action" data-action="start-test" type="button">Start test</button>
              </div>
            </section>
          `
          : ""
      }
    </section>
  `;
}

function renderTestScreen() {
  const question = getTestQuestion(state.test.currentIndex);
  const selectedOptionId = state.test.answers[question.id] ?? null;
  return `
    <section class="practice-panel">
      <section class="profile-section">
        <div class="practice-toolbar">
          <button class="tag practice-action" data-action="finish-test" type="button">Finish test</button>
          <div class="practice-toolbar__group">
            <span class="search-meta">Question ${state.test.currentIndex + 1} of ${state.test.questions.length}</span>
            ${
              state.test.timed
                ? `<span class="practice-timer">${formatSeconds(state.test.timeRemaining)} remaining</span>`
                : ""
            }
          </div>
        </div>
        <p class="practice-stem">${escapeHtml(question.stem)}</p>
        ${renderQuestionOptions(question, {
          selectedOptionId,
          revealAnswers: false,
          name: "test-answer",
        })}
        <div class="practice-toolbar">
          <button class="tag practice-action" data-action="prev-test-question" type="button" ${state.test.currentIndex === 0 ? "disabled" : ""}>Previous</button>
          <div class="practice-toolbar__group">
            <a class="tag" href="${question.studyGuidePath}" target="_blank" rel="noreferrer">Open study guide</a>
            <button class="tag practice-action" data-action="next-test-question" type="button">${state.test.currentIndex === state.test.questions.length - 1 ? "Finish" : "Next"}</button>
          </div>
        </div>
      </section>
    </section>
  `;
}

function renderResultsScreen() {
  const score = getScore();
  return `
    <section class="practice-panel">
      <section class="profile-section">
        <h2>Test complete</h2>
        <div class="card-stack practice-score-grid">
          <article class="mini-card">
            <h3>${score.correct} / ${score.total}</h3>
            <p>Raw score</p>
          </article>
          <article class="mini-card">
            <h3>${score.percent}%</h3>
            <p>Percent correct</p>
          </article>
        </div>
        <div class="practice-toolbar">
          <button class="tag practice-action" data-action="review-test" type="button">Review test</button>
          <button class="tag practice-action" data-action="restart-practice" type="button">Start over</button>
        </div>
      </section>
    </section>
  `;
}

function renderReviewScreen() {
  const question = getTestQuestion(state.test.currentIndex);
  const selectedOptionId = state.test.answers[question.id] ?? null;
  const correctOption = question.options.find((option) => option.isCorrect);
  const selectedOption = question.options.find((option) => option.id === selectedOptionId);

  return `
    <section class="practice-panel">
      <section class="profile-section">
        <div class="practice-toolbar">
          <button class="tag practice-action" data-action="back-to-results" type="button">Back to score</button>
          <span class="search-meta">Review ${state.test.currentIndex + 1} of ${state.test.questions.length}</span>
        </div>
        <p class="practice-stem">${escapeHtml(question.stem)}</p>
        ${renderQuestionOptions(question, {
          selectedOptionId,
          revealAnswers: true,
          name: `review-answer-${question.id}`,
        })}
        <div class="practice-review-summary">
          <p><strong>Your answer:</strong> ${escapeHtml(selectedOption ? `${selectedOption.id}. ${selectedOption.text}` : "No answer recorded")}</p>
          <p><strong>Correct answer:</strong> ${escapeHtml(`${correctOption.id}. ${correctOption.text}`)}</p>
          <p>${escapeHtml(question.takeaway)}</p>
        </div>
        <div class="practice-toolbar">
          <button class="tag practice-action" data-action="prev-review-question" type="button" ${state.test.currentIndex === 0 ? "disabled" : ""}>Previous</button>
          <div class="practice-toolbar__group">
            <a class="tag" href="${question.studyGuidePath}" target="_blank" rel="noreferrer">Open study guide</a>
            <button class="tag practice-action" data-action="next-review-question" type="button" ${state.test.currentIndex === state.test.questions.length - 1 ? "disabled" : ""}>Next</button>
          </div>
        </div>
      </section>
      ${renderExplanationBlock(question, selectedOptionId)}
    </section>
  `;
}

function render() {
  if (!app) {
    return;
  }

  if (state.screen === "study") {
    app.innerHTML = renderStudyScreen();
    return;
  }

  if (state.screen === "test") {
    app.innerHTML = renderTestScreen();
    return;
  }

  if (state.screen === "results") {
    app.innerHTML = renderResultsScreen();
    return;
  }

  if (state.screen === "review") {
    app.innerHTML = renderReviewScreen();
    return;
  }

  app.innerHTML = renderSetupScreen();
}

app?.addEventListener("change", (event) => {
  if (event.target.matches("input[name='study-answer']")) {
    state.study.selectedOptionId = event.target.value;
    render();
    return;
  }

  if (event.target.matches("input[name='test-answer']") && state.test) {
    const question = getTestQuestion(state.test.currentIndex);
    state.test.answers[question.id] = event.target.value;
    render();
    return;
  }

  if (event.target.id === "test-size") {
    state.testConfig.size = Number(event.target.value);
    return;
  }

  if (event.target.id === "timed-mode") {
    state.testConfig.timed = event.target.checked;
  }
});

app?.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) {
    return;
  }

  const action = actionTarget.dataset.action;

  if (action === "enter-study") {
    state.screen = "study";
    state.study = {
      questionNumber: randomQuestionNumber(),
      selectedOptionId: null,
      reveal: false,
    };
    render();
    return;
  }

  if (action === "show-test-setup") {
    state.screen = "test-setup";
    render();
    return;
  }

  if (action === "back-to-setup") {
    state.screen = "setup";
    clearTimer();
    render();
    return;
  }

  if (action === "random-study-question") {
    state.study.questionNumber = randomQuestionNumber();
    state.study.selectedOptionId = null;
    state.study.reveal = false;
    render();
    return;
  }

  if (action === "go-to-study-question") {
    const input = document.querySelector("#study-question-number");
    const requested = Number(input?.value);
    if (requested >= 1 && requested <= practiceQuestions.length) {
      state.study.questionNumber = requested;
      state.study.selectedOptionId = null;
      state.study.reveal = false;
      render();
    }
    return;
  }

  if (action === "reveal-study-answer") {
    state.study.reveal = true;
    render();
    return;
  }

  if (action === "start-test") {
    startTest();
    return;
  }

  if (action === "prev-test-question") {
    goToPreviousTestQuestion();
    return;
  }

  if (action === "next-test-question") {
    goToNextTestQuestion();
    return;
  }

  if (action === "finish-test") {
    finishTest();
    return;
  }

  if (action === "review-test") {
    state.screen = "review";
    state.test.currentIndex = 0;
    render();
    return;
  }

  if (action === "restart-practice") {
    clearTimer();
    state.screen = "setup";
    state.test = null;
    render();
    return;
  }

  if (action === "back-to-results") {
    state.screen = "results";
    render();
    return;
  }

  if (action === "prev-review-question" && state.test.currentIndex > 0) {
    state.test.currentIndex -= 1;
    render();
    return;
  }

  if (action === "next-review-question" && state.test.currentIndex < state.test.questions.length - 1) {
    state.test.currentIndex += 1;
    render();
  }
});

window.addEventListener("beforeunload", () => {
  clearTimer();
});

render();
