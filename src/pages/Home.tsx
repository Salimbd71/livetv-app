import React, { useState, useMemo, useEffect } from "react";
import {
  Tv, Heart, Globe, PlayCircle, Radio, Compass, Music,
  BookOpen, Baby, Star, Mic, ChevronLeft, ChevronRight
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChannelGrid } from "@/components/ChannelGrid";
import { useGlobal } from "@/contexts/GlobalContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import channelsData from "@assets/channels.json";
import placeholderImg from "@assets/placeholder.png";

const getCategoryIcon = (cat: string) => {
  const cls = "w-4 h-4 shrink-0";
  switch (cat) {
    case "FIFA Live":     return <Star className={cls} />;
    case "Bangla":        return <Globe className={cls} />;
    case "English-News":  return <Radio className={cls} />;
    case "Islamic":       return <BookOpen className={cls} />;
    case "Kids":          return <Baby className={cls} />;
    case "Documentary":   return <Compass className={cls} />;
    case "Indian-Bangla": return <Tv className={cls} />;
    case "Music":         return <Music className={cls} />;
    case "FM-Radio":      return <Mic className={cls} />;
    default:              return <PlayCircle className={cls} />;
  }
};

const ALL_CHANNELS = channelsData as any[];

export default function Home() {
  const { activeChannel, setActiveChannel, favorites, toggleFavorite, searchQuery } = useGlobal();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Precompute channel counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_CHANNELS.forEach(ch => {
      if (ch.category) counts[ch.category] = (counts[ch.category] || 0) + 1;
    });
    return counts;
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(ALL_CHANNELS.map(c => c.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setActiveCategory(null);
      setShowFavoritesOnly(false);
    }
  }, [searchQuery]);

  const filteredChannels = useMemo(() => {
    return ALL_CHANNELS.filter(ch => {
      if (searchQuery && !ch.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (showFavoritesOnly && !favorites.includes(ch.name)) return false;
      if (activeCategory && ch.category !== activeCategory) return false;
      return true;
    });
  }, [searchQuery, activeCategory, showFavoritesOnly, favorites]);

  // Prev / Next channel navigation
  const currentIndex = activeChannel
    ? filteredChannels.findIndex(ch => ch.url === activeChannel.url)
    : -1;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex >= 0 && currentIndex < filteredChannels.length - 1;

  const handleSelect = (ch: any) => {
    setActiveChannel(ch);
    if (isMobile) {
      setTimeout(() => {
        document.getElementById("player-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  const goPrev = () => { if (canPrev) handleSelect(filteredChannels[currentIndex - 1]); };
  const goNext = () => { if (canNext) handleSelect(filteredChannels[currentIndex + 1]); };

  const isAllActive = !showFavoritesOnly && activeCategory === null;

  // Prev/Next bar shown below the player when a channel is active
  const NavBar = () => (
    <div className="flex items-center justify-between gap-2 mt-2">
      <button
        onClick={goPrev}
        disabled={!canPrev}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
          ${canPrev
            ? "border-border text-foreground hover:bg-muted hover:border-primary/40 active:scale-95"
            : "border-border/40 text-muted-foreground/30 cursor-not-allowed"
          }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {t("Previous")}
      </button>

      {activeChannel && (
        <span className="text-[10px] text-muted-foreground truncate max-w-[140px] text-center hidden sm:block">
          {currentIndex + 1} / {filteredChannels.length}
        </span>
      )}

      <button
        onClick={goNext}
        disabled={!canNext}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
          ${canNext
            ? "border-border text-foreground hover:bg-muted hover:border-primary/40 active:scale-95"
            : "border-border/40 text-muted-foreground/30 cursor-not-allowed"
          }`}
      >
        {t("Next")}
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  // Shared player — rendered ONCE, never duplicated
  const playerEl = activeChannel ? (
    <VideoPlayer key={activeChannel.url} channel={activeChannel} />
  ) : (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
      <img src={placeholderImg} alt="LiveTV71" className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35">
        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-xl shadow-primary/40 mb-3">
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-white font-semibold text-sm drop-shadow">চ্যানেল সিলেক্ট করুন</p>
      </div>
    </div>
  );

  // ── MOBILE layout ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="flex flex-col">
        <div id="player-anchor" className="sticky top-[var(--navbar-h)] z-20">
          <div className="bg-background px-3 pt-3 pb-2 border-b border-border">
            {playerEl}
            {activeChannel && <NavBar />}
          </div>

          {/* Horizontal category strip */}
          <div
            className="bg-sidebar border-b border-sidebar-border overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            <div className="flex gap-2 px-3 py-2 min-w-max">
              <CategoryPill
                active={isAllActive}
                icon={<Tv className="w-3 h-3" />}
                label={`${t("All Channels")} (${ALL_CHANNELS.length})`}
                onClick={() => { setActiveCategory(null); setShowFavoritesOnly(false); }}
              />
              <CategoryPill
                active={showFavoritesOnly}
                icon={<Heart className="w-3 h-3 fill-current" />}
                label={`${t("Favorites")} (${favorites.length})`}
                onClick={() => { setActiveCategory(null); setShowFavoritesOnly(true); }}
                red
              />
              {categories.map(cat => (
                <CategoryPill
                  key={cat}
                  active={!showFavoritesOnly && activeCategory === cat}
                  icon={getCategoryIcon(cat)}
                  label={`${t(cat)} (${categoryCounts[cat] || 0})`}
                  onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-background">
          <ChannelGrid
            channels={filteredChannels}
            activeChannelName={activeChannel?.name || null}
            onSelect={handleSelect}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </div>
      </div>
    );
  }

  // ── DESKTOP layout ───────────────────────────────────────────────────────
  return (
    <div
      className="flex overflow-hidden"
      style={{ height: "calc(100dvh - var(--navbar-h))" }}
    >
      {/* Left panel: player + category list */}
      <div className="w-[48%] lg:w-[50%] xl:w-[52%] flex flex-col border-r border-border overflow-hidden">
        <div className="shrink-0 p-4 border-b border-border bg-background">
          {playerEl}

          {activeChannel ? (
            <>
              <div className="mt-2.5 flex items-center gap-2.5">
                {activeChannel.logo && (
                  <img
                    src={activeChannel.logo}
                    alt=""
                    className="w-7 h-7 object-contain rounded bg-muted/30 p-0.5 shrink-0"
                    onError={e => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="min-w-0">
                  <p className="font-bold text-sm leading-tight truncate">{activeChannel.name.trim()}</p>
                  <p className="text-xs text-muted-foreground">{t(activeChannel.category)}</p>
                </div>
              </div>
              <NavBar />
            </>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto bg-sidebar">
          <CategoryList
            categories={categories}
            categoryCounts={categoryCounts}
            totalCount={ALL_CHANNELS.length}
            favCount={favorites.length}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
            isAllActive={isAllActive}
          />
        </div>
      </div>

      {/* Right panel: channels */}
      <div className="flex-1 overflow-y-auto bg-background">
        <ChannelGrid
          channels={filteredChannels}
          activeChannelName={activeChannel?.name || null}
          onSelect={handleSelect}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function CategoryPill({ active, icon, label, onClick, red }: {
  active: boolean; icon: React.ReactNode; label: string;
  onClick: () => void; red?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border
        ${active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : red
            ? "bg-muted/60 text-red-500 border-transparent hover:border-red-400/40"
            : "bg-muted/60 text-muted-foreground border-transparent hover:border-primary/30 hover:text-foreground"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function CategoryList({ categories, categoryCounts, totalCount, favCount, activeCategory, setActiveCategory,
  showFavoritesOnly, setShowFavoritesOnly, isAllActive }: {
  categories: string[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  favCount: number;
  activeCategory: string | null;
  setActiveCategory: (c: string | null) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (v: boolean) => void;
  isAllActive: boolean;
}) {
  const { t } = useLanguage();
  const btnBase = "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left";
  const activeStyle = "bg-primary/15 text-primary";
  const inactiveStyle = "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground";

  const Count = ({ n }: { n: number }) => (
    <span className="ml-auto text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground shrink-0">
      {n}
    </span>
  );

  return (
    <div className="p-2">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-2">
        {t("Category")}
      </p>

      <button onClick={() => { setActiveCategory(null); setShowFavoritesOnly(false); }}
        className={`${btnBase} ${isAllActive ? activeStyle : inactiveStyle}`}>
        <Tv className="w-4 h-4 shrink-0" />
        {t("All Channels")}
        <Count n={totalCount} />
      </button>

      <button onClick={() => { setActiveCategory(null); setShowFavoritesOnly(true); }}
        className={`${btnBase} ${showFavoritesOnly ? "bg-red-500/15 text-red-500" : "text-red-500/70 hover:bg-red-500/10 hover:text-red-500"}`}>
        <Heart className="w-4 h-4 shrink-0 fill-current" />
        {t("Favorites")}
        <Count n={favCount} />
      </button>

      <div className="h-px bg-border my-2 mx-1" />

      {categories.map(cat => {
        const active = !showFavoritesOnly && activeCategory === cat;
        return (
          <button key={cat} onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }}
            className={`${btnBase} ${active ? activeStyle : inactiveStyle}`}>
            <span className={active ? "text-primary" : "text-sidebar-foreground/50"}>
              {getCategoryIcon(cat)}
            </span>
            {t(cat)}
            <Count n={categoryCounts[cat] || 0} />
          </button>
        );
      })}
    </div>
  );
}
