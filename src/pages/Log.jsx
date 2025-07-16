import { useState, useRef } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import ConfirmModal from "../components/ConfirmModal";

// Funkcija za inicializacijo praznega treninga
const emptyForm = {
  date: "",
  type: "",
  duration: "",
  calories: "",
  notes: "",
};

function Log() {
  const [form, setForm] = useState(emptyForm);

  // Uporabimo custom hook za localStorage!
  const [trainings, setTrainings] = useLocalStorage("trainings", []);
  const [deletedTraining, setDeletedTraining] = useState(null);

  // Za custom alerte
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUndo, setShowUndo] = useState(false);

  // Timeout za undo alert
  const undoTimeoutRef = useRef(null);

  // Za modal
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Input handler
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Shrani trening in prikaži alert
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
    setTrainings([newTraining, ...trainings]);
    setForm(emptyForm);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
  }

  // Razveljavi brisanje
  function handleUndoDelete() {
    if (deletedTraining) {
      setTrainings([deletedTraining, ...trainings]);
      setDeletedTraining(null);
      setShowUndo(false);
      setShowSuccess(true); // Alert za undo
      setTimeout(() => setShowSuccess(false), 1200);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    }
  }

  // Izvedi brisanje s potrditvijo
  function doDelete(id) {
    const trainingToDelete = trainings.find((t) => t.id === id);
    if (!trainingToDelete) return;

    setTrainings(trainings.filter((training) => training.id !== id));
    setDeletedTraining(trainingToDelete);

    setShowUndo(true);
    // Skrij undo alert po 6s
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
      setShowUndo(false);
      setDeletedTraining(null);
    }, 6000);
  }

  return (
    <>
      {/* Custom success alert */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-lime-400 text-gray-900 font-bold px-6 py-3 rounded-2xl shadow-2xl text-lg flex items-center space-x-4 animate-fadeInOut">
          ✅ Akcija uspešna!
        </div>
      )}

      {/* Custom undo alert */}
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
