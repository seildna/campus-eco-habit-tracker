const calculateBtn = document.getElementById("calculate-btn");
const saveBtn = document.getElementById("save-btn");
const scoreValue = document.getElementById("score-value");
const feedback = document.getElementById("feedback");
const historyList = document.getElementById("history-list");
const streakValue = document.getElementById("streak-value");
const averageValue = document.getElementById("average-value");
const habitInputs = Array.from(document.querySelectorAll('input[name="habit"]'));

const STORAGE_KEY = "campusEcoTrackerHistory";
const DAY_MS = 24 * 60 * 60 * 1000;

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

function toDateValue(dateText) {
  return new Date(`${dateText}T00:00:00`).getTime();
}

function calculateStreak(history) {
  if (!history.length) {
    return 0;
  }

  const uniqueDays = [...new Set(history.map((entry) => entry.date))]
    .sort((a, b) => toDateValue(b) - toDateValue(a));

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i += 1) {
    const prev = toDateValue(uniqueDays[i - 1]);
    const current = toDateValue(uniqueDays[i]);
    if (prev - current === DAY_MS) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

function renderHistory(history) {
  historyList.innerHTML = "";

  if (!history.length) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No entries yet. Save today's progress to start tracking.";
    historyList.appendChild(emptyItem);
    streakValue.textContent = "0 days";
    averageValue.textContent = "0 / 100";
    return;
  }

  const recent = [...history].slice(-5).reverse();
  recent.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = `${entry.date}: ${entry.score}/100 from ${entry.checkedCount} habit(s)`;
    historyList.appendChild(item);
  });

  const avg = Math.round(history.reduce((sum, entry) => sum + entry.score, 0) / history.length);
  averageValue.textContent = `${avg} / 100`;
  streakValue.textContent = `${calculateStreak(history)} day(s)`;
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

  const today = new Date().toISOString().slice(0, 10);
  const history = loadHistory().filter((entry) => entry.date !== today);
  history.push({
    date: today,
    score,
    checkedCount,
  });

  saveHistory(history);
  renderHistory(history);
  feedback.textContent = "Saved. Keep tracking your impact every day.";
}

calculateBtn.addEventListener("click", handleCalculate);
saveBtn.addEventListener("click", handleSave);
renderHistory(loadHistory());
