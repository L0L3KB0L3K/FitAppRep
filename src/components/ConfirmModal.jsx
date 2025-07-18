import { useEffect, useRef } from "react";

/**
 * ConfirmModal
 * Prikazuje modal za potrditev (npr. izbris). Fokusirano, dostopno, podpora za ESC in klik izven modala.
 */
function ConfirmModal({
  open,
  title,
  onConfirm,
  onCancel,
  confirmText = "Izbriši",
  cancelText = "Prekliči",
}) {
  const modalRef = useRef();

  // ESC tipka za zapiranje
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") {
        onCancel && onCancel();
      }
    }
    window.addEventListener("keydown", handleKey);

    // Autofokus na prvi gumb
    if (modalRef.current) {
      const firstBtn = modalRef.current.querySelector("button");
      if (firstBtn) firstBtn.focus();
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onCancel]);

  // Zapri na klik izven modala (klik na ozadje)
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onCancel && onCancel();
    }
  }

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Potrditveno okno"
      onClick={handleBackdropClick}
      tabIndex={-1}
    >
      <div
        className="bg-white/10 backdrop-blur-xl border-2 border-sky-400 rounded-2xl p-8 shadow-2xl flex flex-col items-center animate-fadeInOut"
        ref={modalRef}
        tabIndex={0}
      >
        <div className="text-lg text-gray-100 font-bold mb-4" id="confirm-modal-title">{title}</div>
        <div className="flex space-x-4 mt-2">
          <button
            className="bg-red-500 hover:bg-fuchsia-500 text-white px-5 py-2 rounded-xl font-extrabold text-base shadow transition-all duration-200 border border-red-400 hover:shadow-xl"
            onClick={onConfirm}
            aria-label={confirmText}
            tabIndex={0}
            autoFocus
          >
            <span className="drop-shadow-[0_0_6px_#f0abfc]">{confirmText}</span>
          </button>
          <button
            className="bg-gray-900 hover:bg-gray-800 text-sky-300 px-5 py-2 rounded-xl font-bold text-base shadow border border-sky-500 transition-all duration-200"
            onClick={onCancel}
            aria-label={cancelText}
            tabIndex={0}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
