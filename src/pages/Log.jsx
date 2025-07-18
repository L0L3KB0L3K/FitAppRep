import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import TrainingCard from "../components/TrainingCard";
import MealCard from "../components/MealCard";
import CustomUndoAlert from "../components/CustomUndoAlert";
import ConfirmModal from "../components/ConfirmModal";

// Helper za validacijo treninga
function validateTraining(form) {
  let errors = {};
  if (!form.date) errors.date = "Obvezen datum";
  if (!form.type) errors.type = "Izberi tip treninga";
  if (!form.duration) errors.duration = "Vpiši trajanje";
  if (!form.calories) errors.calories = "Vpiši kalorije";
  return errors;
}
// Helper za validacijo obroka
function validateMeal(form) {
  let errors = {};
  if (!form.date) errors.date = "Obvezen datum";
  if (!form.type) errors.type = "Izberi tip obroka";
  if (!form.calories) errors.calories = "Vpiši kalorije";
  return errors;
}

// Komponenta za prikaz napake (DRY, za polja)
function InputError({ message }) {
  if (!message) return null;
  return (
    <div className="text-red-400 text-xs font-semibold mt-1 ml-1 animate-pulse">{message}</div>
  );
}

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
  // State za treninge in obroke
  const [form, setForm] = useState(emptyTraining);
  const [formErrors, setFormErrors] = useState({});
  const [trainings, setTrainings] = useLocalStorage("trainings", []);
  const [mealForm, setMealForm] = useState(emptyMeal);
  const [mealErrors, setMealErrors] = useState({});
  const [meals, setMeals] = useLocalStorage("meals", []);

  // Undo/alert + potrditveni modal
  const [undo, setUndo] = useState({ show: false, item: null, type: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteType, setConfirmDeleteType] = useState("training");

  // --- Vnos treninga ---
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  }
  function handleSubmit(e) {
    e.preventDefault();
    const errors = validateTraining(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSuccessMessage("Popravi napake v obrazcu!");
      setShowSuccess(true);
      return;
    }
    const newTraining = { ...form, id: Date.now() };
    setTrainings([newTraining, ...trainings]);
    setForm(emptyTraining);
    setFormErrors({});
    setSuccessMessage("Trening uspešno shranjen!");
    setShowSuccess(true);
  }

  // --- Vnos obroka ---
  function handleMealChange(e) {
    setMealForm({ ...mealForm, [e.target.name]: e.target.value });
    setMealErrors({ ...mealErrors, [e.target.name]: "" });
  }
  function handleMealSubmit(e) {
    e.preventDefault();
    const errors = validateMeal(mealForm);
    setMealErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSuccessMessage("Popravi napake v obrazcu!");
      setShowSuccess(true);
      return;
    }
    const newMeal = { ...mealForm, id: Date.now() };
    setMeals([newMeal, ...meals]);
    setMealForm(emptyMeal);
    setMealErrors({});
    setSuccessMessage("Obrok uspešno shranjen!");
    setShowSuccess(true);
  }

  // --- Potrditveni modal (najprej potrdi, nato izbriši + undo) ---
  function handleAskDeleteTraining(id) {
    setConfirmDeleteId(id);
    setConfirmDeleteType("training");
  }
  function handleAskDeleteMeal(id) {
    setConfirmDeleteId(id);
    setConfirmDeleteType("meal");
  }
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

  // Undo logika
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
    <div className="min-h-screen w-full p-6 bg-[#202533]">
      {/* Alerti za uspeh, napako ali razveljavitev */}
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

      {/* Potrditveni modal za izbris */}
      <ConfirmModal
        open={!!confirmDeleteId}
        title={`Ali res želiš izbrisati ta ${confirmDeleteType === "training" ? "trening" : "obrok"}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteId(null)}
        confirmText="Izbriši"
        cancelText="Prekliči"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEVA STRAN: VNOS TRENINGA */}
        <div>
          <h2 className="text-2xl font-bold mb-5 text-sky-400">Dodaj trening</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-[#232940]/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-sky-400/10 space-y-4 mb-10 border border-sky-700"
            autoComplete="off"
          >
            {/* Datum */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">Datum*</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${formErrors.date ? "border-red-400 ring-2 ring-red-300" : "border-sky-900"} focus:border-sky-400 transition`}
                required
                aria-invalid={!!formErrors.date}
                aria-describedby="training-date-error"
                title="Izberi datum treninga"
              />
              <InputError message={formErrors.date} />
            </div>
            {/* Tip treninga */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">Tip treninga*</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${formErrors.type ? "border-red-400 ring-2 ring-red-300" : "border-sky-900"} focus:border-sky-400 transition`}
                required
                aria-invalid={!!formErrors.type}
                aria-describedby="training-type-error"
                title="Izberi tip treninga"
              >
                <option value="">Izberi...</option>
                <option value="Tek">Tek</option>
                <option value="Fitnes">Fitnes</option>
                <option value="Kolesarjenje">Kolesarjenje</option>
                <option value="Plavanje">Plavanje</option>
                <option value="Drugo">Drugo</option>
              </select>
              <InputError message={formErrors.type} />
            </div>
            {/* Trajanje */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">Trajanje (min)*</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                min={1}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${formErrors.duration ? "border-red-400 ring-2 ring-red-300" : "border-sky-900"} focus:border-sky-400 transition`}
                required
                aria-invalid={!!formErrors.duration}
                aria-describedby="training-duration-error"
                title="Vnesi trajanje treninga v minutah"
              />
              <InputError message={formErrors.duration} />
            </div>
            {/* Kalorije */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">Porabljene kalorije*</label>
              <input
                type="number"
                name="calories"
                value={form.calories}
                onChange={handleChange}
                min={1}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${formErrors.calories ? "border-red-400 ring-2 ring-red-300" : "border-sky-900"} focus:border-sky-400 transition`}
                required
                aria-invalid={!!formErrors.calories}
                aria-describedby="training-calories-error"
                title="Vnesi porabljene kalorije"
              />
              <InputError message={formErrors.calories} />
            </div>
            {/* Opomba */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">Opomba</label>
              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-sky-900 focus:border-sky-400 transition"
                title="Dodatna opomba ali komentar"
              />
            </div>
            {/* Shrani trening gumb */}
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-150 hover:scale-105 hover:ring-2 hover:ring-sky-300 hover:shadow-lg active:scale-95"
              title="Shrani trening"
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
                onDelete={() => handleAskDeleteTraining(training.id)} // Pomembno: najprej modal!
              />
            ))}
          </div>
        </div>

        {/* DESNA STRAN: VNOS OBROKA */}
        <div>
          <h2 className="text-2xl font-bold mb-5 text-pink-400">Dodaj obrok</h2>
          <form
            onSubmit={handleMealSubmit}
            className="bg-[#232940]/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-pink-400/10 space-y-4 mb-10 border border-pink-700"
            autoComplete="off"
          >
            {/* Datum */}
            <div>
              <label className="block mb-1 text-pink-300 font-bold">Datum*</label>
              <input
                type="date"
                name="date"
                value={mealForm.date}
                onChange={handleMealChange}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${mealErrors.date ? "border-red-400 ring-2 ring-red-300" : "border-pink-900"} focus:border-pink-400 transition`}
                required
                aria-invalid={!!mealErrors.date}
                aria-describedby="meal-date-error"
                title="Izberi datum obroka"
              />
              <InputError message={mealErrors.date} />
            </div>
            {/* Tip obroka */}
            <div>
              <label className="block mb-1 text-pink-300 font-bold">Tip obroka*</label>
              <select
                name="type"
                value={mealForm.type}
                onChange={handleMealChange}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${mealErrors.type ? "border-red-400 ring-2 ring-red-300" : "border-pink-900"} focus:border-pink-400 transition`}
                required
                aria-invalid={!!mealErrors.type}
                aria-describedby="meal-type-error"
                title="Izberi tip obroka"
              >
                <option value="">Izberi...</option>
                <option value="Zajtrk">Zajtrk</option>
                <option value="Malica">Malica</option>
                <option value="Kosilo">Kosilo</option>
                <option value="Večerja">Večerja</option>
                <option value="Prigrizek">Prigrizek</option>
              </select>
              <InputError message={mealErrors.type} />
            </div>
            {/* Kalorije */}
            <div>
              <label className="block mb-1 text-pink-300 font-bold">Kalorije*</label>
              <input
                type="number"
                name="calories"
                value={mealForm.calories}
                onChange={handleMealChange}
                min={1}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${mealErrors.calories ? "border-red-400 ring-2 ring-red-300" : "border-pink-900"} focus:border-pink-400 transition`}
                required
                aria-invalid={!!mealErrors.calories}
                aria-describedby="meal-calories-error"
                title="Vnesi količino kalorij"
              />
              <InputError message={mealErrors.calories} />
            </div>
            {/* Opis */}
            <div>
              <label className="block mb-1 text-pink-300 font-bold">Opis</label>
              <input
                type="text"
                name="notes"
                value={mealForm.notes}
                onChange={handleMealChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-pink-900 focus:border-pink-400 transition"
                title="Dodaj opis ali opombo"
              />
            </div>
            {/* Shrani obrok gumb */}
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-150 hover:scale-105 hover:ring-2 hover:ring-pink-300 hover:shadow-lg active:scale-95"
              title="Shrani obrok"
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
                onDelete={() => handleAskDeleteMeal(meal.id)} // Pomembno: najprej modal!
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Log;
