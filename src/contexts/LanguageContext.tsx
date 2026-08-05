import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // ── Existing Translations ─────────────────────────────────
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
  "Previous": { en: "Previous", bn: "পূর্ববর্তী" },
  "Next": { en: "Next", bn: "পরবর্তী" },
  "Loading channels...": { en: "Loading channels...", bn: "চ্যানেল লোড হচ্ছে..." },

  // ── Movies Page Translations (New Added) ──────────────────
  "All Movies": { en: "All Movies", bn: "সব মুভি" },
  "Hindi Movies": { en: "Hindi Movies", bn: "হিন্দি মুভি" },
  "4K Hindi Movies": { en: "4K Hindi Movies", bn: "৪কে হিন্দি মুভি" },
  "Bangla Movies": { en: "Bangla Movies", bn: "বাংলা মুভি" },
  "Kalkata Bangla Movies": { en: "Kalkata Bangla Movies", bn: "কলকাতা বাংলা মুভি" },
  "Southindian Hindi Dubbed": { en: "South Indian (Hindi Dubbed)", bn: "সাউথ ইন্ডিয়ান (হিন্দি ডাবড)" },
  "PLAYING": { en: "PLAYING", bn: "চলছে" },
  "Select a Movie": { en: "Select a Movie", bn: "মুভি সিলেক্ট করুন" },
  "Click on any movie from the list below": { en: "Click on any movie from the list below", bn: "নিচের তালিকা থেকে যেকোনো মুভিতে ক্লিক করুন" },
  "Loading movies...": { en: "Loading movies...", bn: "মুভি লোড হচ্ছে..." },
  "Movies Streaming": { en: "Movies Streaming", bn: "মুভি স্ট্রিমিং" },
  "No movies found": { en: "No movies found", bn: "কোনো মুভি পাওয়া যায়নি" },
  "No movies in this category": { en: "No movies in this category", bn: "এই ক্যাটাগরিতে কোনো মুভি নেই" },
  "Failed to load movies": { en: "Failed to load movies", bn: "মুভি লোড করতে ব্যর্থ হয়েছে" },
  "Try Again": { en: "Try Again", bn: "আবার চেষ্টা করুন" },
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
