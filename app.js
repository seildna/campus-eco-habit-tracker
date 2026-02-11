const calculateBtn = document.getElementById("calculate-btn");
const saveBtn = document.getElementById("save-btn");
const scoreValue = document.getElementById("score-value");
const feedback = document.getElementById("feedback");
const habitInputs = Array.from(document.querySelectorAll('input[name="habit"]'));

const STORAGE_KEY = "campusEcoTrackerHistory";

function getSelectedScore() {
  return habitInputs
    .filter((input) => input.checked)
    .reduce((sum, input) => sum + Number(input.value), 0);
}

function getFeedbackMessage(score) {
  if (score >= 80) {
    return "Excellent work. Your habits made a strong positive impact today.";
  }

  if (score >= 50) {
    return "Good progress. A couple more eco-actions can push you further.";
  }

  return "Small actions add up. Try adding 2-3 more sustainable habits tomorrow.";
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function handleCalculate() {
  const score = getSelectedScore();
  scoreValue.textContent = `${score} / 100`;
  feedback.textContent = getFeedbackMessage(score);
}

function handleSave() {
  const score = getSelectedScore();
  const checkedCount = habitInputs.filter((input) => input.checked).length;

  if (checkedCount === 0) {
    feedback.textContent = "Select at least one habit before saving.";
    return;
  }

  const history = loadHistory();
  history.push({
    date: new Date().toISOString().slice(0, 10),
    score,
    checkedCount,
  });

  saveHistory(history);
  feedback.textContent = "Saved. Keep tracking your impact every day.";
}

calculateBtn.addEventListener("click", handleCalculate);
saveBtn.addEventListener("click", handleSave);
