
// src/components/ConfirmModal.jsx
function ConfirmModal({ open, title, onConfirm, onCancel, confirmText = "Izbriši", cancelText = "Prekliči" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white/10 backdrop-blur-xl border-2 border-sky-400 rounded-2xl p-8 shadow-2xl flex flex-col items-center animate-fadeInOut">
        <div className="text-lg text-gray-100 font-bold mb-4">{title}</div>
        <div className="flex space-x-4 mt-2">
          <button
            className="bg-red-500 hover:bg-fuchsia-500 text-white px-5 py-2 rounded-xl font-extrabold text-base shadow transition-all duration-200 border border-red-400 hover:shadow-xl"
            onClick={onConfirm}
          >
            <span className="drop-shadow-[0_0_6px_#f0abfc]">{confirmText}</span>
          </button>
          <button
            className="bg-gray-900 hover:bg-gray-800 text-sky-300 px-5 py-2 rounded-xl font-bold text-base shadow border border-sky-500 transition-all duration-200"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
