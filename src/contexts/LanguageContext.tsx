"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.si;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("si");

  useEffect(() => {
    const saved = localStorage.getItem("hip_hr_lang") as Language;
    if (saved && (saved === "si" || saved === "en" || saved === "zh")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("hip_hr_lang", lang);
  };

  const toggleLanguage = () => {
    const cycle: Record<Language, Language> = {
      si: "en",
      en: "zh",
      zh: "si",
    };
    setLanguage(cycle[language] || "si");
  };

  const t = translations[language] || translations.si;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
