import React, { useState, useEffect, useRef } from "react";
import { Maximize, WifiOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface MoviePlayerProps {
  movie: {
    name: string;
    url: string;
    category: string;
    logo?: string;
  };
}

export function MoviePlayer({ movie }: MoviePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // ১. ইউনিক স্টোরেজ কি (Storage Key)
  const storageKey = `movie_pos_${movie?.url}`;

  // ২. ভিডিওর বর্তমান সময় sessionStorage-এ সেভ রাখা
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime > 0) {
        sessionStorage.setItem(storageKey, video.currentTime.toString());
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [storageKey]);

  // ৩. স্ক্রিন ঘুরালে বা ডেস্কটপ মোডে সুইচ করলে ভিডিও লোড ও রেজুম লজিক
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !movie?.url) return;

    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setError(false);
    setIsLoading(true);

    const onCanPlay = () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setIsLoading(false);
      setError(false);

      // sessionStorage থেকে সেভ থাকা টাইম উদ্ধার করা
      const savedTime = sessionStorage.getItem(storageKey);
      if (savedTime) {
        const timeToSeek = parseFloat(savedTime);
        if (!isNaN(timeToSeek) && timeToSeek > 0) {
          video.currentTime = timeToSeek;
        }
      }

      video.play().catch(() => {});
    };

    const onError = () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      setIsLoading(false);
      setError(true);
    };

    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);

    errorTimerRef.current = setTimeout(() => {
      if (video.readyState < 3) {
        setIsLoading(false);
        setError(true);
      }
    }, 12000);

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);

    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
    };
  }, [movie.url, retryKey, storageKey]);

  // ৪. রিট্রাই বাটন প্রেস
  const handleRetry = () => {
    sessionStorage.removeItem(storageKey);
    setError(false);
    setIsLoading(true);
    setRetryKey((k) => k + 1);
  };

  // ৫. ফুলস্ক্রিন ও অরিয়েন্টেশন লজিক
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }

      if (screen.orientation && (screen.orientation as any).lock) {
        (screen.orientation as any).lock("landscape").catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }

      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border/50 group"
    >
      <video
        ref={videoRef}
        key={`${movie.url}-${retryKey}`}
        className="w-full h-full object-contain"
        controls
        playsInline
        preload="auto"
        autoPlay
      >
        <source src={movie.url} />
      </video>

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
            <p className="text-white/70 text-xs tracking-wide">লোড হচ্ছে...</p>
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
              <p className="text-white font-bold text-base">মুভি চালানো সম্ভব হয়নি</p>
              <p className="text-white/50 text-xs mt-1">স্ট্রিম অফলাইন বা অনুপলব্ধ হতে পারে</p>
            </div>
            <Button onClick={handleRetry} size="sm" className="mt-1 gap-2">
              <Loader2 className="w-3.5 h-3.5" />
              আবার চেষ্টা করুন
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
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
          <div>
            <h2 className="text-white font-bold text-sm leading-tight">{movie.name}</h2>
            <span className="text-white/60 text-xs">{movie.category}</span>
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
