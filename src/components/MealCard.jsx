import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Komponenta MealCard (i18n)
 * Prikazuje kartico posameznega obroka z animacijami,
 * hover efektom in tooltipom za izbris.
 */
function MealCard({ meal, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col min-h-[110px]">
      <div
        className="
          bg-[#232940]/85 
          backdrop-blur-lg 
          rounded-2xl 
          shadow-lg shadow-pink-300/10 
          p-5 
          border-2 border-pink-300
          flex flex-col h-full 
          transition-all duration-300
          hover:scale-[1.04] hover:shadow-xl hover:ring-2 hover:ring-pink-400
        "
        tabIndex={0}
        aria-label={`${t("meal_label")}: ${meal.type}, ${t("meal_calories")}: ${meal.calories}`}
        title={`${t("meal_label")}: ${meal.type}\n${t("meal_calories")}: ${meal.calories}`}
      >
        {/* Header: tip obroka in datum */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-pink-300">{meal.type}</span>
          <span className="text-xs text-gray-400">{meal.date}</span>
        </div>
        {/* Vsebina: kalorije */}
        <div className="flex space-x-6 mb-2">
          <span className="text-pink-300 font-semibold">
            {t("meal_calories")}: {meal.calories}
          </span>
        </div>
        {/* Opomba */}
        {meal.notes && (
          <div className="text-gray-200 text-sm mb-2">{meal.notes}</div>
        )}
        {/* Gumb za izbris z aria-label in tooltip */}
        <button
          onClick={() => onDelete(meal.id)}
          className="
            absolute right-4 bottom-3 text-pink-300 hover:text-sky-300
            bg-pink-900/10 hover:bg-sky-900/20 p-2 rounded-full
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-pink-300
          "
          aria-label={t("meal_delete")}
          title={t("meal_delete_tooltip")}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
export default MealCard;
