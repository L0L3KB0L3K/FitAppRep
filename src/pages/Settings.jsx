// src/pages/Settings.jsx

import { useState } from "react";
import { useUserSettings } from "../context/UserSettingsContext";
import { UserCircle2, Image, Pencil, Check, X, Trash2, Sun, Moon, Bell, Flame } from "lucide-react";
import CustomUndoAlert from "../components/CustomUndoAlert";
import ConfirmModal from "../components/ConfirmModal";

/**
 * Napredna Settings stran – konsistenten design, best UX, instant toggli, edit mode, pripravljeno za Firebase.
 */
function Settings() {
  const { settings, updateSettings, resetSettings, loading } = useUserSettings();
  const [edit, setEdit] = useState(!settings.displayName);
  const [name, setName] = useState(settings.displayName || "");
  const [avatar, setAvatar] = useState(settings.avatar || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Nalaganje ...</div>;
  }

  const avatarOptions = [
    "🧑‍💻", "🏋️", "🚴", "🏃", "👩‍💼", "🐱", "🐶", "⚽", "🍕", "🥦"
  ];

  function handleSave(e) {
    e.preventDefault();
    updateSettings({ displayName: name.trim(), avatar });
    setShowSuccess(true);
    setEdit(false);
    setTimeout(() => setShowSuccess(false), 1200);
  }
  function handleCancel() {
    setName(settings.displayName || "");
    setAvatar(settings.avatar || "");
    setEdit(false);
  }
  function handleThemeToggle() {
    updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
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

  // ---------- UI ----------
  return (
    <div className="max-w-2xl mx-auto w-full py-7 min-h-screen flex flex-col items-center bg-[#202533]">
      <h1 className="text-3xl font-black text-pink-400 mb-8 drop-shadow text-center">Nastavitve</h1>

      <CustomUndoAlert
        show={showSuccess}
        message="Nastavitve shranjene!"
        onClose={() => setShowSuccess(false)}
        color="green"
        duration={1000}
        undo={false}
      />

      <ConfirmModal
        open={showResetModal}
        title="Ali res želiš popolnoma ponastaviti vse nastavitve?"
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
        confirmText="Ponastavi"
        cancelText="Prekliči"
      />

      {/* --- Profil kartica (edit mode) --- */}
      <section className="w-full mb-7 bg-[#232940]/85 rounded-2xl shadow-lg border-2 border-sky-400 p-6 flex flex-col gap-4 animate-fadeInOut">
        <div className="font-bold text-lg text-sky-300 mb-1">Tvoj profil</div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-1">Avatar</span>
            {edit ? (
              <div className="flex gap-2 mb-1">
                {avatarOptions.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`text-2xl rounded-full p-1 border-2 transition 
                      ${avatar === av ? "border-pink-400 bg-pink-800/20" : "border-gray-600 hover:border-sky-400"}
                      hover:scale-110`}
                    onClick={() => setAvatar(av)}
                    aria-label={`Izberi avatar ${av}`}
                  >{av}</button>
                ))}
                <button
                  type="button"
                  className="rounded-full p-1 border-2 border-gray-600 hover:border-sky-400 text-gray-400 text-2xl flex items-center"
                  title="Dodaj sliko (kmalu)"
                  disabled
                >
                  <Image className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <span className="text-4xl mb-1">
                {avatar || <UserCircle2 className="w-8 h-8 text-gray-500" />}
              </span>
            )}
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sky-300 font-bold" htmlFor="name">
              Ime
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-3 py-2 rounded-xl bg-[#232940] text-white border border-sky-400 focus:ring-2 focus:ring-pink-300 outline-none transition
                ${!edit ? "opacity-70 pointer-events-none select-none" : ""}`}
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={32}
              placeholder="Vpiši svoje ime"
              autoComplete="off"
              readOnly={!edit}
              disabled={!edit}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-3">
          {edit ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-sky-400 to-pink-400 text-white font-bold py-2 px-5 rounded-xl shadow-md transition-all duration-150 hover:scale-105 hover:ring-2 hover:ring-pink-300 hover:shadow-lg active:scale-95"
                disabled={!name.trim()}
              >
                <Check className="w-5 h-5" /> Shrani
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-900 text-gray-400 border border-gray-600 hover:bg-gray-800 hover:text-white font-bold py-2 px-5 rounded-xl shadow transition-all duration-150"
              >
                <X className="w-5 h-5" /> Prekliči
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEdit(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-fuchsia-400 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-150 hover:scale-105 hover:ring-2 hover:ring-pink-300 hover:shadow-lg active:scale-95"
            >
              <Pencil className="w-5 h-5" /> Spremeni ime
            </button>
          )}
        </div>
      </section>

      {/* --- Tema & toggli --- */}
      <section className="w-full mb-7 bg-[#232940]/85 rounded-2xl shadow-lg border-2 border-pink-400 p-6 flex flex-col gap-4 animate-fadeInOut">
        <div className="font-bold text-lg text-pink-300 mb-1">Nastavitve aplikacije</div>
        <div className="flex items-center gap-6 flex-wrap">
          {/* Dark/light theme toggle */}
          <button
            type="button"
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold shadow transition
              ${settings.theme === "dark"
                ? "bg-gray-900 text-sky-300 border border-sky-500 hover:bg-sky-900/30"
                : "bg-white text-pink-400 border border-pink-300 hover:bg-pink-100"}`}
            onClick={handleThemeToggle}
            aria-label="Preklopi temo"
          >
            {settings.theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            {settings.theme === "dark" ? "Temni način" : "Svetli način"}
          </button>
          {/* Daily reminder toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={settings.dailyReminders}
              onChange={handleReminderToggle}
              className="form-checkbox h-5 w-5 text-sky-500 rounded transition"
            />
            <Bell className="w-5 h-5 text bg-sky-200" />
            <span className="font-semibold text-sky-200">Dnevni opomniki</span>
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
            <span className="font-semibold text-lime-200">Streak badge</span>
          </label>
        </div>
      </section>

      {/* --- Reset + Podatki --- */}
      <section className="w-full mb-7 bg-[#24293d]/90 rounded-2xl shadow-lg border-2 border-lime-400 p-6 flex flex-col gap-3 animate-fadeInOut">
        <div className="font-bold text-lg text-lime-300 mb-1">Varnost in podatki</div>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-2 bg-gray-900 text-red-300 border border-red-400 hover:bg-red-500/20 hover:text-white font-bold py-2 px-5 rounded-xl shadow transition-all duration-150 w-max"
        >
          <Trash2 className="w-5 h-5" /> Resetiraj VSE nastavitve
        </button>
        <div className="text-xs text-gray-400 mt-1">
          Podatki o profilu in nastavitvah so shranjeni lokalno.  
          Ko bo aplikacija na Firebase, bodo varno sinhronizirani v oblak.
        </div>
      </section>

      {/* --- Podpora in povratne informacije --- */}
      <section className="w-full mb-8 bg-[#232940]/85 rounded-2xl shadow-lg border-2 border-fuchsia-400 p-6 flex flex-col gap-3 items-start animate-fadeInOut">
        <div className="font-bold text-lg text-fuchsia-300 mb-1">Podpora & povratne informacije</div>
        <a
          href="https://github.com/L0L3KB0L3K/FitAppRep"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sky-300 hover:underline hover:scale-105 transition"
        >
          <UserCircle2 className="w-5 h-5" /> GitHub projekt
        </a>
        <a
          href="mailto:moj.mail@example.com?subject=FitApp%20Feedback"
          className="flex items-center gap-2 text-pink-300 hover:underline hover:scale-105 transition"
        >
          <Image className="w-5 h-5" /> Pošlji email
        </a>
        <span className="text-xs text-gray-400">
          Vesel bom vsake ideje ali prijave napake! (Kontaktiraj me preko GitHub ali emaila.)
        </span>
      </section>
    </div>
  );
}

export default Settings;
