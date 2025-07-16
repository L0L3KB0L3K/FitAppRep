import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
// Uvozi nove strani (komponente)
import Dashboard from "./pages/Dashboard";
import Log from "./pages/Log";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import "./index.css";

function App() {
  return (
    <Router>
      {/* Fiksiran navbar */}
      <Navbar />
      <Toaster position="top-center" />
      {/* Glavna vsebina strani */}
      <div className="bg-gray-900 min-h-screen px-2 pt-4">
        <Routes>
          {/* Nastavi, katera komponenta naj se prikaže na določeni poti */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/log" element={<Log />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
