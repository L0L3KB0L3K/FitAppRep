import { useState, useEffect, useRef } from "react";

// Funkcija za branje vseh treningov iz localStorage
function getStoredTrainings() {
  const data = localStorage.getItem("trainings");
  return data ? JSON.parse(data) : [];
}

function Log() {
  const [form, setForm] = useState({
    date: "",
    type: "",
    duration: "",
    calories: "",
    notes: "",
  });

  const [trainings, setTrainings] = useState([]);
  const [deletedTraining, setDeletedTraining] = useState(null);

  // Za prikaz custom alertov:
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUndo, setShowUndo] = useState(false);

  // Timeout za undo alert
  const undoTimeoutRef = useRef(null);

  // Custom modal za potrditev brisanja
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    setTrainings(getStoredTrainings());
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.type || !form.duration || !form.calories) {
      setShowSuccess(false);
      setShowUndo(false);
      alert("Izpolni vsa obvezna polja!");
      return;
    }
    const newTraining = {
      ...form,
      id: Date.now(),
    };
    const updated = [newTraining, ...trainings];
    setTrainings(updated);
    localStorage.setItem("trainings", JSON.stringify(updated));
    setForm({ date: "", type: "", duration: "", calories: "", notes: "" });
    // Prikaži custom alert za uspešno shranjevanje
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
  }

  function handleUndoDelete() {
    if (deletedTraining) {
      const updated = [deletedTraining, ...trainings];
      setTrainings(updated);
      localStorage.setItem("trainings", JSON.stringify(updated));
      setDeletedTraining(null);
      setShowUndo(false);
      setShowSuccess(true); // Prikaži še enkrat alert (npr. "Razveljavljeno!")
      setTimeout(() => setShowSuccess(false), 1200);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    }
  }

  function doDelete(id) {
    const trainingToDelete = trainings.find((t) => t.id === id);
    if (!trainingToDelete) return;

    const updated = trainings.filter((training) => training.id !== id);
    setTrainings(updated);
    localStorage.setItem("trainings", JSON.stringify(updated));
    setDeletedTraining(trainingToDelete);

    setShowUndo(true);
    // Skrij undo alert po 6 sekundah
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
      setShowUndo(false);
      setDeletedTraining(null);
    }, 6000);
  }

  // Custom confirm modal (lepo, neon, glass)
  const ConfirmModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white/10 backdrop-blur-xl border-2 border-sky-400 rounded-2xl p-8 shadow-2xl flex flex-col items-center animate-fadeInOut">
        <div className="text-lg text-gray-100 font-bold mb-4">
          Ali res želiš izbrisati ta trening?
        </div>
        <div className="flex space-x-4 mt-2">
          <button
            className="bg-red-500 hover:bg-fuchsia-500 text-white px-5 py-2 rounded-xl font-extrabold text-base shadow transition-all duration-200 border border-red-400 hover:shadow-xl"
            onClick={() => {
              doDelete(confirmDeleteId);
              setConfirmDeleteId(null);
            }}
          >
            <span className="drop-shadow-[0_0_6px_#f0abfc]">Izbriši</span>
          </button>
          <button
            className="bg-gray-900 hover:bg-gray-800 text-sky-300 px-5 py-2 rounded-xl font-bold text-base shadow border border-sky-500 transition-all duration-200"
            onClick={() => setConfirmDeleteId(null)}
          >
            Prekliči
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ALERT za uspešen vnos ali undo */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-lime-400 text-gray-900 font-bold px-6 py-3 rounded-2xl shadow-2xl text-lg flex items-center space-x-4 animate-fadeInOut">
          ✅ Akcija uspešna!
        </div>
      )}

      {/* ALERT za undo po brisanju */}
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

      {/* MODAL za potrditev brisanja */}
      {confirmDeleteId && <ConfirmModal />}

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-sky-400">Dodaj trening</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 p-6 rounded-xl shadow-lg max-w-md space-y-4 mb-8"
        >
          <div>
            <label className="block mb-1 text-lime-300 font-semibold">Datum*</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-lime-300 font-semibold">Tip treninga*</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100"
              required
            >
              <option value="">Izberi...</option>
              <option value="Tek">Tek</option>
              <option value="Fitnes">Fitnes</option>
              <option value="Kolesarjenje">Kolesarjenje</option>
              <option value="Plavanje">Plavanje</option>
              <option value="Drugo">Drugo</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-lime-300 font-semibold">Trajanje (min)*</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              min={1}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-lime-300 font-semibold">Porabljene kalorije*</label>
            <input
              type="number"
              name="calories"
              value={form.calories}
              onChange={handleChange}
              min={1}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-lime-300 font-semibold">Opomba</label>
            <input
              type="text"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-lime-400 text-white font-semibold py-2 px-4 rounded shadow-lg transition"
          >
            Shrani trening
          </button>
        </form>

        {/* Prikaz vseh shranjenih treningov pod obrazcem */}
        <h2 className="text-xl font-bold mb-3 text-sky-300">Tvoji treningi</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trainings.length === 0 && (
            <div className="text-gray-400">Ni še treningov.</div>
          )}
          {trainings.map((training) => (
            <div
              key={training.id}
              className="bg-white/10 rounded-xl shadow-lg p-5 border border-sky-400"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-lime-300">{training.type}</span>
                <span className="text-xs text-gray-300">{training.date}</span>
              </div>
              <div className="flex space-x-4 mb-2">
                <span className="text-pink-400 font-semibold">
                  Trajanje: {training.duration} min
                </span>
                <span className="text-fuchsia-400 font-semibold">
                  Kalorije: {training.calories}
                </span>
              </div>
              <div className="text-gray-200 text-sm mb-2">{training.notes}</div>
              <button
                onClick={() => setConfirmDeleteId(training.id)}
                className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded text-sm font-semibold transition"
              >
                Izbriši
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Log;
