"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import {
  Language,
  TranslationDictionary,
  translations,
} from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const STORAGE_KEY = "landguard_lang";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function getSnapshot(): Language {
  if (typeof window === "undefined") return "bn";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "bn" || saved === "en") return saved;
  } catch {
    // Ignore storage errors in restricted environments
  }
  return "bn";
}

function getServerSnapshot(): Language {
  return "bn";
}

const defaultContext: LanguageContextType = {
  language: "bn",
  setLanguage: () => {},
  t: translations.bn,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore guarantees 'bn' during SSR and initial hydration,
  // then updates client-side safely without hydration mismatch or cascading render issues.
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Synchronize document lang attribute
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (newLang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore storage errors
    }
    notifyListeners();
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  return context || defaultContext;
}

