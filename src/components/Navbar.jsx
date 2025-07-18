import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tippy from "@tippyjs/react";
import { LogOut, User } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";

// Avatarji – isti array kot v Profile.jsx!
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

// Jezikovni toggle
function LangToggle({ className = "" }) {
  const { i18n } = useTranslation();
  const isSl = i18n.language === "sl";
  function toggleLang() {
    i18n.changeLanguage(isSl ? "en" : "sl");
  }
  return (
    <button
      onClick={toggleLang}
      className={
        "group flex items-center px-2 py-1 rounded-full border-2 border-pink-400 bg-[#232940] shadow transition select-none " +
        className
      }
      aria-label={isSl ? "Slovenščina" : "English"}
      title={isSl ? "Slovenščina" : "English"}
      tabIndex={0}
    >
      <span
        className={`text-2xl mr-1 transition-all ${
          isSl
            ? "drop-shadow-[0_0_8px_#38bdf8] scale-110"
            : "opacity-60"
        }`}
      >
        🇸🇮
      </span>
      <span
        className={`text-2xl ml-1 transition-all ${
          !isSl
            ? "drop-shadow-[0_0_8px_#fde047] scale-110"
            : "opacity-60"
        }`}
      >
        🇬🇧
      </span>
    </button>
  );
}

// FancyLink
function FancyLink({ to, color, active, children, ...props }) {
  const colorClass = {
    fuchsia: "text-fuchsia-400 hover:text-fuchsia-300",
    lime: "text-lime-300 hover:text-lime-200",
    sky: "text-sky-300 hover:text-cyan-300",
    green: "text-green-300 hover:text-lime-300",
    pink: "text-pink-300 hover:text-fuchsia-400",
  }[color] || "text-white";
  return (
    <Link
      to={to}
      {...props}
      className={`
        font-bold px-2 relative transition duration-200
        ${colorClass}
        before:absolute before:-bottom-1 before:left-0
        before:h-0.5 before:bg-current before:rounded-full
        ${active
          ? "before:w-full before:opacity-100"
          : "before:w-0 before:opacity-0 hover:before:w-full hover:before:opacity-100"
        }
        before:transition-all before:duration-300
      `}
      aria-current={active ? "page" : undefined}
      style={{ display: "inline-block" }}
      title={children}
    >
      {children}
      {active && (
        <span className="inline-block ml-1 align-middle text-xs text-sky-300" aria-hidden="true">
          ●
        </span>
      )}
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profile] = useLocalStorage("profile", {
    name: "",
    avatarIndex: 0,
    customAvatar: ""
  });

  const isActive = (path) => location.pathname.startsWith(path);

  // Navigacijske poti in barve – brez “profile”!
  const navLinks = [
    { to: "/dashboard", label: t("dashboard"), color: "lime" },
    { to: "/log", label: t("log"), color: "sky" },
    { to: "/calendar", label: t("calendar"), color: "green" },
    { to: "/settings", label: t("settings"), color: "pink" }
  ];

  // LOGOUT funkcija – preprosto pobrišeš vse iz localStorage ali kar potrebuješ
  function handleLogout() {
    localStorage.clear();
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(30);
    navigate("/");
  }

  // Avatar logic
  let avatarSrc = profile.customAvatar
    ? profile.customAvatar
    : (profile.avatarIndex >= 0 && AVATARS[profile.avatarIndex]) || AVATARS[0];
  let displayName = profile.name || t("profile_name");

  return (
    <nav
      className="w-full bg-[#202533]/95 border-b border-gray-800/80 shadow-xl z-50 backdrop-blur-lg"
      aria-label="Glavna navigacija"
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center select-none transition-transform duration-200 hover:scale-105 hover:drop-shadow-lg"
          aria-label="Domov"
          title="Domov"
        >
          <img src="src\assets\icon.png" alt="FitApp" className="w-20 h-20 mr-2" />
          {/* ali .w-12 h-12 če ti je to preveliko */}
        </Link>

        {/* Desktop meni */}
        <div className="hidden md:flex space-x-7 font-medium">
          {navLinks.map((link) => (
            <FancyLink
              key={link.to}
              to={link.to}
              color={link.color}
              active={isActive(link.to)}
            >
              {link.label}
            </FancyLink>
          ))}
        </div>
        {/* Language toggle */}
        <div className="hidden md:flex items-center ml-6">
          <LangToggle />
        </div>
        {/* User info + logout */}
        <div className="hidden md:flex items-center gap-3 ml-4">
          {/* Avatar & ime */}
          <Tippy content={t("profile")}>
            <Link
              to="/profile"
              className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-sky-900/50 transition focus:ring-2 focus:ring-sky-400"
            >
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-9 h-9 rounded-full border-2 border-sky-400 shadow object-cover bg-white transition-transform duration-150 hover:scale-105"
              />
              <span className="text-sky-200 font-bold text-base">{displayName}</span>
            </Link>
          </Tippy>
          {/* Logout gumb */}
          <Tippy content={t("logout")}>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-pink-600 text-pink-300 hover:text-white rounded-full px-3 py-2 flex items-center gap-2 focus:ring-2 focus:ring-pink-400 shadow transition"
              aria-label={t("logout")}
              tabIndex={0}
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline font-bold">{t("logout")}</span>
            </button>
          </Tippy>
        </div>
        {/* Hamburger meni za mobilne naprave */}
        <button
          className="md:hidden text-sky-200 text-3xl focus:outline-none transition-transform duration-300 hover:scale-110"
          onClick={() => setOpen(!open)}
          aria-label={open ? t("close_menu") : t("open_menu")}
          title={open ? t("close_menu") : t("open_menu")}
        >
          <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>
            {open ? "✖" : "☰"}
          </span>
        </button>
      </div>
      {/* Mobilni meni */}
      <div
        className={`
          md:hidden transition-all duration-300 ease
          ${open ? "h-[350px] opacity-100 visible" : "h-0 opacity-0 invisible"}
          overflow-hidden
        `}
        style={{ zIndex: 49 }}
      >
        <div
          className="
            bg-[#232940]/95 backdrop-blur-lg border-b border-gray-700/40
            px-6 py-6 flex flex-col font-bold text-lg
            shadow-2xl animate-fadeIn rounded-b-2xl
          "
          aria-label="Mobilni meni"
        >
          {/* NAV linki */}
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`transition font-bold ${
                  link.color === "lime"
                    ? "text-lime-300 hover:text-fuchsia-400"
                    : link.color === "sky"
                    ? "text-sky-300 hover:text-cyan-400"
                    : link.color === "green"
                    ? "text-green-300 hover:text-lime-300"
                    : "text-pink-300 hover:text-fuchsia-400"
                } ${isActive(link.to) ? "underline scale-105" : ""}`}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.to) ? "page" : undefined}
                title={link.label}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="inline-block ml-2 text-xs text-sky-200">●</span>
                )}
              </Link>
            ))}
          </div>
          {/* PROFI vrstica: profil | jezik | logout */}
          <div className="flex items-center justify-between gap-2 mt-6 mb-2">
            {/* Profil levo */}
            <Link
              to="/profile"
              className="flex items-center gap-2 px-1 py-1 rounded-xl hover:bg-sky-900/50 transition focus:ring-2 focus:ring-sky-400"
              onClick={() => setOpen(false)}
            >
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-sky-400 object-cover bg-white"
              />
              <span className="text-sky-200 font-bold text-base">{displayName}</span>
            </Link>
            {/* Jezik sredina */}
            <div className="flex-1 flex justify-center">
              <LangToggle />
            </div>
            {/* Logout desno */}
            <Tippy content={t("logout")}>
              <button
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-pink-600 text-pink-300 hover:text-white rounded-full p-3 flex items-center focus:ring-2 focus:ring-pink-400 shadow transition"
                aria-label={t("logout")}
                tabIndex={0}
              >
                <LogOut className="w-6 h-6" />
              </button>
            </Tippy>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
