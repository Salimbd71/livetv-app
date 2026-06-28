import React, { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Tv, Heart, Globe, PlayCircle, Radio, Compass, Music, BookOpen, Baby, Star, Mic, Play } from "lucide-react";
import { useGlobal } from "@/contexts/GlobalContext";
import { useLanguage } from "@/contexts/LanguageContext";
import channelsData from "@assets/channels.json";
import { motion } from "framer-motion";

const getCategoryIcon = (cat: string) => {
  const cls = "w-5 h-5";
  switch (cat) {
    case "FIFA Live": return <Star className={cls} />;
    case "Bangla": return <Globe className={cls} />;
    case "English-News": return <Radio className={cls} />;
    case "Islamic": return <BookOpen className={cls} />;
    case "Kids": return <Baby className={cls} />;
    case "Documentary": return <Compass className={cls} />;
    case "Indian-Bangla": return <Tv className={cls} />;
    case "Music": return <Music className={cls} />;
    case "FM-Radio": return <Mic className={cls} />;
    default: return <PlayCircle className={cls} />;
  }
};

export default function AllCategory() {
  const { setActiveChannel, favorites } = useGlobal();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set((channelsData as any[]).map(c => c.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, []);

  const channelsForCategory = useMemo(() => {
    if (!selectedCategory) return channelsData as any[];
    return (channelsData as any[]).filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  const handleChannelClick = (ch: any) => {
    setActiveChannel(ch);
    setLocation("/");
  };

  return (
    <>
      {/* ── DESKTOP ─── */}
      <div
        className="hidden md:flex overflow-hidden"
        style={{ height: "calc(100dvh - var(--navbar-h))" }}
      >
        {/* Left: category list */}
        <div className="w-64 shrink-0 border-r border-border bg-sidebar overflow-y-auto">
          <div className="p-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-2">
              {t("All Category")}
            </p>

            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left mb-1
                ${selectedCategory === null
                  ? "bg-primary/15 text-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              data-testid="allcat-all"
            >
              <Tv className="w-5 h-5 shrink-0" />
              {t("All Channels")}
              <span className="ml-auto text-xs text-muted-foreground">{(channelsData as any[]).length}</span>
            </button>

            <div className="h-px bg-border my-2" />

            {categories.map(cat => {
              const count = (channelsData as any[]).filter(c => c.category === cat).length;
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left mb-0.5
                    ${active
                      ? "bg-primary/15 text-primary"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    }`}
                  data-testid={`allcat-${cat}`}
                >
                  <span className={active ? "text-primary" : "text-muted-foreground"}>
                    {getCategoryIcon(cat)}
                  </span>
                  <span className="flex-1 truncate">{t(cat)}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: channels for selected category */}
        <div className="flex-1 overflow-y-auto bg-background">
          <CategoryChannelGrid
            channels={channelsForCategory}
            categoryLabel={selectedCategory ? t(selectedCategory) : t("All Channels")}
            favorites={favorites}
            onChannelClick={handleChannelClick}
          />
        </div>
      </div>

      {/* ── MOBILE ─── */}
      <div className="md:hidden flex flex-col min-h-[calc(100dvh-var(--navbar-h))]">
        {/* Horizontal category strip — sticky */}
        <div
          className="sticky top-[var(--navbar-h)] z-20 bg-sidebar border-b border-sidebar-border overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          <div className="flex gap-2 px-3 py-2.5 min-w-max">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 border transition-all
                ${selectedCategory === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/60 text-muted-foreground border-transparent hover:border-primary/30"
                }`}
            >
              <Tv className="w-3 h-3" /> {t("All Channels")}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 border transition-all
                  ${selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/60 text-muted-foreground border-transparent hover:border-primary/30"
                  }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Channel grid */}
        <div className="flex-1 bg-background">
          <CategoryChannelGrid
            channels={channelsForCategory}
            categoryLabel={selectedCategory ? t(selectedCategory) : t("All Channels")}
            favorites={favorites}
            onChannelClick={handleChannelClick}
          />
        </div>
      </div>
    </>
  );
}

function CategoryChannelGrid({ channels, categoryLabel, favorites, onChannelClick }: {
  channels: any[];
  categoryLabel: string;
  favorites: string[];
  onChannelClick: (ch: any) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="p-3 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base md:text-lg font-bold">{categoryLabel}</h2>
        <span className="text-xs text-muted-foreground">{channels.length} {t("channels")}</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
        {channels.map((ch, idx) => (
          <motion.button
            key={ch.name + idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.02, 0.4) }}
            onClick={() => onChannelClick(ch)}
            className="group relative bg-card border border-card-border rounded-lg overflow-hidden text-left hover:border-primary/50 hover:shadow-md transition-all duration-200 active:scale-95"
            data-testid={`allcat-ch-${ch.name.replace(/\s+/g, "-")}`}
          >
            {/* Logo */}
            <div className="aspect-video bg-muted/20 flex items-center justify-center p-2 relative overflow-hidden">
              {ch.logo ? (
                <img src={ch.logo} alt={ch.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  onError={e => { e.currentTarget.style.display = "none"; }} />
              ) : (
                <Tv className="w-6 h-6 text-muted-foreground/30" />
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Play className="w-4 h-4 text-white ml-0.5" />
                </div>
              </div>
              {favorites.includes(ch.name) && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              )}
            </div>
            {/* Info */}
            <div className="px-2 py-1.5">
              <p className="text-[10px] md:text-xs font-semibold leading-tight line-clamp-2 text-card-foreground">
                {ch.name.trim()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[8px] md:text-[9px] text-muted-foreground font-medium uppercase tracking-wide">
                  {t("LIVE")}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
