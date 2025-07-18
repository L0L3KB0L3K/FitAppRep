import { useState } from "react";
import { useUserSettings } from "../context/UserSettingsContext";
import {
  Bell, Flame, Trash2, LogOut, ArrowRight
} from "lucide-react";
import CustomUndoAlert from "../components/CustomUndoAlert";
import ConfirmModal from "../components/ConfirmModal";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function Settings() {
  const { t } = useTranslation();
  const { settings, updateSettings, resetSettings, loading } = useUserSettings();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center text-gray-400 py-8">{t("loading")}</div>;
  }

  function handleReminderToggle() {
    updateSettings({ dailyReminders: !settings.dailyReminders });
  }
  function handleStreakToggle() {
    updateSettings({ showStreakBadge: !settings.showStreakBadge });
  }
  function handleReset() {
    setShowResetModal(false);
    resetSettings();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
  }
  function handleLogout() {
    localStorage.clear();
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(30);
    navigate("/");
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto w-full py-7 min-h-screen flex flex-col items-center bg-[#202533]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-black text-pink-400 mb-2 drop-shadow text-center">{t("settings")}</h1>
      <div className="text-center text-gray-300 mb-6 text-base max-w-xl">{t("settings_motivation")}</div>

      <CustomUndoAlert
        show={showSuccess}
        message={t("settings_saved")}
        onClose={() => setShowSuccess(false)}
        color="green"
        duration={1000}
        undo={false}
      />

      <ConfirmModal
        open={showResetModal}
        title={t("reset_confirm")}
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
        confirmText={t("confirm")}
        cancelText={t("cancel")}
      />

      {/* --- Link na profil --- */}
      <section className="w-full mb-7 bg-[#232940]/85 rounded-2xl shadow-lg border-2 border-sky-400 p-6 flex items-center justify-between animate-fadeInOut">
        <div>
          <div className="font-bold text-lg text-sky-300 mb-1">{t("profile")}</div>
          <div className="text-gray-400 text-sm">{t("settings_profile_info")}</div>
        </div>
        <Link
          to="/profile"
          className="flex items-center gap-2 bg-gradient-to-r from-sky-400 to-pink-400 text-white font-bold py-2 px-5 rounded-xl shadow-md transition-all duration-150 hover:scale-105 hover:ring-2 hover:ring-pink-300 hover:shadow-lg active:scale-95"
        >
          {t("profile")} <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* --- Ostali toggli --- */}
      <section className="w-full mb-7 bg-[#232940]/85 rounded-2xl shadow-lg border-2 border-pink-400 p-6 flex flex-col gap-4 animate-fadeInOut">
        <div className="font-bold text-lg text-pink-300 mb-1">{t("additional_settings")}</div>
        <div className="flex items-center gap-6 flex-wrap">
          {/* Daily reminder toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.dailyReminders}
              onChange={handleReminderToggle}
              className="form-checkbox h-5 w-5 text-sky-500 rounded transition"
            />
            <Bell className="w-5 h-5 text-sky-200" />
            <span className="font-semibold text-sky-200">{t("daily_reminders")}</span>
          </label>
          {/* Show streak badge toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.showStreakBadge}
              onChange={handleStreakToggle}
              className="form-checkbox h-5 w-5 text-lime-500 rounded transition"
            />
            <Flame className="w-5 h-5 text-lime-400" />
            <span className="font-semibold text-lime-200">{t("streak_badge")}</span>
          </label>
        </div>
      </section>

      {/* --- Reset + Podatki + Logout --- */}
      <section className="w-full mb-7 bg-[#24293d]/90 rounded-2xl shadow-lg border-2 border-lime-400 p-6 flex flex-col gap-3 animate-fadeInOut">
        <div className="font-bold text-lg text-lime-300 mb-1">{t("security_and_data")}</div>
        <div className="flex gap-4">
          <Tippy content={t("reset_all")}>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 bg-gray-900 text-red-300 border border-red-400 hover:bg-red-500/20 hover:text-white font-bold py-2 px-5 rounded-xl shadow transition-all duration-150 w-max"
            >
              <Trash2 className="w-5 h-5" /> {t("reset_all")}
            </button>
          </Tippy>
          <Tippy content={t("logout")}>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-900 text-pink-300 border border-pink-400 hover:bg-pink-600/20 hover:text-white font-bold py-2 px-5 rounded-xl shadow transition-all duration-150 w-max"
            >
              <LogOut className="w-5 h-5" /> {t("logout")}
            </button>
          </Tippy>
        </div>
        <div className="text-xs text-gray-400 mt-1">{t("data_note")}</div>
      </section>

      {/* --- Podpora in povratne informacije --- */}
      <section className="w-full mb-8 bg-[#232940]/85 rounded-2xl shadow-lg border-2 border-fuchsia-400 p-6 flex flex-col gap-3 items-start animate-fadeInOut">
        <div className="font-bold text-lg text-fuchsia-300 mb-1">{t("support")}</div>
        <a
          href="https://github.com/L0L3KB0L3K/FitAppRep"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sky-300 hover:underline hover:scale-105 transition"
        >
          {/* UserCircle2 ali tvoja GitHub ikona */}
          {t("github_project")}
        </a>
        <a
          href="mailto:moj.mail@example.com?subject=FitApp%20Feedback"
          className="flex items-center gap-2 text-pink-300 hover:underline hover:scale-105 transition"
        >
          {/* Email icon */}
          {t("send_email")}
        </a>
        <span className="text-xs text-gray-400">
          {t("feedback_note")}
        </span>
      </section>
    </motion.div>
  );
}

export default Settings;
