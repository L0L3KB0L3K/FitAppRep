// src/pages/Dashboard.jsx

// Dummy podatki (kot da bi bili tvoji treningi)
const dummyTrainings = [
  {
    id: 1,
    date: "2024-07-17",
    type: "Tek",
    duration: 45, // v minutah
    calories: 530,
    notes: "Lep večerni tek ob reki."
  },
  {
    id: 2,
    date: "2024-07-16",
    type: "Fitnes",
    duration: 60,
    calories: 600,
    notes: "Trening za moč, poudarek na nogah."
  },
  {
    id: 3,
    date: "2024-07-15",
    type: "Kolesarjenje",
    duration: 30,
    calories: 350,
    notes: "Vožnja s prijatelji."
  }
];

function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-lime-400">Tvoj pregled treningov</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dummyTrainings.map((training) => (
          <div
            key={training.id}
            className="bg-white/10 rounded-xl shadow-lg p-5 border border-lime-400 hover:scale-105 transition transform duration-200 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-sky-300">{training.type}</span>
              <span className="text-xs text-gray-300">{training.date}</span>
            </div>
            <div className="flex space-x-4 mb-2">
              <span className="text-pink-400 font-semibold">Trajanje: {training.duration} min</span>
              <span className="text-fuchsia-400 font-semibold">Kalorije: {training.calories}</span>
            </div>
            <div className="text-gray-200 text-sm">{training.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
