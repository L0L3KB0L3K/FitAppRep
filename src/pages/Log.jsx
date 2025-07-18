import { useState } from "react";
import { useTranslation } from "react-i18next";
import useLocalStorage from "../hooks/useLocalStorage";
import TrainingCard from "../components/TrainingCard";
import MealCard from "../components/MealCard";
import CustomUndoAlert from "../components/CustomUndoAlert";
import ConfirmModal from "../components/ConfirmModal";

// Helper za validacijo treninga
function validateTraining(form, t) {
  let errors = {};
  if (!form.date) errors.date = t("log_required_date");
  if (!form.type) errors.type = t("log_required_training_type");
  if (!form.duration) errors.duration = t("log_required_duration");
  if (!form.calories) errors.calories = t("log_required_calories");
  return errors;
}
// Helper za validacijo obroka
function validateMeal(form, t) {
  let errors = {};
  if (!form.date) errors.date = t("log_required_date");
  if (!form.type) errors.type = t("log_required_meal_type");
  if (!form.calories) errors.calories = t("log_required_calories");
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
  const { t, i18n } = useTranslation();

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
    const errors = validateTraining(form, t);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSuccessMessage(t("log_fix_errors"));
      setShowSuccess(true);
      return;
    }
    const newTraining = { ...form, id: Date.now() };
    setTrainings([newTraining, ...trainings]);
    setForm(emptyTraining);
    setFormErrors({});
    setSuccessMessage(t("log_training_saved"));
    setShowSuccess(true);
  }

  // --- Vnos obroka ---
  function handleMealChange(e) {
    setMealForm({ ...mealForm, [e.target.name]: e.target.value });
    setMealErrors({ ...mealErrors, [e.target.name]: "" });
  }
  function handleMealSubmit(e) {
    e.preventDefault();
    const errors = validateMeal(mealForm, t);
    setMealErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSuccessMessage(t("log_fix_errors"));
      setShowSuccess(true);
      return;
    }
    const newMeal = { ...mealForm, id: Date.now() };
    setMeals([newMeal, ...meals]);
    setMealForm(emptyMeal);
    setMealErrors({});
    setSuccessMessage(t("log_meal_saved"));
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

  // Tipi treningov in obrokov iz translation.json
  const trainingTypes = [
    { value: "", label: t("log_select") },
    { value: "Tek", label: t("log_run") },
    { value: "Fitnes", label: t("log_gym") },
    { value: "Kolesarjenje", label: t("log_bike") },
    { value: "Plavanje", label: t("log_swim") },
    { value: "Drugo", label: t("log_other") },
  ];
  const mealTypes = [
    { value: "", label: t("log_select") },
    { value: "Zajtrk", label: t("log_breakfast") },
    { value: "Malica", label: t("log_snack") },
    { value: "Kosilo", label: t("log_lunch") },
    { value: "Večerja", label: t("log_dinner") },
    { value: "Prigrizek", label: t("log_other_meal") },
  ];

  return (
    <div className="min-h-screen w-full p-6 bg-[#202533]">
      {/* Alerti za uspeh, napako ali razveljavitev */}
      <CustomUndoAlert
        show={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
        color={successMessage === t("log_training_saved") || successMessage === t("log_meal_saved") ? "green" : "red"}
        duration={successMessage === t("log_training_saved") || successMessage === t("log_meal_saved") ? 1800 : 2500}
        undo={false}
      />
      <CustomUndoAlert
        show={undo.show}
        message={undo.type === "training" ? t("deleted_training") : t("deleted_meal")}
        onUndo={handleUndo}
        onClose={handleUndoClose}
        color={undo.type === "training" ? "sky" : "pink"}
        duration={5000}
        undo={true}
      />

      {/* Potrditveni modal za izbris */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEVA STRAN: VNOS TRENINGA */}
        <div>
          <h2 className="text-2xl font-bold mb-5 text-sky-400">{t("log_add_training")}</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-[#232940]/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-sky-400/10 space-y-4 mb-10 border border-sky-700"
            autoComplete="off"
          >
            {/* Datum */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">{t("log_training_date")}</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${formErrors.date ? "border-red-400 ring-2 ring-red-300" : "border-sky-900"} focus:border-sky-400 transition`}
                required
                aria-invalid={!!formErrors.date}
                aria-describedby="training-date-error"
                title={t("log_training_date")}
              />
              <InputError message={formErrors.date} />
            </div>
            {/* Tip treninga */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">{t("log_training_types")}</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${formErrors.type ? "border-red-400 ring-2 ring-red-300" : "border-sky-900"} focus:border-sky-400 transition`}
                required
                aria-invalid={!!formErrors.type}
                aria-describedby="training-type-error"
                title={t("log_training_types")}
              >
                {trainingTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <InputError message={formErrors.type} />
            </div>
            {/* Trajanje */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">{t("log_training_duration")}</label>
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
                title={t("log_training_duration")}
              />
              <InputError message={formErrors.duration} />
            </div>
            {/* Kalorije */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">{t("log_training_calories")}</label>
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
                title={t("log_training_calories")}
              />
              <InputError message={formErrors.calories} />
            </div>
            {/* Opomba */}
            <div>
              <label className="block mb-1 text-sky-300 font-bold">{t("log_notes")}</label>
              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-sky-900 focus:border-sky-400 transition"
                title={t("log_notes")}
              />
            </div>
            {/* Shrani trening gumb */}
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-150 hover:scale-105 hover:ring-2 hover:ring-sky-300 hover:shadow-lg active:scale-95"
              title={t("log_save_training")}
            >
              {t("log_save_training")}
            </button>
          </form>
          {/* Kartice za treninge */}
          <h3 className="text-xl font-bold mb-3 text-sky-400">{t("your_trainings")}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trainings.length === 0 && (
              <div className="text-gray-500">{t("log_no_trainings")}</div>
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
          <h2 className="text-2xl font-bold mb-5 text-pink-400">{t("log_add_meal")}</h2>
          <form
            onSubmit={handleMealSubmit}
            className="bg-[#232940]/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-pink-400/10 space-y-4 mb-10 border border-pink-700"
            autoComplete="off"
          >
            {/* Datum */}
            <div>
              <label className="block mb-1 text-pink-300 font-bold">{t("log_meal_date")}</label>
              <input
                type="date"
                name="date"
                value={mealForm.date}
                onChange={handleMealChange}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${mealErrors.date ? "border-red-400 ring-2 ring-red-300" : "border-pink-900"} focus:border-pink-400 transition`}
                required
                aria-invalid={!!mealErrors.date}
                aria-describedby="meal-date-error"
                title={t("log_meal_date")}
              />
              <InputError message={mealErrors.date} />
            </div>
            {/* Tip obroka */}
            <div>
              <label className="block mb-1 text-pink-300 font-bold">{t("log_meal_types")}</label>
              <select
                name="type"
                value={mealForm.type}
                onChange={handleMealChange}
                className={`w-full px-3 py-2 rounded bg-[#202533] text-white border ${mealErrors.type ? "border-red-400 ring-2 ring-red-300" : "border-pink-900"} focus:border-pink-400 transition`}
                required
                aria-invalid={!!mealErrors.type}
                aria-describedby="meal-type-error"
                title={t("log_meal_types")}
              >
                {mealTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <InputError message={mealErrors.type} />
            </div>
            {/* Kalorije */}
            <div>
              <label className="block mb-1 text-pink-300 font-bold">{t("log_meal_calories")}</label>
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
                title={t("log_meal_calories")}
              />
              <InputError message={mealErrors.calories} />
            </div>
            {/* Opis */}
            <div>
              <label className="block mb-1 text-pink-300 font-bold">{t("log_description")}</label>
              <input
                type="text"
                name="notes"
                value={mealForm.notes}
                onChange={handleMealChange}
                className="w-full px-3 py-2 rounded bg-[#202533] text-white border border-pink-900 focus:border-pink-400 transition"
                title={t("log_description")}
              />
            </div>
            {/* Shrani obrok gumb */}
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-150 hover:scale-105 hover:ring-2 hover:ring-pink-300 hover:shadow-lg active:scale-95"
              title={t("log_save_meal")}
            >
              {t("log_save_meal")}
            </button>
          </form>
          {/* Kartice za obroke */}
          <h3 className="text-xl font-bold mb-3 text-pink-400">{t("your_meals")}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meals.length === 0 && (
              <div className="text-gray-500">{t("log_no_meals")}</div>
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
