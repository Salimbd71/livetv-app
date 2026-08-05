import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Tv, Heart, Globe, PlayCircle, Radio, Compass, Music,
  BookOpen, Baby, Star, Mic, ChevronLeft, ChevronRight,
  WifiOff, RefreshCw
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChannelGrid } from "@/components/ChannelGrid";
import { useGlobal } from "@/contexts/GlobalContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChannels } from "@/hooks/use-channels";
import placeholderImg from "@assets/placeholder_image_1782581749400.png";

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

// ── CategoryPill ────────────────────────────────────────────────────────────
function CategoryPill({ active, icon, label, onClick, red, pillRef }: {
  active: boolean; icon: React.ReactNode; label: string;
  onClick: () => void; red?: boolean;
  pillRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={pillRef}
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

// ── Desktop horizontal category strip with auto-center ──────────────────────
function DesktopCategoryStrip({
  categories, categoryCounts, totalCount, favCount,
  activeCategory, setActiveCategory,
  showFavoritesOnly, setShowFavoritesOnly, isAllActive,
}: {
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
  const stripRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const scrollToCenter = useCallback((key: string) => {
    const strip = stripRef.current;
    const pill = pillRefs.current.get(key);
    if (!strip || !pill) return;
    // Use getBoundingClientRect so the calculation is independent of offsetParent
    const stripRect = strip.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    strip.scrollLeft += (pillRect.left - stripRect.left) + pillRect.width / 2 - strip.offsetWidth / 2;
  }, []);

  // Scroll active pill to center whenever it changes
  useEffect(() => {
    const key = isAllActive ? "__all" : showFavoritesOnly ? "__fav" : (activeCategory ?? "__all");
    scrollToCenter(key);
  }, [activeCategory, showFavoritesOnly, isAllActive, scrollToCenter]);

  return (
    <div
      ref={stripRef}
      className="overflow-x-auto bg-sidebar border-b border-sidebar-border shrink-0"
      style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
    >
      <div className="flex gap-2 px-3 py-2 min-w-max">
        {/* All */}
        <CategoryPill
          active={isAllActive}
          icon={<Tv className="w-3 h-3" />}
          label={`${t("All Channels")} (${totalCount})`}
          onClick={() => { setActiveCategory(null); setShowFavoritesOnly(false); }}
          pillRef={el => { if (el) pillRefs.current.set("__all", el); else pillRefs.current.delete("__all"); }}
        />
        {/* Favorites */}
        <CategoryPill
          active={showFavoritesOnly}
          icon={<Heart className="w-3 h-3 fill-current" />}
          label={`${t("Favorites")} (${favCount})`}
          onClick={() => { setActiveCategory(null); setShowFavoritesOnly(true); }}
          red
          pillRef={el => { if (el) pillRefs.current.set("__fav", el); else pillRefs.current.delete("__fav"); }}
        />
        {/* Categories */}
        {categories.map(cat => (
          <CategoryPill
            key={cat}
            active={!showFavoritesOnly && activeCategory === cat}
            icon={getCategoryIcon(cat)}
            label={`${t(cat)} (${categoryCounts[cat] || 0})`}
            onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }}
            pillRef={el => { if (el) pillRefs.current.set(cat, el); else pillRefs.current.delete(cat); }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { activeChannel, setActiveChannel, favorites, toggleFavorite, searchQuery } = useGlobal();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { channels: ALL_CHANNELS, loading: channelsLoading, error: channelsError, retry } = useChannels();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_CHANNELS.forEach(ch => {
      if (ch.category) counts[ch.category] = (counts[ch.category] || 0) + 1;
    });
    return counts;
  }, [ALL_CHANNELS]);

  const categories = useMemo(() => {
    const cats = new Set(ALL_CHANNELS.map(c => c.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [ALL_CHANNELS]);

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
  }, [ALL_CHANNELS, searchQuery, activeCategory, showFavoritesOnly, favorites]);

  if (channelsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <WifiOff className="w-14 h-14 text-destructive/60" />
        <p className="font-bold text-lg">চ্যানেল লোড হয়নি</p>
        <p className="text-sm text-muted-foreground">{channelsError}</p>
        <button onClick={retry}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
          <RefreshCw className="w-4 h-4" /> আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

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
      <button onClick={goPrev} disabled={!canPrev}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
          ${canPrev ? "border-border text-foreground hover:bg-muted hover:border-primary/40 active:scale-95"
                    : "border-border/40 text-muted-foreground/30 cursor-not-allowed"}`}>
        <ChevronLeft className="w-3.5 h-3.5" />{t("Previous")}
      </button>
      {activeChannel && (
        <span className="text-[10px] text-muted-foreground truncate max-w-[140px] text-center hidden sm:block">
          {currentIndex + 1} / {filteredChannels.length}
        </span>
      )}
      <button onClick={goNext} disabled={!canNext}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
          ${canNext ? "border-border text-foreground hover:bg-muted hover:border-primary/40 active:scale-95"
                    : "border-border/40 text-muted-foreground/30 cursor-not-allowed"}`}>
        {t("Next")}<ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const playerEl = activeChannel ? (
    <VideoPlayer key={activeChannel.url} channel={activeChannel} />
  ) : (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
      <img src={placeholderImg} alt="NetPlay IPTV" className="w-full h-full object-cover" />
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
          <div
            className="bg-sidebar border-b border-sidebar-border overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            <div className="flex gap-2 px-3 py-2 min-w-max">
              <CategoryPill active={isAllActive} icon={<Tv className="w-3 h-3" />}
                label={`${t("All Channels")} (${ALL_CHANNELS.length})`}
                onClick={() => { setActiveCategory(null); setShowFavoritesOnly(false); }} />
              <CategoryPill active={showFavoritesOnly} icon={<Heart className="w-3 h-3 fill-current" />}
                label={`${t("Favorites")} (${favorites.length})`}
                onClick={() => { setActiveCategory(null); setShowFavoritesOnly(true); }} red />
              {categories.map(cat => (
                <CategoryPill key={cat} active={!showFavoritesOnly && activeCategory === cat}
                  icon={getCategoryIcon(cat)}
                  label={`${t(cat)} (${categoryCounts[cat] || 0})`}
                  onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-background">
          <ChannelGrid channels={filteredChannels} activeChannelName={activeChannel?.name || null}
            onSelect={handleSelect} favorites={favorites} toggleFavorite={toggleFavorite} />
        </div>
      </div>
    );
  }

  // ── DESKTOP layout ───────────────────────────────────────────────────────
  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100dvh - var(--navbar-h))" }}>

      {/* Left panel: player only */}
      <div className="w-[48%] lg:w-[50%] xl:w-[52%] flex flex-col border-r border-border overflow-hidden">
        <div className="shrink-0 p-4 bg-background flex-1 overflow-y-auto">
          {playerEl}
          {activeChannel ? (
            <>
              <div className="mt-2.5 flex items-center gap-2.5">
                {activeChannel.logo && (
                  <img src={activeChannel.logo} alt=""
                    className="w-7 h-7 object-contain rounded bg-muted/30 p-0.5 shrink-0"
                    onError={e => (e.currentTarget.style.display = "none")} />
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
      </div>

      {/* Right panel: sticky category strip + channels */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Horizontal category strip — sticky at top of right panel */}
        <DesktopCategoryStrip
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
        {/* Scrollable channel grid */}
        <div className="flex-1 overflow-y-auto">
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
