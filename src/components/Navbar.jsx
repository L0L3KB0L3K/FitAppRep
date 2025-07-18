import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * FancyLink – univerzalna navigacijska povezava z barvami, underline efektom,
 * možnostjo prikaza, če je aktivna (npr. bold, ikona, underline)
 */
function FancyLink({ to, color, active, children, ...props }) {
  const colorClass = {
    fuchsia: "text-fuchsia-400 hover:text-fuchsia-300",
    lime: "text-lime-400 hover:text-lime-300",
    sky: "text-sky-400 hover:text-cyan-300",
    green: "text-green-400 hover:text-lime-300",
    pink: "text-pink-400 hover:text-pink-300",
  }[color] || "text-white";

  // underline: če je aktivno, je vedno 100%, če ni pa na hover animira
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

/**
 * Navbar – glavni navigacijski meni aplikacije
 * Logo vodi na Home (/), Home ni več med gumbi.
 */
function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Helper: preveri ali je trenutna pot aktivna
  const isActive = (path) => location.pathname.startsWith(path);

  // Navigacijske poti in barve (brez Home)
  const navLinks = [
    { to: "/dashboard", label: "Dashboard", color: "lime" },
    { to: "/log", label: "Log", color: "sky" },
    { to: "/calendar", label: "Koledar", color: "green" },
    { to: "/settings", label: "Nastavitve", color: "pink" },
  ];

  return (
    <nav
      className="w-full bg-[#202533]/95 border-b border-gray-800/80 shadow-xl z-50 backdrop-blur-lg"
      aria-label="Glavna navigacija"
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo z animacijo in aria-label */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-widest text-sky-400 flex items-center select-none transition-transform duration-200 hover:scale-105 hover:drop-shadow-lg"
          aria-label="Domov - FitApp"
          title="Domov"
        >
          <span className="mr-2">FitApp</span>
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
        {/* Hamburger meni za mobilne naprave */}
        <button
          className="md:hidden text-sky-200 text-3xl focus:outline-none transition-transform duration-300 hover:scale-110"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Zapri meni" : "Odpri meni"}
          title={open ? "Zapri meni" : "Odpri meni"}
        >
          <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>
            {open ? "✖" : "☰"}
          </span>
        </button>
      </div>
      {/* Mobilni meni (glassmorphism, barvni linki, animacija) */}
      <div
        className={`
          md:hidden transition-all duration-300 ease
          ${open ? "h-56 opacity-100 visible" : "h-0 opacity-0 invisible"}
          overflow-hidden
        `}
        style={{
          zIndex: 49,
        }}
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
