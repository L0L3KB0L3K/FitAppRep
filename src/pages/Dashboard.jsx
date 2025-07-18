import { useState } from "react";
import { useTranslation } from "react-i18next";
import useLocalStorage from "../hooks/useLocalStorage";
import TrainingCard from "../components/TrainingCard";
import MealCard from "../components/MealCard";
import ConfirmModal from "../components/ConfirmModal";
import CustomUndoAlert from "../components/CustomUndoAlert";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Registracija Chart.js komponent
Chart.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

// Helper funkcije (ostanejo nespremenjene)
function getDaysArr(num = 30) {
  const days = [];
  const today = new Date();
  for (let i = num - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}
function getDailyTrainingDuration(trainings, daysArr) {
  return daysArr.map(day =>
    trainings
      .filter((t) => t.date === day)
      .reduce((sum, t) => sum + Number(t.duration || 0), 0)
  );
}
function getDailyTrainingCount(trainings, daysArr) {
  return daysArr.map(day =>
    trainings.filter((t) => t.date === day).length
  );
}
function movingAvg(arr, windowSize = 7) {
  return arr.map((_, i, a) => {
    const start = Math.max(0, i - windowSize + 1);
    const slice = a.slice(start, i + 1);
    return Math.round(slice.reduce((s, v) => s + v, 0) / slice.length);
  });
}
function getWeeklyStats(trainings, meals) {
  const daysOfWeek = ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"];
  const trainingCounts = Array(7).fill(0);
  const mealCounts = Array(7).fill(0);

  trainings.forEach((t) => {
    if (!t.date) return;
    const date = new Date(t.date);
    let day = (date.getDay() + 6) % 7;
    trainingCounts[day]++;
  });
  meals.forEach((m) => {
    if (!m.date) return;
    const date = new Date(m.date);
    let day = (date.getDay() + 6) % 7;
    mealCounts[day]++;
  });

  return { labels: daysOfWeek, trainingCounts, mealCounts };
}
function getSportsDistribution(trainings) {
  const sports = {};
  trainings.forEach((t) => {
    if (!t.type) return;
    sports[t.type] = (sports[t.type] || 0) + 1;
  });
  const labels = Object.keys(sports);
  const data = labels.map((l) => sports[l]);
  return { labels, data };
}
function getStreak(items) {
  let streak = 0;
  let day = new Date();
  for (;;) {
    const dStr = day.toISOString().slice(0, 10);
    if (items.some((i) => i.date === dStr)) {
      streak++;
      day.setDate(day.getDate() - 1);
    } else break;
  }
  return streak;
}

function Dashboard() {
  const { t } = useTranslation();

  // LocalStorage: treningi, obroki
  const [trainings, setTrainings] = useLocalStorage("trainings", []);
  const [meals, setMeals] = useLocalStorage("meals", []);

  // Povzetki
  const totalTrainings = trainings.length;
  const totalMeals = meals.length;

  // Streaks
  const trainingStreak = getStreak(trainings);
  const mealStreak = getStreak(meals);

  // Graf: 30 dni
  const daysArr = getDaysArr(30);
  const labels = daysArr.map((d) => `${d.slice(8, 10)}.${d.slice(5, 7)}.`);
  const caloriesIn = daysArr.map((day) =>
    meals.filter((m) => m.date === day).reduce((s, m) => s + Number(m.calories || 0), 0)
  );
  const caloriesOut = daysArr.map((day) =>
    trainings.filter((t) => t.date === day).reduce((s, t) => s + Number(t.calories || 0), 0)
  );
  const calorieBalance = caloriesIn.map((cIn, i) => cIn - caloriesOut[i]);
  const dailyTrainingCount = getDailyTrainingCount(trainings, daysArr);
  const dailyTrainingDuration = getDailyTrainingDuration(trainings, daysArr);
  const calorieBalanceAvg = movingAvg(calorieBalance, 7);
  const durationAvg = movingAvg(dailyTrainingDuration, 7);

  // Bar graf: tedenska statistika
  const weeklyStats = getWeeklyStats(trainings, meals);
  // Doughnut: razmerje športov
  const sportsDist = getSportsDistribution(trainings);

  // Brisanje + undo logika
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteType, setConfirmDeleteType] = useState("training");
  const [undo, setUndo] = useState({ show: false, item: null, type: "" });

  function handleDeleteConfirm() {
    if (confirmDeleteType === "training") {
      const training = trainings.find((t) => t.id === confirmDeleteId);
      setTrainings(trainings.filter((t) => t.id !== confirmDeleteId));
      setUndo({ show: true, item: training, type: "training" });
    } else {
      const meal = meals.find((m) => m.id === confirmDeleteId);
      setMeals(meals.filter((m) => m.id !== confirmDeleteId));
      setUndo({ show: true, item: meal, type: "meal" });
    }
    setConfirmDeleteId(null);
  }

  function handleUndo() {
    if (undo.type === "training" && undo.item) {
      setTrainings([undo.item, ...trainings]);
    } else if (undo.type === "meal" && undo.item) {
      setMeals([undo.item, ...meals]);
    }
    setUndo({ show: false, item: null, type: "" });
  }
  function handleUndoClose() {
    setUndo({ show: false, item: null, type: "" });
  }

  return (
    <div className="p-6 w-full min-h-screen bg-[#202533]">
      {/* Povzetek cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#232940]/80 rounded-xl p-5 shadow border-2 border-sky-300 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg">
          <div className="text-lg text-sky-300 font-bold">{t("dashboard_trainings")}</div>
          <div className="text-3xl text-lime-300 font-black">{totalTrainings}</div>
        </div>
        <div className="bg-[#232940]/80 rounded-xl p-5 shadow border-2 border-pink-300 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg">
          <div className="text-lg text-pink-300 font-bold">{t("dashboard_meals")}</div>
          <div className="text-3xl text-sky-300 font-black">{totalMeals}</div>
        </div>
        <div className="bg-[#232940]/80 rounded-xl p-5 shadow border-2 border-sky-300 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg">
          <div className="text-base text-sky-200 font-bold">{t("dashboard_training_streak")}</div>
          <div className="text-2xl text-lime-300 font-bold">{trainingStreak} {t("days_short")}</div>
        </div>
        <div className="bg-[#232940]/80 rounded-xl p-5 shadow border-2 border-pink-300 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg">
          <div className="text-base text-pink-200 font-bold">{t("dashboard_meal_streak")}</div>
          <div className="text-2xl text-lime-300 font-bold">{mealStreak} {t("days_short")}</div>
        </div>
      </div>

      {/* UNDO ALERT za izbris */}
      <CustomUndoAlert
        show={undo.show}
        message={undo.type === "training" ? t("deleted_training") : t("deleted_meal")}
        onUndo={handleUndo}
        onClose={handleUndoClose}
        color={undo.type === "training" ? "sky" : "pink"}
        duration={5000}
        undo={true}
      />

      {/* Glavni graf: napredni pregled aktivnosti */}
      <div className="bg-[#232940]/80 rounded-xl p-5 shadow border-2 border-lime-300 mb-8 max-w-2xl mx-auto overflow-x-auto">
        <h2 className="text-lg text-lime-300 font-bold mb-3" title={t("dashboard_overview_title")}>
          {t("dashboard_overview_title")}
        </h2>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: t("net_calories"),
                data: calorieBalance,
                borderColor: "#f472b6",
                backgroundColor: "rgba(244,114,182,0.11)",
                pointBackgroundColor: "#f472b6",
                borderWidth: 3,
                pointRadius: 4,
                tension: 0.3,
                fill: false,
                yAxisID: "y",
                order: 2,
              },
              {
                label: t("input_calories"),
                data: caloriesIn,
                borderColor: "#a3e635",
                borderDash: [8, 6],
                pointBackgroundColor: "#a3e635",
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.3,
                fill: false,
                yAxisID: "y",
                order: 2,
              },
              {
                label: t("output_calories"),
                data: caloriesOut,
                borderColor: "#38bdf8",
                borderDash: [4, 8],
                pointBackgroundColor: "#38bdf8",
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.3,
                fill: false,
                yAxisID: "y",
                order: 2,
              },
              {
                label: t("trainings_count"),
                data: dailyTrainingCount,
                borderColor: "#fbbf24",
                borderDash: [1, 2],
                pointStyle: "rectRounded",
                showLine: false,
                pointBackgroundColor: "#fbbf24",
                borderWidth: 2,
                pointRadius: 6,
                yAxisID: "y2",
                order: 1,
              },
              {
                label: t("trainings_duration"),
                data: dailyTrainingDuration,
                borderColor: "#c084fc",
                backgroundColor: "rgba(192,132,252,0.12)",
                pointBackgroundColor: "#c084fc",
                borderWidth: 2,
                pointRadius: 3,
                tension: 0.22,
                fill: false,
                yAxisID: "y3",
                order: 3,
              },
              {
                label: t("net_calories_avg"),
                data: calorieBalanceAvg,
                borderColor: "#e0e8ef",
                borderDash: [2, 6],
                pointRadius: 0,
                borderWidth: 2,
                fill: false,
                tension: 0.33,
                yAxisID: "y",
                order: 4,
              },
              {
                label: t("duration_avg"),
                data: durationAvg,
                borderColor: "#a5b4fc",
                borderDash: [6, 2],
                pointRadius: 0,
                borderWidth: 2,
                fill: false,
                tension: 0.2,
                yAxisID: "y3",
                order: 5,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                labels: { color: "#fff", font: { size: 14, weight: "bold" } },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let lbl = context.dataset.label + ": " + context.parsed.y;
                    if (context.dataset.label.includes(t("calories"))) lbl += " kcal";
                    if (context.dataset.label.includes(t("duration"))) lbl += " min";
                    if (context.dataset.label.includes(t("trainings_count"))) lbl += "×";
                    return lbl;
                  },
                },
              },
            },
            scales: {
              y: {
                type: "linear",
                position: "left",
                title: { display: true, text: t("calories_axis") },
                ticks: { color: "#a3e635", font: { size: 13 } },
                grid: { color: "rgba(255,255,255,0.09)" },
              },
              y2: {
                type: "linear",
                position: "right",
                title: { display: true, text: t("trainings_axis") },
                grid: { drawOnChartArea: false },
                ticks: { color: "#fbbf24", font: { size: 13 } },
                min: 0,
                max: Math.max(...dailyTrainingCount, 1) + 1,
              },
              y3: {
                type: "linear",
                position: "right",
                title: { display: true, text: t("duration_axis") },
                grid: { drawOnChartArea: false },
                ticks: { color: "#c084fc", font: { size: 13 } },
                min: 0,
                max: Math.max(...dailyTrainingDuration, ...durationAvg, 1) + 20,
                offset: true,
              },
              x: {
                ticks: { color: "#e0e8ef", font: { size: 12 } },
                grid: { color: "rgba(255,255,255,0.03)" },
              },
            },
            elements: {
              point: { hitRadius: 10 },
            },
          }}
          height={250}
        />
      </div>

      {/* Spodnja dva grafa: Bar in Doughnut */}
      <div className="flex flex-col md:flex-row gap-10 justify-center items-start mb-12 max-w-5xl mx-auto">
        {/* Bar chart: dnevni razpored */}
        <div className="bg-[#232940]/80 rounded-xl p-5 shadow border-2 border-sky-300 w-full md:w-[420px] min-h-[260px] transition-transform duration-200 hover:scale-105 hover:shadow-lg">
          <h2 className="text-base text-sky-300 font-bold mb-2" title={t("weekly_stats_title")}>
            {t("weekly_stats_title")}
          </h2>
          <Bar
            data={{
              labels: weeklyStats.labels,
              datasets: [
                {
                  label: t("dashboard_trainings"),
                  data: weeklyStats.trainingCounts,
                  backgroundColor: "rgba(56,189,248,0.85)",
                  borderRadius: 6,
                },
                {
                  label: t("dashboard_meals"),
                  data: weeklyStats.mealCounts,
                  backgroundColor: "rgba(244,114,182,0.80)",
                  borderRadius: 6,
                },
              ],
            }}
            options={{
              plugins: {
                legend: { labels: { color: "#fff", font: { size: 13 } } },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return context.dataset.label + ": " + context.parsed.y + "×";
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: "#a3e635", font: { size: 13 } },
                  grid: { color: "rgba(255,255,255,0.08)" },
                },
                x: {
                  ticks: { color: "#e0e8ef", font: { size: 12 } },
                  grid: { color: "rgba(255,255,255,0.03)" },
                },
              },
            }}
            height={300}
          />
        </div>
        {/* Doughnut chart: razmerje športov */}
        <div className="bg-[#232940]/80 rounded-xl p-5 shadow border-2 border-sky-300 w-full md:w-[420px] min-h-[260px] flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg">
          <h2 className="text-base text-sky-300 font-bold mb-2" title={t("sports_distribution")}>
            {t("sports_distribution")}
          </h2>
          <Doughnut
            data={{
              labels: sportsDist.labels,
              datasets: [
                {
                  data: sportsDist.data,
                  backgroundColor: [
                    "rgba(56,189,248,0.8)",
                    "rgba(190,24,93,0.70)",
                    "rgba(16,185,129,0.66)",
                    "rgba(236,72,153,0.60)",
                  ],
                  borderWidth: 2,
                  borderColor: "#222",
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  labels: { color: "#fff", font: { weight: "bold", size: 13 } },
                  position: "bottom",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const val = context.parsed;
                      const percent = ((val / total) * 100).toFixed(1);
                      return `${context.label}: ${val} (${percent}%)`;
                    },
                  },
                },
              },
              cutout: "70%",
            }}
            height={180}
          />
        </div>
      </div>

      {/* Seznam treningov in obrokov */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Treningi */}
        <div>
          <h2 className="text-xl text-sky-300 font-bold mb-3">{t("your_trainings")}</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
            {trainings.length === 0 && (
              <div className="text-gray-400">{t("no_trainings")}</div>
            )}
            {trainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onDelete={() => {
                  setConfirmDeleteId(training.id);
                  setConfirmDeleteType("training");
                }}
              />
            ))}
          </div>
        </div>
        {/* Obroki */}
        <div>
          <h2 className="text-xl text-pink-300 font-bold mb-3">{t("your_meals")}</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
            {meals.length === 0 && (
              <div className="text-gray-400">{t("no_meals")}</div>
            )}
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onDelete={() => {
                  setConfirmDeleteId(meal.id);
                  setConfirmDeleteType("meal");
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Confirm Modal po potrebi */}
      <ConfirmModal
        open={!!confirmDeleteId}
        title={
          confirmDeleteType === "training"
            ? t("confirm_delete_training")
            : t("confirm_delete_meal")
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteId(null)}
        confirmText={t("delete")}
        cancelText={t("cancel_btn")}
      />
    </div>
  );
}

export default Dashboard;
