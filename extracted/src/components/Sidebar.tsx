import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Tv, Heart, Globe, PlayCircle, Radio, Compass, Music, BookOpen, Baby, Star, Mic } from "lucide-react";

interface SidebarProps {
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;
  horizontal?: boolean;
}

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case "FIFA Live": return <Star className="w-4 h-4" />;
    case "Bangla": return <Globe className="w-4 h-4" />;
    case "English-News": return <Radio className="w-4 h-4" />;
    case "Islamic": return <BookOpen className="w-4 h-4" />;
    case "Kids": return <Baby className="w-4 h-4" />;
    case "Documentary": return <Compass className="w-4 h-4" />;
    case "Indian-Bangla": return <Tv className="w-4 h-4" />;
    case "Music": return <Music className="w-4 h-4" />;
    case "FM-Radio": return <Mic className="w-4 h-4" />;
    default: return <PlayCircle className="w-4 h-4" />;
  }
};

export function Sidebar({
  categories,
  activeCategory,
  setActiveCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  horizontal = false,
}: SidebarProps) {
  const { t } = useLanguage();

  const isAllActive = !showFavoritesOnly && activeCategory === null;

  if (horizontal) {
    return (
      <div
        className="flex flex-row gap-2 px-3 py-2 overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        <button
          onClick={() => { setActiveCategory(null); setShowFavoritesOnly(false); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border
            ${isAllActive
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-muted/60 text-muted-foreground border-transparent hover:border-primary/40 hover:text-foreground"
            }`}
          data-testid="sidebar-all-channels"
        >
          <Tv className="w-3.5 h-3.5" />
          {t("All Channels")}
        </button>

        <button
          onClick={() => { setActiveCategory(null); setShowFavoritesOnly(true); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border
            ${showFavoritesOnly
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-muted/60 text-red-500 border-transparent hover:border-red-400/40 hover:text-red-600"
            }`}
          data-testid="sidebar-favorites"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          {t("Favorites")}
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border
              ${!showFavoritesOnly && activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-muted/60 text-muted-foreground border-transparent hover:border-primary/40 hover:text-foreground"
              }`}
            data-testid={`sidebar-cat-${cat}`}
          >
            {getCategoryIcon(cat)}
            {t(cat)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2 h-full overflow-y-auto">
      <div className="px-2 py-1 mb-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("Category")}</p>
      </div>

      <Button
        variant={isAllActive ? "secondary" : "ghost"}
        className={`justify-start gap-3 ${isAllActive ? "bg-primary/15 text-primary hover:bg-primary/20" : ""}`}
        onClick={() => { setActiveCategory(null); setShowFavoritesOnly(false); }}
        data-testid="sidebar-all-channels-desktop"
      >
        <Tv className="w-4 h-4" />
        {t("All Channels")}
      </Button>

      <Button
        variant={showFavoritesOnly ? "secondary" : "ghost"}
        className={`justify-start gap-3 ${showFavoritesOnly ? "bg-red-500/15 text-red-500" : "text-red-500/80 hover:text-red-500 hover:bg-red-500/10"}`}
        onClick={() => { setActiveCategory(null); setShowFavoritesOnly(true); }}
        data-testid="sidebar-favorites-desktop"
      >
        <Heart className="w-4 h-4 fill-current" />
        {t("Favorites")}
      </Button>

      <div className="h-px bg-border my-1.5 mx-2" />

      {categories.map((cat) => {
        const active = !showFavoritesOnly && activeCategory === cat;
        return (
          <Button
            key={cat}
            variant={active ? "secondary" : "ghost"}
            className={`justify-start gap-3 ${active ? "bg-primary/15 text-primary hover:bg-primary/20" : "text-sidebar-foreground/80"}`}
            onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }}
            data-testid={`sidebar-cat-${cat}-desktop`}
          >
            <span className={active ? "text-primary" : "text-sidebar-foreground/50"}>
              {getCategoryIcon(cat)}
            </span>
            {t(cat)}
          </Button>
        );
      })}
    </div>
  );
}
