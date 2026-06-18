import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationVI from "./translations/vi.json";
import translationEN from "./translations/en.json";

// Read and sanitize the saved language string from localStorage
const savedLang = localStorage.getItem("lang");
const initialLang =
  savedLang && savedLang !== "null" && savedLang !== "undefined"
    ? savedLang
    : "vi";

const resources = {
  en: { translation: translationEN },
  vi: { translation: translationVI },
};

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

// ========================================================
// TYPE EXPORTS FOR THE WEB TEXT COMPONENT
// ========================================================

// 1. Automatically extract keys from your JSON file for autocomplete type safety
export type TxKeyPath = keyof typeof translationEN;

// 2. A fallback translate function if you need string translation outside of React components
export const translate = (key: TxKeyPath) => i18n.t(key);

export default i18n;
