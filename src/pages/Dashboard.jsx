import { useState, useRef } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import TrainingCard from "../components/TrainingCard";
import ConfirmModal from "../components/ConfirmModal";
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

// Helper: Bar chart - treningi in kalorije po dnevih v tednu
function getWeeklyTrainingStats(trainings) {
  const daysOfWeek = ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"];
  const trainingCounts = Array(7).fill(0);
  const caloriesPerDay = Array(7).fill(0);

  trainings.forEach((t) => {
    if (!t.date) return;
    const date = new Date(t.date);
    let day = date.getDay();
    day = (day + 6) % 7;
    trainingCounts[day]++;
    caloriesPerDay[day] += Number(t.calories || 0);
  });

  return {
    labels: daysOfWeek,
    trainingCounts,
    caloriesPerDay,
  };
}

// Helper: Line chart - zadnjih 30 dni (prikaz po datumih)
function getMonthlyStats(trainings) {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const labels = days.map((d) => `${d.slice(8, 10)}.${d.slice(5, 7)}.`);
  const trainingCounts = days.map((day) =>
    trainings.filter((t) => t.date === day).length
  );
  const caloriesPerDay = days.map((day) =>
    trainings
      .filter((t) => t.date === day)
      .reduce((s, t) => s + Number(t.calories || 0), 0)
  );
  return { labels, trainingCounts, caloriesPerDay };
}

// Helper: Doughnut chart - razmerje športov
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

function Dashboard() {
  const [trainings, setTrainings] = useLocalStorage("trainings", []);

  // Povzetek
  const totalTrainings = trainings.length;
  const totalCalories = trainings.reduce(
    (sum, t) => sum + Number(t.calories),
    0
  );

  // Za brisanje (modal + undo)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletedTraining, setDeletedTraining] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimeoutRef = useRef(null);

  // Statistika za grafe
  const weeklyStats = getWeeklyTrainingStats(trainings);
  const monthStats = getMonthlyStats(trainings);
  const sportsDist = getSportsDistribution(trainings);

  function doDelete(id) {
    const trainingToDelete = trainings.find((t) => t.id === id);
    if (!trainingToDelete) return;
    setTrainings(trainings.filter((training) => training.id !== id));
    setDeletedTraining(trainingToDelete);

    setShowUndo(true);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
      setShowUndo(false);
      setDeletedTraining(null);
    }, 6000);
  }

  function handleUndoDelete() {
    if (deletedTraining) {
      setTrainings([deletedTraining, ...trainings]);
      setDeletedTraining(null);
      setShowUndo(false);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    }
  }

  return (
    <>
      {/* Undo alert */}
      {showUndo && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-sky-400/90 text-gray-900 font-bold px-6 py-3 rounded-2xl shadow-2xl text-lg flex items-center space-x-4 animate-fadeInOut">
          <span>Trening izbrisan.</span>
          <button
            onClick={handleUndoDelete}
            className="bg-lime-400 text-gray-900 font-semibold px-4 py-1 rounded-xl ml-3 hover:bg-lime-300 transition"
          >
            Razveljavi
          </button>
        </div>
      )}

      {/* Confirm delete modal */}
      <ConfirmModal
        open={!!confirmDeleteId}
        title="Ali res želiš izbrisati ta trening?"
        onConfirm={() => {
          doDelete(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
        confirmText="Izbriši"
        cancelText="Prekliči"
      />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-lime-400">
          Tvoj pregled treningov
        </h1>

        {/* Povzetek na vrhu */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="bg-gray-800/90 rounded-xl p-4 shadow text-white font-bold text-lg">
            Skupaj treningov:{" "}
            <span className="text-lime-400">{totalTrainings}</span>
          </div>
          <div className="bg-gray-800/90 rounded-xl p-4 shadow text-white font-bold text-lg">
            Skupaj kalorij:{" "}
            <span className="text-fuchsia-400">{totalCalories}</span>
          </div>
        </div>

        {/* Grafi v grid postavitvi */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">
  {/* Graf 1: Bar chart za teden */}
  <div className="bg-gray-800/80 rounded-xl p-4 shadow max-w-full flex-1">
    <h2 className="text-lg text-sky-300 font-bold mb-3">Treningi in kalorije po dnevih v tednu</h2>
    <Bar
      data={{
        labels: weeklyStats.labels,
        datasets: [
          {
            label: "Št. treningov",
            data: weeklyStats.trainingCounts,
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderRadius: 6,
            yAxisID: "y",
          },
          {
            label: "Kalorije",
            data: weeklyStats.caloriesPerDay,
            backgroundColor: "rgba(236, 72, 153, 0.7)",
            borderRadius: 6,
            yAxisID: "y1",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label === "Št. treningov"
                  ? `Treningi: ${context.parsed.y}`
                  : `Kalorije: ${context.parsed.y}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Št. treningov" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
          y1: {
            beginAtZero: true,
            position: "right",
            title: { display: true, text: "Kalorije" },
            grid: { drawOnChartArea: false },
          },
        },
      }}
      height={220}
    />
  </div>

  {/* Graf 2: Line chart za zadnjih 30 dni */}
  <div className="bg-gray-800/80 rounded-xl p-4 shadow max-w-full flex-1">
    <h2 className="text-lg text-sky-300 font-bold mb-3">Treningi in kalorije v zadnjih 30 dneh</h2>
    <Line
      data={{
        labels: monthStats.labels,
        datasets: [
          {
            label: "Št. treningov",
            data: monthStats.trainingCounts,
            borderColor: "rgba(16,185,129,1)",
            backgroundColor: "rgba(16,185,129,0.15)",
            tension: 0.3,
            yAxisID: "y",
            fill: false,
            pointBackgroundColor: "rgba(16,185,129,1)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: "Kalorije",
            data: monthStats.caloriesPerDay,
            borderColor: "rgba(236,72,153,1)",
            backgroundColor: "rgba(236,72,153,0.10)",
            tension: 0.3,
            yAxisID: "y1",
            fill: false,
            pointBackgroundColor: "rgba(236,72,153,1)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Treningi" },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
          y1: {
            beginAtZero: true,
            position: "right",
            title: { display: true, text: "Kalorije" },
            grid: { drawOnChartArea: false },
          },
        },
      }}
      height={220}
    />
  </div>

  {/* Graf 3: Doughnut chart za športno razmerje */}
  <div className="bg-gray-800/80 rounded-xl p-4 shadow max-w-full flex-1">
    <h2 className="text-lg text-sky-300 font-bold mb-3">Največ treniran šport (deleži)</h2>
    <Doughnut
      data={{
        labels: sportsDist.labels,
        datasets: [
          {
            data: sportsDist.data,
            backgroundColor: [
              "rgba(236,72,153,0.8)",
              "rgba(16,185,129,0.8)",
              "rgba(56,189,248,0.8)",
              "rgba(190,24,93,0.8)",
              "rgba(34,197,94,0.8)",
              "rgba(14,165,233,0.8)",
            ],
            borderWidth: 2,
            borderColor: "#222",
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#fff",
              font: { weight: "bold", size: 15 },
              boxWidth: 25,
            },
          },
        },
      }}
      height={180}
    />
  </div>
</div>

        {/* Seznam treningov */}
        <h2 className="text-2xl text-sky-400 font-bold mb-3 mt-8">
          Vsi tvoji treningi
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainings.length === 0 && (
            <div className="text-gray-400">Nimaš še shranjenih treningov.</div>
          )}
          {trainings.map((training) => (
            <TrainingCard
              key={training.id}
              training={training}
              onDelete={() => setConfirmDeleteId(training.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
