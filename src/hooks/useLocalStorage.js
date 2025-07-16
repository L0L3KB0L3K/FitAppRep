import { useState } from "react";

// Custom React hook za delo z localStorage
// Primer uporabe: const [data, setData] = useLocalStorage("imeKljuča", privzetaVrednost)
export default function useLocalStorage(key, initialValue) {
  // Prva vrednost: prebere iz localStorage, ali uporabi privzeto
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Napaka pri branju localStorage:", error);
      return initialValue;
    }
  });

  // Setter shrani v React state in localStorage
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn("Napaka pri shranjevanju v localStorage:", error);
    }
  };

  return [storedValue, setValue];
}
