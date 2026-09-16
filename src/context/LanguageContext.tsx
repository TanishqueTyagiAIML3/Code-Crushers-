import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { DialectOption } from '../types';
import { INDIAN_LANGUAGES } from '../data/languages';
import { TranslationStrings, getTranslations } from '../i18n/translations';

const STORAGE_KEY = 'shikshasathi_selected_language_id';
const COOKIE_NAME = 'shikshasathi_lang';
export const DEFAULT_LANGUAGE_ID = 'hi-bhojpuri';

export interface LanguageContextType {
  selectedLanguage: DialectOption;
  selectedLanguageId: string;
  setSelectedLanguage: (language: DialectOption | string) => void;
  t: TranslationStrings;
  translate: (key: keyof TranslationStrings) => string;
  availableLanguages: DialectOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Helper to get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Helper to write a persistent cookie
 */
function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Resolves a DialectOption from storage or fallback
 */
export function getPersistedLanguage(): DialectOption {
  let savedId: string | null = null;

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      savedId = localStorage.getItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Unable to access localStorage for language:', err);
  }

  if (!savedId) {
    savedId = getCookie(COOKIE_NAME);
  }

  if (savedId) {
    const matched = INDIAN_LANGUAGES.find(l => l.id === savedId);
    if (matched) {
      return matched;
    }
  }

  // Fallback to default
  const fallback = INDIAN_LANGUAGES.find(l => l.id === DEFAULT_LANGUAGE_ID) || INDIAN_LANGUAGES[0];
  return fallback;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state directly from localStorage or cookies to prevent flash of wrong language
  const [selectedLanguage, setLanguageState] = useState<DialectOption>(getPersistedLanguage);

  // Sync with document element language tag and broadcast events
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const baseCode = selectedLanguage.code ? selectedLanguage.code.split('-')[0] : 'hi';
      document.documentElement.lang = baseCode;
      document.documentElement.setAttribute('data-dialect-id', selectedLanguage.id);
    }
  }, [selectedLanguage]);

  // Handler to update language with auto-persistence
  const setSelectedLanguage = useCallback((language: DialectOption | string) => {
    let targetDialect: DialectOption | undefined;

    if (typeof language === 'string') {
      targetDialect = INDIAN_LANGUAGES.find(l => l.id === language || l.code === language);
      if (!targetDialect) {
        // prefix match
        targetDialect = INDIAN_LANGUAGES.find(l => l.id.startsWith(language));
      }
    } else {
      targetDialect = language;
    }

    if (!targetDialect) {
      console.warn(`Language not found:`, language);
      return;
    }

    setLanguageState(targetDialect);

    // Persist to localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, targetDialect.id);
      }
    } catch (e) {
      console.warn('Failed to save language to localStorage:', e);
    }

    // Persist to Cookie
    setCookie(COOKIE_NAME, targetDialect.id);

    // Sync HTML attributes immediately
    if (typeof document !== 'undefined') {
      const baseCode = targetDialect.code ? targetDialect.code.split('-')[0] : 'hi';
      document.documentElement.lang = baseCode;
      document.documentElement.setAttribute('data-dialect-id', targetDialect.id);
    }

    // Broadcast across windows/tabs or non-React listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('app:language_changed', {
          detail: targetDialect
        })
      );
    }
  }, []);

  // Listen to external storage events (e.g. if updated in another tab/window)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const matched = INDIAN_LANGUAGES.find(l => l.id === e.newValue);
        if (matched) {
          setLanguageState(matched);
        }
      }
    };

    const handleCustomChange = (e: any) => {
      if (e.detail && e.detail.id && e.detail.id !== selectedLanguage.id) {
        setLanguageState(e.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('app:language_changed', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('app:language_changed', handleCustomChange);
    };
  }, [selectedLanguage.id]);

  // Compute active translation strings dynamically
  const t = useMemo(() => {
    return getTranslations(selectedLanguage.id);
  }, [selectedLanguage.id]);

  const translate = useCallback(
    (key: keyof TranslationStrings): string => {
      return t[key] || key;
    },
    [t]
  );

  const contextValue = useMemo<LanguageContextType>(
    () => ({
      selectedLanguage,
      selectedLanguageId: selectedLanguage.id,
      setSelectedLanguage,
      t,
      translate,
      availableLanguages: INDIAN_LANGUAGES
    }),
    [selectedLanguage, setSelectedLanguage, t, translate]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

/**
 * Custom hook to consume the global Language state
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a <LanguageProvider>');
  }
  return context;
}
