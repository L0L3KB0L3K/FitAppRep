// src/components/TrainingCard.jsx

function TrainingCard({ training, onDelete }) {
  return (
    <div className="bg-white/10 rounded-xl shadow-lg p-5 border border-sky-400">
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
      {onDelete && (
        <button
          onClick={() => onDelete(training.id)}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded text-sm font-semibold transition"
        >
          Izbriši
        </button>
      )}
    </div>
  );
}

export default TrainingCard;
