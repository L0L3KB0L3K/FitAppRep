import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Komponenta TrainingCard – i18n
 */
function TrainingCard({ training, onDelete }) {
  const { t } = useTranslation();

  // Prikazana sporočila so zdaj povsod prevedena!
  return (
    <div className="relative flex flex-col min-h-[110px]">
      <div
        className="
          bg-[#232940]/85 
          backdrop-blur-lg 
          rounded-2xl 
          shadow-lg shadow-sky-300/10 
          p-5 
          border-2 border-sky-300
          flex flex-col h-full 
          transition-all duration-300
          hover:scale-[1.04] hover:shadow-xl hover:ring-2 hover:ring-sky-400
        "
        tabIndex={0}
        aria-label={
          `${t("training_label")}: ${training.type}, ` +
          `${t("training_duration")}: ${training.duration} ${t("training_duration_unit")}, ` +
          `${t("training_calories")}: ${training.calories} kcal`
        }
        title={
          `${t("training_label")}: ${training.type}\n` +
          `${t("training_duration")}: ${training.duration} ${t("training_duration_unit")}\n` +
          `${t("training_calories")}: ${training.calories} kcal`
        }
      >
        {/* Header: tip treninga in datum */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-sky-300">{training.type}</span>
          <span className="text-xs text-gray-400">{training.date}</span>
        </div>
        {/* Vsebina: trajanje in kalorije */}
        <div className="flex space-x-6 mb-2">
          <span className="text-lime-300 font-semibold">
            {t("training_duration")}: {training.duration} {t("training_duration_unit")}
          </span>
          <span className="text-pink-300 font-semibold">
            {t("training_calories")}: {training.calories}
          </span>
        </div>
        {/* Opomba */}
        {training.notes && (
          <div className="text-gray-200 text-sm mb-2">{training.notes}</div>
        )}
        {/* Gumb za izbris z aria-label in tooltip */}
        <button
          onClick={() => onDelete(training.id)}
          className="
            absolute right-4 bottom-3 text-sky-300 hover:text-pink-300
            bg-sky-900/10 hover:bg-pink-900/20 p-2 rounded-full
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-sky-300
          "
          aria-label={t("training_delete")}
          title={t("training_delete_tooltip")}
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
}
export default TrainingCard;
