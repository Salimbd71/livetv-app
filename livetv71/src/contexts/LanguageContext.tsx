import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  "All Channels": { en: "All Channels", bn: "সকল চ্যানেল" },
  "All Category": { en: "All Category", bn: "সব ক্যাটাগরি" },
  "Search channels...": { en: "Search channels...", bn: "চ্যানেল খুঁজুন..." },
  "FIFA Live": { en: "FIFA Live", bn: "ফিফা লাইভ" },
  "Bangla": { en: "Bangla", bn: "বাংলা" },
  "English-News": { en: "English News", bn: "ইংরেজি সংবাদ" },
  "Islamic": { en: "Islamic", bn: "ইসলামিক" },
  "Kids": { en: "Kids", bn: "শিশু" },
  "Documentary": { en: "Documentary", bn: "ডকুমেন্টারি" },
  "Indian-Bangla": { en: "Indian Bangla", bn: "ইন্ডিয়ান বাংলা" },
  "Music": { en: "Music", bn: "সংগীত" },
  "Hindi": { en: "Hindi", bn: "হিন্দি" },
  "Sports": { en: "Sports", bn: "খেলাধুলা" },
  "FM-Radio": { en: "FM Radio", bn: "এফএম রেডিও" },
  "LIVE": { en: "LIVE", bn: "লাইভ" },
  "Now Playing": { en: "Now Playing", bn: "এখন চলছে" },
  "Stream unavailable": { en: "Stream unavailable", bn: "স্ট্রিম অনুপলব্ধ" },
  "Retry": { en: "Retry", bn: "পুনরায় চেষ্টা করুন" },
  "channels": { en: "channels", bn: "চ্যানেল" },
  "Home": { en: "Home", bn: "হোম" },
  "About": { en: "About", bn: "আমাদের সম্পর্কে" },
  "Contact Us": { en: "Contact Us", bn: "যোগাযোগ করুন" },
  "Favorites": { en: "Favorites", bn: "পছন্দের" },
  "Select a channel to start watching": { en: "Select a channel to start watching", bn: "দেখতে একটি চ্যানেল বেছে নিন" },
  "Live TV Streaming": { en: "Live TV Streaming", bn: "লাইভ টিভি স্ট্রিমিং" },
  "Category": { en: "Category", bn: "ক্যাটাগরি" },
  "No channels found": { en: "No channels found", bn: "কোনো চ্যানেল পাওয়া যায়নি" },
  "Call Me": { en: "Call Me", bn: "ফোন করুন" },
  "Developer": { en: "Developer", bn: "ডেভেলপার" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
