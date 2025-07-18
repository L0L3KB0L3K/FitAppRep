import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next"; // I18N
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import useLocalStorage from "../hooks/useLocalStorage";
import { CalendarDays, Flame } from "lucide-react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import SummaryCard from "../components/SummaryCard";
import Confetti from 'react-confetti';

const ICONS = {
  Tek: "🏃",
  Fitnes: "🏋️",
  Kolesarjenje: "🚴",
  Plavanje: "🏊",
  Drugo: "🤸",
  Zajtrk: "🥣",
  Malica: "🥪",
  Kosilo: "🍲",
  Večerja: "🍽️",
  Prigrizek: "🍏",
};

function getStreak(items) {
  let streak = 0;
  let day = new Date();
  for (;;) {
    const dStr = day.toISOString().slice(0, 10);
    if (items.some((i) => i.date === dStr)) {
      streak++;
      day.setDate(day.getDate() - 1);
    } else break;
  }
  return streak;
}

function calcMonthlyStats(trainings, meals, viewDate) {
  const month = viewDate.getMonth() + 1;
  const year = viewDate.getFullYear();
  const trainMonth = trainings.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
  const mealMonth = meals.filter(m => {
    const d = new Date(m.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
  const calories = mealMonth.reduce((acc, m) => acc + Number(m.calories || 0), 0);
  const longest = trainMonth.length
    ? trainMonth.reduce((max, t) => (Number(t.duration) > Number(max.duration) ? t : max), trainMonth[0])
    : null;
  return {
    countTrainings: trainMonth.length,
    countMeals: mealMonth.length,
    calories,
    longest,
  };
}

// Motivacijske ilustracije (I18N)
const EMPTY_QUOTES_KEYS = [
  "motivational_1",
  "motivational_2",
  "motivational_3",
  "motivational_4",
  "motivational_5",
  "motivational_6"
];

function CalendarPage() {
  const { t, i18n } = useTranslation(); // I18N
  const [trainings, setTrainings] = useLocalStorage("trainings", []);
  const [meals, setMeals] = useLocalStorage("meals", []);
  const [selected, setSelected] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addDate, setAddDate] = useState(null);
  const [viewDate, setViewDate] = useState(new Date()); // za mesečne statistike
const TRAINING_OPTIONS = useMemo(() => [
  { value: "run", label: t("log_run") },
  { value: "gym", label: t("log_gym") },
  { value: "bike", label: t("log_bike") },
  { value: "swim", label: t("log_swim") },
  { value: "other", label: t("log_other") },
], [t]);

const MEAL_OPTIONS = useMemo(() => [
  { value: "breakfast", label: t("log_breakfast") },
  { value: "snack", label: t("log_snack") },
  { value: "lunch", label: t("log_lunch") },
  { value: "dinner", label: t("log_dinner") },
  { value: "other", label: t("log_other_meal") },
], [t]);
  const [formType, setFormType] = useState("trening"); // 'trening' ali 'obrok'
  const [formData, setFormData] = useState({
    type: "",
    duration: "",
    calories: "",
    notes: "",
  });

  // Events for FullCalendar
  const events = useMemo(() => [
    ...trainings.map(t => ({
      id: `t-${t.id}`,
      title: `${ICONS[t.type] || "🏋️"} ${t.type} (${t.duration}min)`,
      start: t.date,
      color: "#38bdf8",
      extendedProps: { ...t, type: t.type, category: "trening" },
    })),
    ...meals.map(m => ({
      id: `m-${m.id}`,
      title: `${ICONS[m.type] || "🍽️"} ${m.type} (${m.calories}kcal)`,
      start: m.date,
      color: "#f472b6",
      extendedProps: { ...m, type: m.type, category: "obrok" },
    })),
  ], [trainings, meals]);

  function handleEventClick(info) {
    setSelected(info.event.extendedProps);
  }

  function handleDateClick(info) {
    setAddDate(info.dateStr);
    setFormType("trening");
    setFormData({
      type: "",
      duration: "",
      calories: "",
      notes: "",
    });
    setShowAddModal(true);
  }

  function handleDatesSet(info) {
    setViewDate(info.start);
  }

  const stats = useMemo(() => calcMonthlyStats(trainings, meals, viewDate), [trainings, meals, viewDate]);
  const isEmptyMonth = stats.countTrainings + stats.countMeals === 0;
  const streak = getStreak(trainings);

  function handleChange(e) {
    setFormData(f => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  }

  function handleAddNew(e) {
    e.preventDefault();
    if (formType === "trening") {
      setTrainings([
        ...trainings,
        {
          id: Date.now(),
          date: addDate,
          type: formData.type,
          duration: formData.duration,
          calories: formData.calories,
          notes: formData.notes,
        },
      ]);
    } else {
      setMeals([
        ...meals,
        {
          id: Date.now(),
          date: addDate,
          type: formData.type,
          calories: formData.calories,
          notes: formData.notes,
        },
      ]);
    }
    setShowAddModal(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2200);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#202533]">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={190} recycle={false} />}
      <div className="flex-1 max-w-5xl mx-auto w-full px-2 py-5 md:px-4 md:py-10">
        <h1 className="text-2xl font-bold text-sky-300 mb-6 text-center">{t("calendar_title")}</h1>
        {/* HERO ICON nad koledarjem */}
        <div className="flex justify-center mb-[-26px]">
          <div className="rounded-full shadow-2xl p-3 bg-gradient-to-br from-sky-400 to-pink-400 animate-bounce">
            <CalendarDays className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
        </div>
        <div className="bg-[#232940]/90 rounded-2xl shadow-2xl border-2 border-sky-400 w-full p-4 md:p-14 mt-3 backdrop-blur-lg transition-all relative">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={i18n.language === "en" ? "en" : "sl"} // I18N
            height="auto"
            contentHeight={window.innerWidth < 600 ? 420 : 600}
            aspectRatio={window.innerWidth < 600 ? 1 : 1.9}
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            dayMaxEvents={3}
            fixedWeekCount={false}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
          />
          {/* Streak badge */}
          {streak > 1 && (
            <div className="absolute top-2 right-4 md:right-8 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-1 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl border-2 border-lime-400 animate-fadeInOut z-40">
              🔥 {t("streak")}: {streak} {t("days")}
            </div>
          )}
        </div>
        {/* Motivacijski banner pod koledarjem, če ni nobenih aktivnosti */}
        {isEmptyMonth && (
          <div className="w-full flex justify-center items-center mt-6">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-[#232940]/90 border border-sky-400 shadow-lg max-w-lg">
              <Flame className="w-9 h-9 text-pink-400 mb-1" />
              <span className="text-sky-100 font-bold text-center">
                {t(EMPTY_QUOTES_KEYS[Math.floor(Math.random() * EMPTY_QUOTES_KEYS.length)])}
              </span>
              <span className="mt-2 text-sm text-sky-400">
                {t("motivational_banner")}
              </span>
            </div>
          </div>
        )}
        {/* Povzetek meseca */}
        <div className="w-full max-w-3xl mx-auto mt-8 px-2">
          <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
            <SummaryCard
              title={t("month_trainings")}
              value={stats.countTrainings}
              type="trening"
            />
            <SummaryCard
              title={t("month_meals")}
              value={stats.countMeals}
              type="obrok"
            />
            <SummaryCard
              title={t("month_calories")}
              value={stats.calories}
              type="kalorije"
            />
            <SummaryCard
              title={t("longest_training")}
              value={stats.longest ? `${stats.longest.duration} min (${stats.longest.type})` : "-"}
              type="najdaljsi"
            />
          </div>
        </div>
      </div>

      {/* Modal za podrobnosti */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[#232940] border-2 border-sky-400 rounded-2xl px-8 py-7 shadow-2xl min-w-[300px] max-w-[90vw]"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg text-sky-300 font-bold mb-3 text-center">
              {selected.category === "trening"
                ? t("details_training")
                : t("details_meal")}
            </h2>
            <div className="text-xl mb-2 text-center">
              {ICONS[selected.type] || "🏋️"} <b>{selected.type}</b>
            </div>
            <div className="text-sm text-gray-300 mb-2 text-center">
              {selected.date}
            </div>
            <div className="mb-2 text-center">
              {selected.category === "trening" ? (
                <>
                  <span className="block text-lime-300">
                    {t("duration_short")}: <b>{selected.duration}</b> min
                  </span>
                  <span className="block text-pink-300">
                    {t("calories_short")}: <b>{selected.calories}</b>
                  </span>
                  {selected.notes && (
                    <div className="text-gray-400 italic mt-1">{selected.notes}</div>
                  )}
                </>
              ) : (
                <>
                  <span className="block text-pink-300">
                    {t("calories_short")}: <b>{selected.calories}</b>
                  </span>
                  {selected.notes && (
                    <div className="text-gray-400 italic mt-1">{selected.notes}</div>
                  )}
                </>
              )}
            </div>
            <button
              className="mt-4 px-5 py-2 rounded-xl bg-sky-400 text-white font-bold hover:bg-sky-500 transition w-full"
              onClick={() => setSelected(null)}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}

      {/* Modal za hiter vnos aktivnosti */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowAddModal(false)}>
          <form
            className="bg-[#232940] border-2 border-sky-400 rounded-2xl px-8 py-7 shadow-2xl min-w-[320px] max-w-[90vw] animate-fadeInOut"
            onClick={e => e.stopPropagation()}
            onSubmit={handleAddNew}
          >
            <h2 className="text-lg text-sky-300 font-bold mb-3 text-center">
              {t("add_activity")}
            </h2>
            <div className="flex justify-center gap-4 mb-5">
              <button type="button" className={`px-4 py-1 rounded-xl font-bold border-2 transition ${formType === "trening" ? "bg-sky-400 text-white border-sky-400" : "bg-transparent border-gray-500 text-gray-300"}`} onClick={() => setFormType("trening")}>
                {t("training")}
              </button>
              <button type="button" className={`px-4 py-1 rounded-xl font-bold border-2 transition ${formType === "obrok" ? "bg-pink-400 text-white border-pink-400" : "bg-transparent border-gray-500 text-gray-300"}`} onClick={() => setFormType("obrok")}>
                {t("meal")}
              </button>
            </div>
            <input type="hidden" name="date" value={addDate} />
            <div className="mb-2">
              <label className="block text-gray-200 text-sm font-bold mb-1">
                {formType === "trening" ? t("type_training") : t("type_meal")}
              </label>
              <select
                name="type"
                required
                className={`w-full rounded-lg px-3 py-2 bg-[#232940] border
                  ${formType === "trening" ? "border-sky-400 focus:ring-sky-300" : "border-pink-400 focus:ring-pink-300"}
                  text-sky-100 focus:outline-none focus:ring-2`}
                value={formData.type}
                onChange={handleChange}
              >
                <option value="">{t("choose")}</option>
                {(formType === "trening" ? TRAINING_OPTIONS : MEAL_OPTIONS).map(opt => (
                 <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {formType === "trening" && (
              <div className="mb-2">
                <label className="block text-gray-200 text-sm font-bold mb-1">
                  {t("duration")}
                </label>
                <input type="number" min="1" name="duration" required className="w-full rounded-lg px-3 py-2 bg-[#232940] border border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-300 text-lime-200" placeholder={t("duration")} value={formData.duration} onChange={handleChange} />
              </div>
            )}
            <div className="mb-2">
              <label className="block text-gray-200 text-sm font-bold mb-1">
                {t("calories")}
              </label>
              <input type="number" min="1" name="calories" required className="w-full rounded-lg px-3 py-2 bg-[#232940] border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-200" placeholder={t("calories")} value={formData.calories} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label className="block text-gray-200 text-sm font-bold mb-1">
                {t("notes")}
              </label>
              <textarea name="notes" rows={2} className="w-full rounded-lg px-3 py-2 bg-[#232940] border border-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-300 text-sky-100" placeholder={t("notes")} value={formData.notes} onChange={handleChange} />
            </div>
            <button type="submit" className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-pink-400 text-white font-bold hover:scale-105 hover:shadow-xl transition w-full">
              {t("save_activity")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Kartice eventov – enoten izgled + tooltip
function renderEventContent(eventInfo) {
  const data = eventInfo.event.extendedProps;
  const isTraining = data.category === "trening";
  return (
    <Tippy
      content={
        <div>
          <b>{data.type}</b><br />
          {isTraining && <>Trajanje: {data.duration} min<br /></>}
          Kalorije: {data.calories}<br />
          {data.notes && <i>{data.notes}</i>}
        </div>
      }
      arrow={true}
      delay={100}
      placement="bottom"
      theme="light"
    >
      <div
        className={`rounded-xl px-3 py-2 shadow hover:scale-105 hover:shadow-xl transition cursor-pointer border-2
        ${isTraining ? "border-sky-400 bg-[#233049]/80" : "border-pink-400 bg-[#291e2f]/80"}
        flex flex-col gap-1`}
        style={{ minWidth: 100, maxWidth: 140 }}
      >
        <div className={`font-bold ${isTraining ? "text-sky-300" : "text-pink-300"}`}>
          {ICONS[data.type] || (isTraining ? "🏋️" : "🍽️")} {data.type}
        </div>
        {isTraining && (
          <div className="text-lime-300 text-xs font-semibold">
            Trajanje: {data.duration} min
          </div>
        )}
        <div className="text-pink-300 text-xs font-semibold">
          Kalorije: {data.calories}
        </div>
        {data.notes && (
          <div className="text-gray-400 text-xs italic">{data.notes}</div>
        )}
      </div>
    </Tippy>
  );
}

export default CalendarPage;
