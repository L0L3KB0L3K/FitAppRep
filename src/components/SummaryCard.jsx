import { useTranslation } from "react-i18next";

/**
 * SummaryCard – i18n
 * Vizualno popolnoma usklajena kartica za povzetek (summary).
 */
const COLORS = {
  trening: {
    border: "border-sky-300 hover:ring-sky-400 shadow-sky-300/10",
    text: "text-sky-300",
    ring: "ring-sky-400"
  },
  obrok: {
    border: "border-pink-300 hover:ring-pink-400 shadow-pink-300/10",
    text: "text-pink-300",
    ring: "ring-pink-400"
  },
  kalorije: {
    border: "border-lime-400 hover:ring-lime-400 shadow-lime-400/10",
    text: "text-lime-300",
    ring: "ring-lime-400"
  },
  najdaljsi: {
    border: "border-yellow-400 hover:ring-yellow-400 shadow-yellow-400/10",
    text: "text-yellow-300",
    ring: "ring-yellow-400"
  }
};

export default function SummaryCard({ title, value, type }) {
  const { t } = useTranslation();
  const color = COLORS[type] || COLORS.trening;

  // Prevod naslova (key je že pravilen v Dashboard)
  const titleKey = {
    trening: "summary_trainings",
    obrok: "summary_meals",
    kalorije: "summary_calories",
    najdaljsi: "summary_longest",
  }[type] || title;

  return (
    <div className="relative flex flex-col min-h-[110px]">
      <div
        className={`
          bg-[#232940]/85 
          backdrop-blur-lg 
          rounded-2xl 
          shadow-lg ${color.shadow}
          p-5
          border-2 ${color.border}
          flex flex-col h-full
          transition-all duration-300
          hover:scale-[1.04] hover:shadow-xl hover:ring-2 ${color.ring}
        `}
        tabIndex={0}
        aria-label={typeof titleKey === "string" ? t(titleKey) : title}
        title={typeof titleKey === "string" ? t(titleKey) : title}
      >
        <div className={`text-base font-bold mb-2 ${color.text}`}>{typeof titleKey === "string" ? t(titleKey) : title}</div>
        <div className="text-2xl font-black text-white">{value}</div>
      </div>
    </div>
  );
}
