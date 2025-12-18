import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "../src/locales/en/translation.json";
import translationAR from "../src/locales/ar/translation.json";
i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationEN },
            ar: { translation: translationAR },
        },
        lng: localStorage.getItem("i18nextLng") || "en", // Get from storage or default to en
        fallbackLng: "en",
        interpolation: { escapeValue: false },
    });

// Set initial direction based on language
document.dir = i18n.language === "ar" ? "rtl" : "ltr";

export default i18n;
