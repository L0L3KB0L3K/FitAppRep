import { Trash2 } from "lucide-react";

function MealCard({ meal, onDelete }) {
  return (
    <div className="relative flex flex-col min-h-[110px]">
      <div className="
        bg-[#232940]/85 
        backdrop-blur-lg 
        rounded-2xl 
        shadow-lg shadow-pink-300/10 
        p-5 
        border-2 border-pink-300
        flex flex-col h-full 
        transition-all duration-300
      ">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-pink-300">{meal.type}</span>
          <span className="text-xs text-gray-400">{meal.date}</span>
        </div>
        <div className="flex space-x-6 mb-2">
          <span className="text-pink-300 font-semibold">
            Kalorije: {meal.calories}
          </span>
        </div>
        <div className="text-gray-200 text-sm mb-2">{meal.notes}</div>
        <button
          onClick={() => onDelete(meal.id)}
          className="absolute right-4 bottom-3 text-pink-300 hover:text-sky-300 bg-pink-900/10 hover:bg-sky-900/20 p-2 rounded-full transition-all duration-150"
          title="Izbriši obrok"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
export default MealCard;
