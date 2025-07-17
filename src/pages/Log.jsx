import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import TrainingCard from "../components/TrainingCard";
import MealCard from "../components/MealCard";
import CustomUndoAlert from "../components/CustomUndoAlert";

// Začetni objekti
const emptyTraining = {
  date: "",
  type: "",
  duration: "",
  calories: "",
  notes: "",
};
const emptyMeal = {
  date: "",
  type: "",
  calories: "",
  notes: "",
};

function Log() {
  const [form, setForm] = useState(emptyTraining);
  const [trainings, setTrainings] = useLocalStorage("trainings", []);
  const [mealForm, setMealForm] = useState(emptyMeal);
  const [meals, setMeals] = useLocalStorage("meals", []);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [undo, setUndo] = useState({ show: false, item: null, type: "" });

  // --- Handlers za trening ---
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.type || !form.duration || !form.calories) {
      setSuccessMessage("Izpolni vsa obvezna polja!");
      setShowSuccess(true);
      return;
    }
    const newTraining = { ...form, id: Date.now() };
    setTrainings([newTraining, ...trainings]);
    setForm(emptyTraining);
    setSuccessMessage("Trening uspešno shranjen!");
    setShowSuccess(true);
  }

  // --- Handlers za obrok ---
  function handleMealChange(e) {
    setMealForm({ ...mealForm, [e.target.name]: e.target.value });
  }
  function handleMealSubmit(e) {
    e.preventDefault();
    if (!mealForm.date || !mealForm.type || !mealForm.calories) {
      setSuccessMessage("Izpolni vsa obvezna polja!");
      setShowSuccess(true);
      return;
    }
    const newMeal = { ...mealForm, id: Date.now() };
    setMeals([newMeal, ...meals]);
    setMealForm(emptyMeal);
    setSuccessMessage("Obrok uspešno shranjen!");
    setShowSuccess(true);
  }

  // --- Brisanje treninga/obroka (UNDO sistem) ---
  function handleDeleteTraining(id) {
    const training = trainings.find((t) => t.id === id);
    setTrainings(trainings.filter((t) => t.id !== id));
    setUndo({ show: true, item: training, type: "training" });
  }
  function handleDeleteMeal(id) {
    const meal = meals.find((m) => m.id === id);
    setMeals(meals.filter((m) => m.id !== id));
    setUndo({ show: true, item: meal, type: "meal" });
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

  useEffect(() => {
    if (undo.show) {
      const timer = setTimeout(() => setUndo({ show: false, item: null, type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [undo]);

  return (
    <div className="min-h-screen w-full p-6 bg-[#202533]">
      {/* ALERTI */}
      <CustomUndoAlert
        show={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
        color={successMessage.includes("uspešno") ? "green" : "red"}
        duration={successMessage.includes("uspešno") ? 1800 : 2500}
        undo={false}
      />
      <CustomUndoAlert
        show={undo.show}
        message={undo.type === "training" ? "Trening izbrisan." : "Obrok izbrisan."}
        onUndo={handleUndo}
        onClose={handleUndoClose}
        color={undo.type === "training" ? "sky" : "pink"}
        duration={5000}
        undo={true}
      />
      {/* VSEBINA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEVA STRAN: TRENINGI */}
        <div>
          <h2 className="text-2xl font-bold mb-5 text-sky-400">Dodaj trening</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-[#232940]/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-sky-400/10 space-y-4 mb-10 border border-sky-700"
          >
            <div>
              <label className="block mb-1 text-sky-300 font-bold">Datum*</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-sky-900 focus:border-sky-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sky-300 font-bold">Tip treninga*</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-sky-900 focus:border-sky-400 transition"
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
              <label className="block mb-1 text-sky-300 font-bold">Trajanje (min)*</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-sky-900 focus:border-sky-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sky-300 font-bold">Porabljene kalorije*</label>
              <input
                type="number"
                name="calories"
                value={form.calories}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-sky-900 focus:border-sky-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sky-300 font-bold">Opomba</label>
              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-sky-900 focus:border-sky-400 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-150"
            >
              Shrani trening
            </button>
          </form>
          {/* Kartice za treninge */}
          <h3 className="text-xl font-bold mb-3 text-sky-400">Tvoji treningi</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trainings.length === 0 && (
              <div className="text-gray-500">Ni še treningov.</div>
            )}
            {trainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onDelete={handleDeleteTraining}
              />
            ))}
          </div>
        </div>
        {/* DESNA STRAN: OBROKI */}
        <div>
          <h2 className="text-2xl font-bold mb-5 text-pink-400">Dodaj obrok</h2>
          <form
            onSubmit={handleMealSubmit}
            className="bg-[#232940]/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-pink-400/10 space-y-4 mb-10 border border-pink-700"
          >
            <div>
              <label className="block mb-1 text-pink-300 font-bold">Datum*</label>
              <input
                type="date"
                name="date"
                value={mealForm.date}
                onChange={handleMealChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-pink-900 focus:border-pink-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-pink-300 font-bold">Tip obroka*</label>
              <select
                name="type"
                value={mealForm.type}
                onChange={handleMealChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-pink-900 focus:border-pink-400 transition"
                required
              >
                <option value="">Izberi...</option>
                <option value="Zajtrk">Zajtrk</option>
                <option value="Malica">Malica</option>
                <option value="Kosilo">Kosilo</option>
                <option value="Večerja">Večerja</option>
                <option value="Prigrizek">Prigrizek</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-pink-300 font-bold">Kalorije*</label>
              <input
                type="number"
                name="calories"
                value={mealForm.calories}
                onChange={handleMealChange}
                min={1}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-pink-900 focus:border-pink-400 transition"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-pink-300 font-bold">Opis</label>
              <input
                type="text"
                name="notes"
                value={mealForm.notes}
                onChange={handleMealChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-pink-900 focus:border-pink-400 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-150"
            >
              Shrani obrok
            </button>
          </form>
          {/* Kartice za obroke */}
          <h3 className="text-xl font-bold mb-3 text-pink-400">Tvoji obroki</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meals.length === 0 && (
              <div className="text-gray-500">Ni še obrokov.</div>
            )}
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onDelete={handleDeleteMeal}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Log;
