import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import { motion } from "framer-motion";
import { User, Edit, Save, X, Upload as UploadIcon } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import CustomUndoAlert from "../components/CustomUndoAlert";

// Avatarji – import kot array (avatar0, avatar1, ... avatar8)
import avatar0 from "../assets/avataaars(1).svg";
import avatar1 from "../assets/avataaars(2).svg";
import avatar2 from "../assets/avataaars(3).svg";
import avatar3 from "../assets/avataaars(4).svg";
import avatar4 from "../assets/avataaars(5).svg";
import avatar5 from "../assets/avataaars(6).svg";
import avatar6 from "../assets/avataaars(7).svg";
import avatar7 from "../assets/avataaars(8).svg";
import avatar8 from "../assets/avataaars(9).svg";

const AVATARS = [avatar0, avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8];

function Profile() {
  const { t, i18n } = useTranslation();

  // Profile shrani kot objekt z avatarIndex (ali "custom" za svoj upload)
  const [profile, setProfile] = useLocalStorage("profile", {
    name: "",
    email: "",
    about: "",
    avatarIndex: 0,
    customAvatar: "",  // data URL slike, če user upload-a sliko
    language: i18n.language,
  });
  const [form, setForm] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertColor, setAlertColor] = useState("green");
  const [error, setError] = useState({});
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const uploadRef = useRef(null);

  // Char count
  const CHAR_LIMIT = 120;

  // Validacija
  function validate() {
    let e = {};
    if (!form.name) e.name = t("profile_error_name_required");
    if (form.about.length > CHAR_LIMIT) e.about = t("profile_error_about_too_long");
    return e;
  }

  function handleEdit() {
    setEditing(true);
    setForm(profile);
    setError({});
  }
  function handleCancel() {
    setEditing(false);
    setForm(profile);
    setError({});
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError(e => ({ ...e, [name]: "" }));
  }
  function handleAvatarSelect(idx) {
    setForm(f => ({ ...f, avatarIndex: idx, customAvatar: "" }));
    // Haptic feedback za mobile
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(30);
  }
  function handleLangChange(e) {
    setForm(f => ({ ...f, language: e.target.value }));
    i18n.changeLanguage(e.target.value);
  }
  function handleUploadClick() {
    if (uploadRef.current) uploadRef.current.click();
  }
  // Upload slike – shrani kot base64 (za lokalni demo dovolj)
  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setForm(f => ({ ...f, customAvatar: evt.target.result, avatarIndex: -1 }));
      setLoadingAvatar(false);
      setShowAlert(true);
      setAlertMsg(t("profile_upload_success"));
      setAlertColor("green");
      setTimeout(() => setShowAlert(false), 1500);
    };
    reader.onerror = () => {
      setShowAlert(true);
      setAlertMsg(t("profile_upload_error"));
      setAlertColor("red");
      setTimeout(() => setShowAlert(false), 1500);
      setLoadingAvatar(false);
    };
    reader.readAsDataURL(file);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) {
      setError(err);
      return;
    }
    setProfile(form);
    setEditing(false);
    setShowAlert(true);
    setAlertMsg(t("profile_saved"));
    setAlertColor("green");
    setTimeout(() => setShowAlert(false), 1800);
  }

  // Prikaži avatar
  let avatarSrc = form.customAvatar
    ? form.customAvatar
    : (form.avatarIndex >= 0 && AVATARS[form.avatarIndex]) || AVATARS[0];

  // Motivacijski tekst če je profil prazen
  const isProfileEmpty = !profile.name && !profile.about && profile.avatarIndex === 0 && !profile.customAvatar;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-tr from-[#202533] to-[#2e3757] flex flex-col items-center justify-center pt-14 pb-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Alert za uspešno shranjevanje ali error */}
      <CustomUndoAlert
        show={showAlert}
        message={alertMsg}
        onClose={() => setShowAlert(false)}
        color={alertColor}
        duration={1800}
        undo={false}
      />

      <div className="w-full max-w-xl mx-auto bg-[#232940]/85 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-sky-400 p-8 flex flex-col items-center relative">
        <h1 className="text-3xl font-black text-sky-300 mb-5 flex items-center gap-3">
          <User className="w-8 h-8 text-lime-400" />
          {t("profile_title")}
        </h1>

        {/* Motivacijski tekst */}
        {isProfileEmpty && !editing && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-lime-900/30 border border-lime-500 rounded-xl px-4 py-2 mb-4 text-lime-200 text-center text-base shadow"
          >
            {t("profile_empty_motivation")}
          </motion.div>
        )}

        {/* Avatar + izbor */}
        <div className="mb-4 flex flex-col items-center">
          {/* Skeleton loader če bi nalagal remote */}
          <div className="w-24 h-24 rounded-full border-4 border-lime-400 shadow-lg bg-white flex items-center justify-center overflow-hidden relative">
            {loadingAvatar ? (
              <div className="animate-pulse w-full h-full rounded-full bg-slate-300" />
            ) : (
              <img
                src={avatarSrc}
                alt={t("profile_avatar")}
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>
          {/* Avatar izbor */}
          {editing && (
            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              {AVATARS.map((av, idx) => (
                <Tippy key={idx} content={t("profile_avatar_tooltip")}>
                  <button
                    type="button"
                    onClick={() => handleAvatarSelect(idx)}
                    className={`rounded-full border-2 w-11 h-11 p-0.5 transition
                      ${form.avatarIndex === idx && !form.customAvatar
                        ? "border-sky-400 ring-2 ring-sky-300"
                        : "border-gray-500 hover:border-sky-300"}`}
                    style={{ outline: "none" }}
                  >
                    <img src={av} alt={t("profile_avatar") + " " + (idx + 1)} className="w-full h-full rounded-full object-cover" />
                  </button>
                </Tippy>
              ))}
              {/* Upload avatar gumb */}
              <Tippy content={t("profile_upload_tooltip")}>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className={`rounded-full border-2 w-11 h-11 p-0.5 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border-gray-500 hover:border-lime-400 transition`}
                >
                  <UploadIcon className="w-6 h-6 text-lime-400" />
                  <input
                    type="file"
                    ref={uploadRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </button>
              </Tippy>
            </div>
          )}
        </div>

        {/* Profilni podatki */}
        <form onSubmit={handleSubmit} className="w-full mt-2">
          {/* Ime */}
          <div className="mb-4">
            <label className="block text-sky-300 font-bold mb-1">{t("profile_name")}</label>
            <input
              type="text"
              name="name"
              value={form.name}
              disabled={!editing}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-xl bg-[#202533] text-white border 
                ${error.name ? "border-red-400 ring-2 ring-red-300" : "border-sky-900"} focus:border-sky-400`}
              maxLength={32}
              autoComplete="off"
            />
            {error.name && <div className="text-red-400 text-xs font-semibold mt-1 ml-1">{error.name}</div>}
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sky-300 font-bold mb-1">{t("profile_email")}</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full px-4 py-2 rounded-xl bg-[#202533] text-gray-400 border border-sky-900"
              autoComplete="off"
            />
          </div>
          {/* O meni */}
          <div className="mb-4">
            <label className="block text-sky-300 font-bold mb-1">{t("profile_about")}</label>
            <textarea
              name="about"
              value={form.about}
              disabled={!editing}
              onChange={handleChange}
              maxLength={CHAR_LIMIT}
              rows={3}
              placeholder={t("profile_about_placeholder")}
              className={`w-full px-4 py-2 rounded-xl bg-[#202533] text-white border
                ${error.about ? "border-red-400 ring-2 ring-red-300" : "border-sky-900"} focus:border-sky-400`}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-400">{t("profile_char_count", { count: form.about.length })}</span>
              {error.about && <span className="text-red-400 font-semibold">{error.about}</span>}
            </div>
          </div>
          {/* Jezik */}
          <div className="mb-4">
            <label className="block text-sky-300 font-bold mb-1">{t("profile_language")}</label>
            <select
              name="language"
              value={form.language}
              disabled={!editing}
              onChange={handleLangChange}
              className="w-full px-4 py-2 rounded-xl bg-[#202533] text-white border border-sky-900 focus:border-sky-400"
            >
              <option value="sl">Slovenščina</option>
              <option value="en">English</option>
            </select>
          </div>
          {/* Gumbi za shranjevanje / urejanje */}
          <div className="flex gap-4 justify-end mt-6">
            {!editing && (
              <Tippy content={t("profile_edit_tooltip")}>
                <button
                  type="button"
                  className="bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-xl shadow hover:scale-105 focus:ring-2 focus:ring-sky-300 transition-all flex items-center gap-2"
                  onClick={handleEdit}
                >
                  <Edit className="w-5 h-5" />
                  {t("profile_edit")}
                </button>
              </Tippy>
            )}
            {editing && (
              <>
                <Tippy content={t("profile_save_tooltip")}>
                  <button
                    type="submit"
                    className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold py-2 px-6 rounded-xl shadow hover:scale-105 focus:ring-2 focus:ring-lime-300 transition-all flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {t("profile_save")}
                  </button>
                </Tippy>
                <Tippy content={t("profile_cancel_tooltip")}>
                  <button
                    type="button"
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-xl shadow hover:scale-105 focus:ring-2 focus:ring-sky-300 transition-all flex items-center gap-2"
                    onClick={handleCancel}
                  >
                    <X className="w-5 h-5" />
                    {t("profile_cancel")}
                  </button>
                </Tippy>
              </>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Profile;
