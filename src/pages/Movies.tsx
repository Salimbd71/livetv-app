import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  Film, Clapperboard, Globe2, Sparkles, Star, WifiOff, RefreshCw,
  Loader2, ChevronLeft, ChevronRight, Play
} from "lucide-react";
import { useMovies, type Movie } from "@/hooks/use-movies";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGlobal } from "@/contexts/GlobalContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

// ── আপনার আগের VideoPlayer কম্পোনেন্টটি ইমপোর্ট করুন ──
import { VideoPlayer } from "@/components/VideoPlayer"; // 경로 (path) টি আপনার প্রজেক্ট অনুযায়ী চেক করে নিন

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Hindi Movies":             <Film className="w-3.5 h-3.5" />,
  "4K Hindi Movies":          <Sparkles className="w-3.5 h-3.5" />,
  "Bangla Movies":            <Globe2 className="w-3.5 h-3.5" />,
  "Kalkata Bangla Movies":    <Star className="w-3.5 h-3.5" />,
  "Southindian Hindi Dubbed": <Clapperboard className="w-3.5 h-3.5" />,
};

function getCategoryIcon(cat: string) {
  return CATEGORY_ICONS[cat] ?? <Film className="w-3.5 h-3.5" />;
}

// ── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col gap-2">
      <div className="aspect-[2/3] bg-muted rounded-xl" />
      <div className="h-3 bg-muted rounded w-3/4" />
      <div className="h-2.5 bg-muted rounded w-1/2" />
    </div>
  );
}

// ── Movie card ────────────────────────────────────────────────────────────
function MovieCard({ movie, active, onClick }: { movie: Movie; active: boolean; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={`group relative flex flex-col text-left w-full rounded-xl overflow-hidden border transition-all duration-200 focus:outline-none
        ${active ? "border-primary ring-2 ring-primary/40 shadow-lg shadow-primary/20"
                 : "border-border hover:border-primary/40 hover:shadow-md"}`}
    >
      <div className="relative aspect-[2/3] bg-muted overflow-hidden">
        {movie.logo && !imgErr ? (
          <img src={movie.logo} alt={movie.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Film className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200
          ${active ? "bg-black/30" : "bg-black/0 group-hover:bg-black/30"}`}>
          <div className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transition-all duration-200
            ${active ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"}`}>
            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
          </div>
        </div>
        {active && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
            {t("PLAYING") || "PLAYING"}
          </div>
        )}
      </div>
      <div className="p-2 bg-card">
        <p className={`text-xs font-semibold leading-tight line-clamp-2 ${active ? "text-primary" : "text-foreground"}`}>
          {movie.name}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{t(movie.category)}</p>
      </div>
    </motion.button>
  );
}

// ── CategoryPill ──────────────────────────────────────────────────────────
function CategoryPill({ active, icon, label, onClick, pillRef }: {
  active: boolean; icon: React.ReactNode; label: string;
  onClick: () => void; pillRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={pillRef}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border
        ${active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-muted/60 text-muted-foreground border-transparent hover:border-primary/30 hover:text-foreground"
        }`}
    >
      {icon}{label}
    </button>
  );
}

// ── Desktop horizontal category strip ─────────────────────────────────────
function DesktopCategoryStrip({
  categories, categoryCounts, totalMovies, activeCategory, setActiveCategory,
}: {
  categories: string[];
  categoryCounts: Record<string, number>;
  totalMovies: number;
  activeCategory: string | null;
  setActiveCategory: (c: string | null) => void;
}) {
  const { t } = useLanguage();
  const stripRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const scrollToCenter = useCallback((key: string) => {
    const strip = stripRef.current;
    const pill = pillRefs.current.get(key);
    if (!strip || !pill) return;
    const stripRect = strip.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    strip.scrollLeft += (pillRect.left - stripRect.left) + pillRect.width / 2 - strip.offsetWidth / 2;
  }, []);

  useEffect(() => {
    scrollToCenter(activeCategory ?? "__all");
  }, [activeCategory, scrollToCenter]);

  return (
    <div
      ref={stripRef}
      className="overflow-x-auto bg-sidebar border-b border-sidebar-border shrink-0"
      style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
    >
      <div className="flex gap-2 px-3 py-2 min-w-max">
        <CategoryPill
          active={activeCategory === null}
          icon={<Film className="w-3 h-3" />}
          label={`${t("All Movies")} (${totalMovies})`}
          onClick={() => setActiveCategory(null)}
          pillRef={el => { if (el) pillRefs.current.set("__all", el); else pillRefs.current.delete("__all"); }}
        />
        {categories.map(cat => (
          <CategoryPill
            key={cat}
            active={activeCategory === cat}
            icon={getCategoryIcon(cat)}
            label={`${t(cat)} (${categoryCounts[cat] || 0})`}
            onClick={() => setActiveCategory(cat)}
            pillRef={el => { if (el) pillRefs.current.set(cat, el); else pillRefs.current.delete(cat); }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Movies page ──────────────────────────────────────────────────────
export default function Movies() {
  const { movies, loading, error, retry } = useMovies();
  const isMobile = useIsMobile();
  const { searchQuery } = useGlobal();
  const { t } = useLanguage();

  const [activeMovie, setActiveMovie]       = useState<Movie | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    movies.forEach(m => { counts[m.category] = (counts[m.category] || 0) + 1; });
    return counts;
  }, [movies]);

  const categories = useMemo(
    () => Array.from(new Set(movies.map(m => m.category))),
    [movies]
  );

  useEffect(() => {
    if (searchQuery) setActiveCategory(null);
  }, [searchQuery]);

  const filtered = useMemo(() => {
    return movies.filter(m => {
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeCategory && m.category !== activeCategory) return false;
      return true;
    });
  }, [movies, searchQuery, activeCategory]);

  const currentIndex = activeMovie ? filtered.findIndex(m => m.url === activeMovie.url) : -1;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex >= 0 && currentIndex < filtered.length - 1;

  const handleSelect = (movie: Movie) => {
    setActiveMovie(movie);
    if (isMobile) {
      setTimeout(() => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <WifiOff className="w-14 h-14 text-destructive/60" />
        <p className="font-bold text-lg">{t("Failed to load movies")}</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={retry}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
          <RefreshCw className="w-4 h-4" /> {t("Try Again")}
        </button>
      </div>
    );
  }

  // ── Shared sub-components ─────────────────────────────────────────────────
  const HeroPlaceholder = () => (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black flex flex-col items-center justify-center border border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-1">
          <Clapperboard className="w-8 h-8 text-primary" />
        </div>
        <p className="text-white font-bold text-base">{t("Select a Movie")}</p>
        <p className="text-white/40 text-xs max-w-[200px]">{t("Click on any movie from the list below")}</p>
      </div>
    </div>
  );

  const NavBar = () => (
    <div className="flex items-center justify-between gap-2 mt-2">
      <button onClick={() => canPrev && handleSelect(filtered[currentIndex - 1])} disabled={!canPrev}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
          ${canPrev ? "border-border text-foreground hover:bg-muted hover:border-primary/40 active:scale-95"
                    : "border-border/40 text-muted-foreground/30 cursor-not-allowed"}`}>
        <ChevronLeft className="w-3.5 h-3.5" /> {t("Previous")}
      </button>
      {activeMovie && (
        <span className="text-[10px] text-muted-foreground truncate max-w-[160px] text-center hidden sm:block">
          {currentIndex + 1} / {filtered.length}
        </span>
      )}
      <button onClick={() => canNext && handleSelect(filtered[currentIndex + 1])} disabled={!canNext}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
          ${canNext ? "border-border text-foreground hover:bg-muted hover:border-primary/40 active:scale-95"
                    : "border-border/40 text-muted-foreground/30 cursor-not-allowed"}`}>
        {t("Next")} <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const Grid = ({ cols = "grid-cols-3 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5" }) => {
    if (loading) return (
      <div className={`grid ${cols} gap-3 p-4`}>
        {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
    if (filtered.length === 0) return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3 text-center p-8">
        <Film className="w-12 h-12 text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">
          {searchQuery ? `"${searchQuery}" — ${t("No movies found")}` : t("No movies in this category")}
        </p>
      </div>
    );
    return (
      <div className={`grid ${cols} gap-3 p-4`}>
        {filtered.map((movie, i) => (
          <MovieCard key={`${movie.url}-${i}`} movie={movie}
            active={activeMovie?.url === movie.url} onClick={() => handleSelect(movie)} />
        ))}
      </div>
    );
  };

  // ── MOBILE layout ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="flex flex-col">
        <div ref={playerRef} className="sticky top-[var(--navbar-h)] z-20">
          <div className="bg-background px-3 pt-3 pb-2 border-b border-border">
            {activeMovie ? (
              /* ✅ VideoPlayer ব্যবহার করা হয়েছে */
              <VideoPlayer key={activeMovie.url} channel={activeMovie} />
            ) : (
              <HeroPlaceholder />
            )}
            {activeMovie && (
              <>
                <div className="mt-2 px-0.5">
                  <p className="font-bold text-sm leading-tight truncate">{activeMovie.name}</p>
                  <p className="text-xs text-muted-foreground">{t(activeMovie.category)}</p>
                </div>
                <NavBar />
              </>
            )}
          </div>
          {/* Category strip */}
          <div className="bg-sidebar border-b border-sidebar-border overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
            <div className="flex gap-2 px-3 py-2 min-w-max">
              <CategoryPill active={activeCategory === null} icon={<Film className="w-3 h-3" />}
                label={`${t("All Movies")} (${movies.length})`} onClick={() => setActiveCategory(null)} />
              {categories.map(cat => (
                <CategoryPill key={cat} active={activeCategory === cat}
                  icon={getCategoryIcon(cat)}
                  label={`${t(cat)} (${categoryCounts[cat] || 0})`}
                  onClick={() => setActiveCategory(cat)} />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-background"><Grid /></div>
      </div>
    );
  }

  // ── DESKTOP layout ────────────────────────────────────────────────────────
  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100dvh - var(--navbar-h))" }}>

      {/* Left panel: player only */}
      <div className="w-[48%] lg:w-[50%] xl:w-[52%] flex flex-col border-r border-border overflow-hidden">
        <div className="shrink-0 p-4 bg-background flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeMovie ? (
              <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* ✅ VideoPlayer ব্যবহার করা হয়েছে */}
                <VideoPlayer key={activeMovie.url} channel={activeMovie} />
                <div className="mt-2.5 flex items-center gap-2.5">
                  {activeMovie.logo && (
                    <img src={activeMovie.logo} alt=""
                      className="w-10 h-14 object-cover rounded bg-muted/30 shrink-0"
                      onError={e => (e.currentTarget.style.display = "none")} />
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-sm leading-tight truncate">{activeMovie.name}</p>
                    <p className="text-xs text-muted-foreground">{t(activeMovie.category)}</p>
                  </div>
                </div>
                <NavBar />
              </motion.div>
            ) : (
              <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <HeroPlaceholder />
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-foreground">NetPlay IPTV Movies</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {loading ? t("Loading movies...") : `${movies.length}+ ${t("Movies Streaming")}`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right panel: sticky category strip + movie grid */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">

        <DesktopCategoryStrip
          categories={categories}
          categoryCounts={categoryCounts}
          totalMovies={movies.length}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">{t("Loading movies...")}</p>
            </div>
          ) : (
            <Grid cols="grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" />
          )}
        </div>
      </div>
    </div>
  );
        }
                                         
