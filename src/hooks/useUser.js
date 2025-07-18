// src/hooks/useUser.js
import { useState } from "react";

// Če boš kasneje preklopil na Firebase, samo tu spremeniš vir podatkov!
const LOCAL_KEY = "user";

export default function useUser() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY)) || { name: "", avatar: "" };
    } catch {
      return { name: "", avatar: "" };
    }
  });

  function updateUser(newData) {
    const updated = { ...user, ...newData };
    setUser(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  }

  function resetUser() {
    setUser({ name: "", avatar: "" });
    localStorage.removeItem(LOCAL_KEY);
  }

  return [user, updateUser, resetUser];
}
