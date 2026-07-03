"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en.json";
import ko from "@/locales/ko.json";

type Language = "en" | "ko";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, vars?: Record<string, string>) => string;
}

const dictionaries = {
    en,
    ko
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const storedLang = localStorage.getItem("app_language") as Language;
        if (storedLang && (storedLang === "en" || storedLang === "ko")) {
            setLanguageState(storedLang);
        } else {
            const browserLang = navigator.language.split('-')[0];
            setLanguageState(browserLang === "ko" ? "ko" : "en");
        }
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("app_language", lang);
    };

    const t = (key: string, vars?: Record<string, string>): string => {
        const dict = dictionaries[language] as Record<string, string>;
        let text = dict[key] || key;
        if (vars) {
            Object.entries(vars).forEach(([k, v]) => {
                text = text.replace(new RegExp(`{{${k}}}`, 'g'), v);
            });
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
