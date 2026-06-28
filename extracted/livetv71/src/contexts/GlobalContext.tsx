import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Channel {
  name: string;
  url: string;
  category: string;
  logo?: string;
  channel?: string;
}

interface GlobalContextType {
  activeChannel: Channel | null;
  setActiveChannel: (ch: Channel | null) => void;
  favorites: string[];
  toggleFavorite: (name: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const GlobalContext = createContext<GlobalContextType>({
  activeChannel: null,
  setActiveChannel: () => {},
  favorites: [],
  toggleFavorite: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
});

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem("livetv71-favorites");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("livetv71-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (name: string) => {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  return (
    <GlobalContext.Provider value={{ activeChannel, setActiveChannel, favorites, toggleFavorite, searchQuery, setSearchQuery }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}
