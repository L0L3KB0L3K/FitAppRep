import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sl from "./locales/sl/translation.json";
import en from "./locales/en/translation.json";

// Inicializacija i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      sl: { translation: sl },
      en: { translation: en },
    },
    lng: "sl", // privzeti jezik
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
