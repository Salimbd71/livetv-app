import React, { useState, useEffect, useRef } from "react";
import { Maximize, WifiOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface MoviePlayerProps {
  movie: {
    name: string;
    url: string;
    category: string;
    logo?: string;
  };
}

// ── Module-level playback state cache ─────────────────────────────────────
// Survives component unmount/remount (layout switches, orientation changes).
// Keyed by movie URL so we restore the right position.
const _playbackCache: Record<string, { time: number; paused: boolean }> = {};

function savePlayback(url: string, video: HTMLVideoElement) {
  if (!url || video.readyState < 1 || video.error) return;
  _playbackCache[url] = { time: video.currentTime, paused: video.paused };
}

function restorePlayback(url: string, video: HTMLVideoElement) {
  const saved = _playbackCache[url];
  if (!saved || saved.time < 0.5) return; // don't bother for < 0.5s
  video.currentTime = saved.time;
}
// ──────────────────────────────────────────────────────────────────────────

export function MoviePlayer({ movie }: MoviePlayerProps) {
  const { t } = useLanguage();
  const videoRef      = useRef<HTMLVideoElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track which URL we initialised so we can skip duplicate inits
  const initUrlRef    = useRef<string>("");
  const retryKeyRef   = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(false);
  const [retryKey, setRetryKey]   = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !movie?.url) return;

    const url = movie.url;

    // ── Skip re-init when layout flips (same URL, no retry) ──────────────
    // If the video element already has our src loaded and is playing/paused
    // normally (no error), just let it continue — don't restart.
    const isRetry = retryKey !== retryKeyRef.current;
    retryKeyRef.current = retryKey;

    if (
      !isRetry &&
      initUrlRef.current === url &&
      video.readyState >= 2 &&   // HAVE_CURRENT_DATA or better
      !video.error
    ) {
      // Already loaded & playing the correct URL — nothing to do.
      setIsLoading(false);
      setError(false);
      return;
    }

    // ── Full initialisation ───────────────────────────────────────────────
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setError(false);
    setIsLoading(true);
    initUrlRef.current = url;

    // Stop previous playback cleanly (without wiping the DOM element)
    try {
      video.pause();
    } catch (_) {}

    video.src = url;
    video.load();

    const onCanPlay = () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      // Restore saved position (if the user had watched part of this movie)
      restorePlayback(url, video);
      setIsLoading(false);
      setError(false);
      video.play().catch(() => {});
    };

    const onError = () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setIsLoading(false);
      setError(true);
    };

    const onWaiting  = () => setIsLoading(true);
    const onPlaying  = () => setIsLoading(false);

    // 12-second timeout before showing error
    errorTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setError(true);
    }, 12000);

    video.addEventListener("canplay",  onCanPlay);
    video.addEventListener("error",    onError);
    video.addEventListener("waiting",  onWaiting);
    video.addEventListener("playing",  onPlaying);

    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      video.removeEventListener("canplay",  onCanPlay);
      video.removeEventListener("error",    onError);
      video.removeEventListener("waiting",  onWaiting);
      video.removeEventListener("playing",  onPlaying);

      // ── Save playback position before unmount ─────────────────────────
      // This preserves the position across layout switches (orientation,
      // desktop ↔ mobile) so the video resumes from the same point.
      savePlayback(url, video);

      // Pause gently — do NOT remove src or call load().
      // Removing src forces a full reload; we avoid that so that if the same
      // component remounts quickly the browser may reuse the buffered data.
      try { video.pause(); } catch (_) {}
    };
  }, [movie.url, retryKey]);

  const handleRetry = () => {
    setError(false);
    setIsLoading(true);
    // Clear cached state so retry starts fresh
    delete _playbackCache[movie.url];
    initUrlRef.current = "";
    setRetryKey(k => k + 1);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border/50 group"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        playsInline
        preload="auto"
      />

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-10 gap-3 pointer-events-none"
          >
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-white/70 text-xs tracking-wide">{t("Loading...")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error overlay */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md z-20 gap-3 px-6 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center">
              <WifiOff className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <p className="text-white font-bold text-base">{t("Movie could not be played")}</p>
              <p className="text-white/50 text-xs mt-1">{t("The movie stream may be offline or unavailable")}</p>
            </div>
            <Button onClick={handleRetry} size="sm" className="mt-1 gap-2">
              <Loader2 className="w-3.5 h-3.5" />
              {t("Try Again")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover info bar */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="flex items-center gap-2.5">
          {movie.logo && (
            <div className="w-8 h-12 rounded bg-white/10 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={movie.logo}
                alt={movie.name}
                className="w-full h-full object-cover"
                onError={e => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
          <div>
            <h2 className="text-white font-bold text-sm leading-tight">{movie.name}</h2>
           <span className="text-white/60 text-xs">{t(movie.category)}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 pointer-events-auto w-8 h-8"
          onClick={toggleFullscreen}
          title="Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
