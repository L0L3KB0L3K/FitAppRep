import React, { useEffect } from "react";

// CustomUndoAlert – temen glass stil, pastelni border/gumb po tvoji paleti
function CustomUndoAlert({
  show,
  message,
  onUndo,
  onClose,
  color = "sky", // "sky", "pink", "green", "red"
  duration = 5000,
  undo = true,
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  // Pastel paleta
  const palette = {
    sky: {
      border: "border-sky-300",
      icon: "text-sky-300",
      text: "text-sky-200",
      button: "bg-sky-800 hover:bg-sky-700 text-sky-100 hover:text-white border border-sky-600",
    },
    pink: {
      border: "border-pink-300",
      icon: "text-pink-300",
      text: "text-pink-200",
      button: "bg-pink-800 hover:bg-pink-700 text-pink-100 hover:text-white border border-pink-600",
    },
    green: {
      border: "border-green-300",
      icon: "text-green-300",
      text: "text-green-200",
      button: "bg-green-800 hover:bg-green-700 text-green-100 hover:text-white border border-green-600",
    },
    red: {
      border: "border-red-300",
      icon: "text-red-300",
      text: "text-red-200",
      button: "bg-red-800 hover:bg-red-700 text-red-100 hover:text-white border border-red-600",
    },
  };
  const theme = palette[color] || palette.sky;

  return (
    <div
      className={`
        fixed top-8 left-1/2 -translate-x-1/2 z-[100]
        min-w-[260px] max-w-[380px] px-6 py-3
        rounded-2xl border-2 shadow-2xl flex items-center gap-3
        bg-[#232940]/95 backdrop-blur-xl
        ${theme.border}
        animate-fadeInOut transition-all duration-300
      `}
      style={{
        boxShadow: "0 8px 32px 0 rgba(40,60,120,0.13)",
      }}
    >
      {/* Ikona v barvi alerta */}
      <span className={`flex-shrink-0 flex items-center ${theme.icon}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.19"/>
          <path stroke="currentColor" strokeWidth="2" d="M12 8v4l2 2"/>
        </svg>
      </span>
      <span className={`font-medium text-base flex-1 ${theme.text}`}>
        {message}
      </span>
      {undo && (
        <button
          onClick={onUndo}
          className={`
            px-3 py-1 rounded-lg font-bold ml-2
            ${theme.button}
            shadow hover:shadow-lg active:scale-95
            transition-all duration-150
          `}
        >
          Razveljavi
        </button>
      )}
      <button
        onClick={onClose}
        className="
          ml-2 p-1 rounded-full
          text-gray-400 hover:text-white hover:bg-gray-800/60
          hover:scale-125
          focus:outline-none
          transition-all duration-150
        "
        title="Zapri"
        style={{ lineHeight: "1", fontWeight: "bold" }}
      >
        ✕
      </button>
    </div>
  );
}

export default CustomUndoAlert;
