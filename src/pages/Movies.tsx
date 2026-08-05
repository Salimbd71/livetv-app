import React, { useState, useMemo, useRef } from "react";
import {
  Film, Clapperboard, Globe2, Sparkles, Star, WifiOff, RefreshCw,
  Loader2, ChevronLeft, ChevronRight, Play
} from "lucide-react";
import { MoviePlayer } from "@/components/MoviePlayer";
import { useMovies, type Movie } from "@/hooks/use-movies";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Hindi Movies":              <Film className="w-3.5 h-3.5" />,
  "4K Hindi Movies":           <Sparkles className="w-3.5 h-3.5" />,
  "Bangla Movies":             <Globe2 className="w-3.5 h-3.5" />,
  "Kalkata Bangla Movies":     <Star className="w-3.5 h-3.5" />,
  "Southindian Hindi Dubbed":  <Clapperboard className="w-3.5 h-3.5" />,
};

function getCategoryIcon(cat: string) {
  return CATEGORY_ICONS[cat] ?? <Film className="w-3.5 h-3.5" />;
}

// ── Skeleton loading card ─────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col gap-2">
      <div className="aspect-[2/3] bg-muted rounded-xl" />
      <div className="h-3 bg-muted rounded w-3/4" />
      <div className="h-2.5 bg-muted rounded w-1/2" />
    </div>
  );
}

// ── Movie poster card ─────────────────────────────────────────────────────
function MovieCard({
  movie, active, onClick,
}: { movie: Movie; active: boolean; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={`group relative flex flex-col text-left w-full rounded-xl overflow-hidden border transition-all duration-200 focus:outline-none
        ${active
          ? "border-primary ring-2 ring-primary/40 shadow-lg shadow-primary/20"
          : "border-border hover:border-primary/40 hover:shadow-md"
        }`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-muted overflow-hidden">
        {movie.logo && !imgErr ? (
          <img
            src={movie.logo}
            alt={movie.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Film className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}

        {/* Play overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200
          ${active ? "bg-black/30" : "bg-black/0 group-hover:bg-black/30"}`}>
          <div className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transition-all duration-200
            ${active ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"}`}>
            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* Active badge */}
        {active && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
            PLAYING
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 bg-card">
        <p className={`text-xs font-semibold leading-tight line-clamp-2 ${active ? "text-primary" : "text-foreground"}`}>
          {movie.name}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{movie.category}</p>
      </div>
    </motion.button>
  );
}

// ── Category pill ─────────────────────────────────────────────────────────
function CategoryPill({
  active, icon, label, onClick,
}: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all border
        ${active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-muted/60 text-muted-foreground border-transparent hover:border-primary/30 hover:text-foreground"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Main Movies page ──────────────────────────────────────────────────────
export default function Movies() {
  const { movies, loading, error, retry } = useMovies();
  const isMobile = useIsMobile();

  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Compute categories with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    movies.forEach(m => { counts[m.category] = (counts[m.category] || 0) + 1; });
    return counts;
  }, [movies]);

  const categories = useMemo(() =>
    Array.from(new Set(movies.map(m => m.category))),
    [movies]
  );

  const filtered = useMemo(() =>
    activeCategory ? movies.filter(m => m.category === activeCategory) : movies,
    [movies, activeCategory]
  );

  const currentIndex = activeMovie
    ? filtered.findIndex(m => m.url === activeMovie.url)
    : -1;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex >= 0 && currentIndex < filtered.length - 1;

  const handleSelect = (movie: Movie) => {
    setActiveMovie(movie);
    if (isMobile) {
      setTimeout(() => {
        playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <WifiOff className="w-14 h-14 text-destructive/60" />
        <p className="font-bold text-lg">মুভি লোড হয়নি</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={retry}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
          <RefreshCw className="w-4 h-4" /> আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  // ── Placeholder (no movie selected) ──────────────────────────────────────
  const HeroPlaceholder = () => (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black flex flex-col items-center justify-center border border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-1">
          <Clapperboard className="w-8 h-8 text-primary" />
        </div>
        <p className="text-white font-bold text-base">মুভি সিলেক্ট করুন</p>
        <p className="text-white/40 text-xs max-w-[200px]">নিচের তালিকা থেকে যেকোনো মুভিতে ক্লিক করুন</p>
      </div>
    </div>
  );

  // ── Category strip (shared) ───────────────────────────────────────────────
  const CategoryStrip = () => (
    <div
      className="overflow-x-auto"
      style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
    >
      <div className="flex gap-2 px-3 py-2 min-w-max">
        <CategoryPill
          active={activeCategory === null}
          icon={<Film className="w-3 h-3" />}
          label={`সব মুভি (${movies.length})`}
          onClick={() => setActiveCategory(null)}
        />
        {categories.map(cat => (
          <CategoryPill
            key={cat}
            active={activeCategory === cat}
            icon={getCategoryIcon(cat)}
            label={`${cat} (${categoryCounts[cat] || 0})`}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>
    </div>
  );

  // ── Prev/Next nav ─────────────────────────────────────────────────────────
  const NavBar = () => (
    <div className="flex items-center justify-between gap-2 mt-2">
      <button
        onClick={() => canPrev && handleSelect(filtered[currentIndex - 1])}
        disabled={!canPrev}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
          ${canPrev
            ? "border-border text-foreground hover:bg-muted hover:border-primary/40 active:scale-95"
            : "border-border/40 text-muted-foreground/30 cursor-not-allowed"
          }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Prev
      </button>
      {activeMovie && (
        <span className="text-[10px] text-muted-foreground truncate max-w-[160px] text-center hidden sm:block">
          {currentIndex + 1} / {filtered.length}
        </span>
      )}
      <button
        onClick={() => canNext && handleSelect(filtered[currentIndex + 1])}
        disabled={!canNext}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
          ${canNext
            ? "border-border text-foreground hover:bg-muted hover:border-primary/40 active:scale-95"
            : "border-border/40 text-muted-foreground/30 cursor-not-allowed"
          }`}
      >
        Next <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  // ── Movie grid ────────────────────────────────────────────────────────────
  const Grid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
          {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3 text-center p-8">
          <Film className="w-12 h-12 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm">এই ক্যাটাগরিতে কোনো মুভি নেই</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
        {filtered.map((movie, i) => (
          <MovieCard
            key={`${movie.url}-${i}`}
            movie={movie}
            active={activeMovie?.url === movie.url}
            onClick={() => handleSelect(movie)}
          />
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
            {activeMovie
              ? <MoviePlayer key={activeMovie.url} movie={activeMovie} />
              : <HeroPlaceholder />
            }
            {activeMovie && (
              <>
                <div className="mt-2 px-0.5">
                  <p className="font-bold text-sm leading-tight truncate">{activeMovie.name}</p>
                  <p className="text-xs text-muted-foreground">{activeMovie.category}</p>
                </div>
                <NavBar />
              </>
            )}
          </div>
          <div className="bg-sidebar border-b border-sidebar-border">
            <CategoryStrip />
          </div>
        </div>
        <div className="bg-background">
          <Grid />
        </div>
      </div>
    );
  }

  // ── DESKTOP layout ────────────────────────────────────────────────────────
return (
  <div className="flex overflow-hidden" style={{ height: "calc(100dvh - var(--navbar-h))" }}>
    {/* Left panel: player */}
    <div className="w-[45%] xl:w-[48%] flex flex-col border-r border-border overflow-hidden bg-background p-4">
      <AnimatePresence mode="wait">
        {activeMovie ? (
          <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MoviePlayer movie={activeMovie} />
            <div className="mt-2.5 flex items-center gap-2.5">
              {activeMovie.logo && (
                <img
                  src={activeMovie.logo}
                  alt=""
                  className="w-10 h-14 object-cover rounded bg-muted/30 shrink-0"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight truncate">{activeMovie.name}</p>
                <p className="text-xs text-muted-foreground">{activeMovie.category}</p>
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
                {loading ? "মুভি লোড হচ্ছে..." : `${movies.length}+ মুভি স্ট্রিমিং`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Right panel: Top fixed Categories + Movie Grid */}
    <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
      {/* Horizontally Fixed Categories Bar */}
      <HorizontalCategories
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryCounts={categoryCounts}
        totalMovies={movies.length}
      />

      {/* Grid Content Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">মুভি লোড হচ্ছে...</p>
          </div>
        ) : (
          <Grid />
        )}
      </div>
    </div>
  </div>
);
  
}
