// src/App.jsx
import "./i18n"; // Pomembno, da se inicializira!
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserSettingsProvider } from "./context/UserSettingsContext";

import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Log from "./pages/Log";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import "./index.css";

/**
 * Root aplikacije – UserSettingsProvider ovije cel app,
 * da imaš dostop do nastavitev kjerkoli.
 */
function App() {
  return (
    <UserSettingsProvider>
      <Router>
        {/* Fiksiran navbar */}
        <Navbar />
        <Toaster position="top-center" />
        {/* Glavna vsebina strani */}
        <div className="bg-gray-900 min-h-screen px-2 pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/log" element={<Log />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<div className="text-white text-center mt-10">404 - Stran ni najdena</div>} />
          </Routes>
        </div>
        {/* Barvna gradient linija pod vsebino */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #38bdf8, #a3e635, #f472b6, #818cf8)',
          borderRadius: '4px 4px 0 0',
          marginTop: '-8px'
        }}/>
        <Footer />
      </Router>
    </UserSettingsProvider>
  );
}

export default App;
