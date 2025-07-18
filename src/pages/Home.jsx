import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import Footer from "../components/Footer";
import { Flame, Dumbbell, Leaf } from "lucide-react";

// Prevodni ključi za motivacijske citate
const QUOTE_KEYS = [
  "quote_1", "quote_2", "quote_3", "quote_4", "quote_5", "quote_6",
  "quote_7", "quote_8", "quote_9", "quote_10", "quote_11",
  "quote_12", "quote_13", "quote_14", "quote_15", "quote_16"
];

function calcAchievements(trainings, meals) {
  const longest = trainings.length
    ? trainings.reduce((max, t) => (Number(t.duration) > Number(max.duration) ? t : max), trainings[0])
    : null;
  const mostBurned = trainings.length
    ? trainings.reduce((max, t) => (Number(t.calories) > Number(max.calories) ? t : max), trainings[0])
    : null;
  let dayCalories = {};
  meals.forEach((m) => {
    if (!m.date) return;
    dayCalories[m.date] = (dayCalories[m.date] || 0) + Number(m.calories || 0);
  });
  const maxDay = Object.entries(dayCalories).sort((a, b) => b[1] - a[1])[0];
  let dayTrainings = {};
  trainings.forEach((t) => {
    if (!t.date) return;
    dayTrainings[t.date] = (dayTrainings[t.date] || 0) + 1;
  });
  const maxTrDay = Object.entries(dayTrainings).sort((a, b) => b[1] - a[1])[0];

  return {
    longest,
    mostBurned,
    maxDay, // [date, calories]
    maxTrDay, // [date, count]
  };
}

function getRandomQuote(t) {
  const idx = Math.floor(Math.random() * QUOTE_KEYS.length);
  return t(QUOTE_KEYS[idx]);
}

function Home() {
  const { t } = useTranslation();

  // Podatki za povzetek/dosežke
  const [trainings] = useLocalStorage("trainings", []);
  const [meals] = useLocalStorage("meals", []);

  // Motivacijski citat
  const quote = useMemo(() => getRandomQuote(t), [t]);

  // Povzetek: št. treningov, obrokov, streak
  const trainingsCount = trainings.length;
  const mealsCount = meals.length;

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
  const trainingStreak = getStreak(trainings);
  const mealStreak = getStreak(meals);

  // Največji dosežki
  const achievements = useMemo(() => calcAchievements(trainings, meals), [trainings, meals]);

  // Personalizacija (ime uporabnika) - če želiš
  let name = ""; // Lahko dodaš iz localStorage ali profila

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-tr from-[#202533] to-[#2e3757]">
      <div className="max-w-3xl mx-auto w-full px-4 flex-1 flex flex-col justify-center items-center pt-14 pb-6">
        {/* GLASS KARTICA */}
        <div className="bg-[#22283a]/80 rounded-3xl shadow-2xl px-8 py-12 flex flex-col items-center relative backdrop-blur-xl border-2 border-sky-500 w-full">
          {/* Hero ikona */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
            <div className="rounded-full shadow-2xl p-3 bg-gradient-to-br from-sky-400 to-pink-400 animate-bounce">
              <Dumbbell className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
          </div>
          {/* Pozdrav */}
          <h1 className="mt-8 text-3xl md:text-4xl font-black text-sky-300 text-center drop-shadow mb-3">
            {name
              ? t("home_welcome_back", { name })
              : t("home_welcome")}
          </h1>
          {/* Opis aplikacije */}
          <p className="text-lg text-sky-100 mb-4 text-center font-medium">
            {t("home_description")}
          </p>
          {/* Motivacijski citat */}
          <div className="flex items-center gap-3 text-lg italic text-lime-300 font-bold mb-7 text-center animate-fadeIn">
            <Flame className="w-6 h-6 text-pink-400" />
            <span>{quote}</span>
            <Leaf className="w-6 h-6 text-green-300" />
          </div>

          {/* Povzetek – kartice */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full mb-7">
            <div className="bg-[#232940]/90 rounded-xl px-4 py-5 shadow border-2 border-sky-300 flex flex-col items-center transition hover:scale-105">
              <div className="text-lg text-sky-300 font-bold">{t("dashboard_trainings")}</div>
              <div className="text-2xl text-lime-300 font-black">{trainingsCount}</div>
            </div>
            <div className="bg-[#232940]/90 rounded-xl px-4 py-5 shadow border-2 border-pink-300 flex flex-col items-center transition hover:scale-105">
              <div className="text-lg text-pink-300 font-bold">{t("dashboard_meals")}</div>
              <div className="text-2xl text-sky-300 font-black">{mealsCount}</div>
            </div>
            <div className="bg-[#232940]/90 rounded-xl px-4 py-5 shadow border-2 border-green-300 flex flex-col items-center transition hover:scale-105">
              <div className="text-base text-green-200 font-bold">{t("dashboard_training_streak")}</div>
              <div className="text-lg text-lime-300 font-bold">{trainingStreak} {t("days_short")}</div>
            </div>
            <div className="bg-[#232940]/90 rounded-xl px-4 py-5 shadow border-2 border-green-300 flex flex-col items-center transition hover:scale-105">
              <div className="text-base text-green-200 font-bold">{t("dashboard_meal_streak")}</div>
              <div className="text-lg text-lime-300 font-bold">{mealStreak} {t("days_short")}</div>
            </div>
          </div>

          {/* Tabela največjih dosežkov */}
          <div className="w-full bg-[#24293d]/90 border border-sky-800 rounded-xl shadow px-6 py-5 mb-7">
            <h2 className="text-base text-lime-300 font-bold mb-2 text-center">{t("home_achievements_title")}</h2>
            <table className="w-full text-sm text-sky-100 text-center">
              <tbody>
                <tr>
                  <td className="font-semibold text-sky-300 py-2">{t("home_longest_training")}</td>
                  <td>
                    {achievements.longest
                      ? `${achievements.longest.duration} ${t("duration_short")} (${achievements.longest.type}, ${achievements.longest.date})`
                      : "–"}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-pink-300 py-2">{t("home_most_calories_training")}</td>
                  <td>
                    {achievements.mostBurned
                      ? `${achievements.mostBurned.calories} kcal (${achievements.mostBurned.type}, ${achievements.mostBurned.date})`
                      : "–"}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-green-300 py-2">{t("home_most_calories_day")}</td>
                  <td>
                    {achievements.maxDay
                      ? `${achievements.maxDay[1]} kcal (${achievements.maxDay[0]})`
                      : "–"}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold text-yellow-300 py-2">{t("home_most_active_day")}</td>
                  <td>
                    {achievements.maxTrDay
                      ? `${achievements.maxTrDay[1]} ${t("dashboard_trainings").toLowerCase()} (${achievements.maxTrDay[0]})`
                      : "–"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CTA gumb */}
          <Link
            to="/dashboard"
            className="mt-3 bg-gradient-to-r from-sky-400 to-pink-400 text-white text-lg font-extrabold px-7 py-3 rounded-2xl shadow-lg transition hover:scale-105 hover:shadow-xl focus:ring-4 focus:ring-pink-300"
          >
            {t("home_cta_dashboard")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
