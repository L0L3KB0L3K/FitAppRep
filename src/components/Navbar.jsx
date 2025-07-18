import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Jezikovni toggle z zastavicama
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

// FancyLink z i18n prevodom
function FancyLink({ to, color, active, children, ...props }) {
  const colorClass = {
    fuchsia: "text-fuchsia-400 hover:text-fuchsia-300",
    lime: "text-lime-400 hover:text-lime-300",
    sky: "text-sky-400 hover:text-cyan-300",
    green: "text-green-400 hover:text-lime-300",
    pink: "text-pink-400 hover:text-pink-300",
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
  const { t } = useTranslation();

  const isActive = (path) => location.pathname.startsWith(path);

  // Navigacijske poti in barve
  const navLinks = [
    { to: "/dashboard", label: t("dashboard"), color: "lime" },
    { to: "/log", label: t("log"), color: "sky" },
    { to: "/calendar", label: t("calendar"), color: "green" },
    { to: "/settings", label: t("settings"), color: "pink" },
  ];

  return (
    <nav
      className="w-full bg-[#202533]/95 border-b border-gray-800/80 shadow-xl z-50 backdrop-blur-lg"
      aria-label="Glavna navigacija"
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-widest text-sky-400 flex items-center select-none transition-transform duration-200 hover:scale-105 hover:drop-shadow-lg"
          aria-label={t("home")}
          title={t("home")}
        >
          <span className="mr-2">{t("app_name")}</span>
          <span
            className="w-4 h-4 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-400 ml-1 animate-pulse shadow-xl"
            aria-hidden="true"
          />
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
          ${open ? "h-56 opacity-100 visible" : "h-0 opacity-0 invisible"}
          overflow-hidden
        `}
        style={{ zIndex: 49 }}
      >
        <div
          className="
            bg-[#232940]/95 backdrop-blur-lg border-b border-gray-700/40
            px-6 py-6 flex flex-col space-y-4 font-bold text-lg
            shadow-2xl animate-fadeIn rounded-b-2xl
          "
          aria-label="Mobilni meni"
        >
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
          {/* Jezikovni toggle za mobilnike */}
          <div className="flex justify-center pt-2">
            <LangToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
