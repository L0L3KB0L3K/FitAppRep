import { useState } from "react";
import { Link } from "react-router-dom";

// Custom link z "brand" barvami, subtilen hover underline
function FancyLink({ to, color, children, ...props }) {
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
        before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5
        before:bg-current before:transition-all before:duration-200
        hover:before:w-full
      `}
      style={{ display: "inline-block" }}
    >
      {children}
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-[#202533]/95 border-b border-gray-800/80 shadow-xl z-50 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <span className="text-2xl font-extrabold tracking-widest text-sky-400 flex items-center select-none">
          FitApp
        </span>
        {/* Desktop meni */}
        <div className="hidden md:flex space-x-7 font-medium">
          <FancyLink to="/dashboard" color="lime">Dashboard</FancyLink>
          <FancyLink to="/log" color="sky">Log</FancyLink>
          <FancyLink to="/calendar" color="green">Koledar</FancyLink>
          <FancyLink to="/settings" color="pink">Nastavitve</FancyLink>
        </div>
        {/* Hamburger meni */}
        <button
          className="md:hidden text-sky-200 text-3xl focus:outline-none transition-transform duration-300"
          onClick={() => setOpen(!open)}
          aria-label="Meni"
        >
          <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>
            {open ? "✖" : "☰"}
          </span>
        </button>
      </div>
      {/* Mobile meni - temen glassmorphism + barvni linki */}
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
        >
          <Link to="/dashboard" className="text-lime-300 hover:text-fuchsia-400 transition" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/log" className="text-sky-300 hover:text-cyan-400 transition" onClick={() => setOpen(false)}>Log</Link>
          <Link to="/calendar" className="text-green-300 hover:text-lime-300 transition" onClick={() => setOpen(false)}>Koledar</Link>
          <Link to="/settings" className="text-pink-300 hover:text-fuchsia-400 transition" onClick={() => setOpen(false)}>Nastavitve</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
