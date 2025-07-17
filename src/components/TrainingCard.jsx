import { Trash2 } from "lucide-react";

function TrainingCard({ training, onDelete }) {
  return (
    <div className="relative flex flex-col min-h-[110px]">
      <div className="
        bg-[#232940]/85 
        backdrop-blur-lg 
        rounded-2xl 
        shadow-lg shadow-sky-300/10 
        p-5 
        border-2 border-sky-300
        flex flex-col h-full 
        transition-all duration-300
      ">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-sky-300">{training.type}</span>
          <span className="text-xs text-gray-400">{training.date}</span>
        </div>
        <div className="flex space-x-6 mb-2">
          <span className="text-lime-300 font-semibold">
            Trajanje: {training.duration} min
          </span>
          <span className="text-pink-300 font-semibold">
            Kalorije: {training.calories}
          </span>
        </div>
        <div className="text-gray-200 text-sm mb-2">{training.notes}</div>
        <button
          onClick={() => onDelete(training.id)}
          className="absolute right-4 bottom-3 text-sky-300 hover:text-pink-300 bg-sky-900/10 hover:bg-pink-900/20 p-2 rounded-full transition-all duration-150"
          title="Izbriši trening"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
}
export default TrainingCard;
