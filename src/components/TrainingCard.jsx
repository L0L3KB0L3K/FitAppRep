import { Trash2 } from "lucide-react";

/**
 * Komponenta TrainingCard
 * Prikazuje kartico posameznega treninga z animacijami,
 * lepšim hover efektom in tooltipom za izbris.
 */
function TrainingCard({ training, onDelete }) {
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
        aria-label={`Trening: ${training.type}, ${training.duration} min, ${training.calories} kcal`}
        title={`Trening: ${training.type}\nTrajanje: ${training.duration} min\nPorabljene kalorije: ${training.calories}`}
      >
        {/* Header: tip treninga in datum */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-sky-300">{training.type}</span>
          <span className="text-xs text-gray-400">{training.date}</span>
        </div>
        {/* Vsebina: trajanje in kalorije */}
        <div className="flex space-x-6 mb-2">
          <span className="text-lime-300 font-semibold">
            Trajanje: {training.duration} min
          </span>
          <span className="text-pink-300 font-semibold">
            Kalorije: {training.calories}
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
          aria-label="Izbriši trening"
          title="Izbriši ta trening"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
}
export default TrainingCard;
