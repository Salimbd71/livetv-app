import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Tv, Heart, Globe, PlayCircle, Radio, Compass, Music,
  BookOpen, Baby, Star, Mic, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChannelGrid } from "@/components/ChannelGrid";
import { useGlobal } from "@/contexts/GlobalContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChannels } from "@/hooks/use-channels";
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

export default function Home() {
  const { activeChannel, setActiveChannel, favorites, toggleFavorite, searchQuery } = useGlobal();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Dynamic channel data loading
  const { channels: ALL_CHANNELS = [], isLoading, error } = useChannels();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (ALL_CHANNELS as any[]).forEach(ch => {
      if (ch.category) counts[ch.category] = (counts[ch.category] || 0) + 1;
    });
    return counts;
  }, [ALL_CHANNELS]);

  const categories = useMemo(() => {
    const cats = new Set((ALL_CHANNELS as any[]).map(c => c.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [ALL_CHANNELS]);

  useEffect(() => {
    if (searchQuery) {
      setActiveCategory(null);
      setShowFavoritesOnly(false);
    }
  }, [searchQuery]);

  const filteredChannels = useMemo(() => {
    return (ALL_CHANNELS as any[]).filter(ch => {
      if (searchQuery && !ch.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (showFavoritesOnly && !favorites.includes(ch.name)) return false;
      if (activeCategory && ch.category !== activeCategory) return false;
      return true;
    });
  }, [ALL_CHANNELS, searchQuery, activeCategory, showFavoritesOnly, favorites]);

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

  // Horizontal Category Bar
  const HorizontalCategoryBar = () => (
    <div
      className="sticky top-0 z-20 bg-background/95 backdrop-blur shrink-0 border-b border-border overflow-x-auto w-full"
      style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 w-max">
        <CategoryPill
          active={isAllActive}
          icon={<Tv className="w-3.5 h-3.5" />}
          label={`${t("All Channels")} (${ALL_CHANNELS.length})`}
          onClick={() => { setActiveCategory(null); setShowFavoritesOnly(false); }}
        />
        <CategoryPill
          active={showFavoritesOnly}
          icon={<Heart className="w-3.5 h-3.5 fill-current" />}
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
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100dvh-var(--navbar-h))] gap-2 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm font-medium">{t("Loading channels...") || "Loading channels..."}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-var(--navbar-h))] p-4 text-center gap-2">
        <p className="text-sm text-destructive font-medium">Failed to load channels.</p>
      </div>
    );
  }

  // ── MOBILE layout ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div id="player-anchor" className="sticky top-[var(--navbar-h)] z-20 bg-background border-b border-border">
          <div className="px-3 pt-3 pb-2">
            {playerEl}
            {activeChannel && <NavBar />}
          </div>
          <HorizontalCategoryBar />
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
      className="flex w-full overflow-hidden bg-background"
      style={{ height: "calc(100dvh - var(--navbar-h))" }}
    >
      {/* Left panel: Player area */}
      <div className="w-[45%] lg:w-[48%] xl:w-[50%] flex flex-col border-r border-border overflow-y-auto p-4 shrink-0">
        {playerEl}

        {activeChannel && (
          <div className="mt-3">
            <div className="flex items-center gap-2.5">
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
          </div>
        )}
      </div>

      {/* Right panel: Horizontal Category Bar + Channel Grid */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <HorizontalCategoryBar />
        <div className="flex-1">
          <ChannelGrid
            channels={filteredChannels}
            activeChannelName={activeChannel?.name || null}
            onSelect={handleSelect}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function CategoryPill({ active, icon, label, onClick, red }: {
  active: boolean; icon: React.ReactNode; label: string;
  onClick: () => void; red?: boolean;
}) {
  const pillRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll selected button to middle
  useEffect(() => {
    if (active && pillRef.current) {
      pillRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [active]);

  return (
    <button
      ref={pillRef}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border
        ${active
          ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
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
      
