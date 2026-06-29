import React, { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";
import { Maximize, AlertCircle, Loader2, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  channel: {
    name: string;
    url: string;
    category: string;
    logo?: string;
  };
}

const LOAD_TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;

export function VideoPlayer({ channel }: VideoPlayerProps) {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status, setStatus] = useState<"loading" | "playing" | "error">("loading");
  const [retryKey, setRetryKey] = useState(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const showError = useCallback(() => {
    clearTimer();
    setStatus("error");
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel?.url) return;

    setStatus("loading");
    clearTimer();

    let networkRetries = 0;
    let mediaRetries = 0;

    // Start timeout — if no manifest in 15s, give up
    timerRef.current = setTimeout(() => {
      showError();
    }, LOAD_TIMEOUT_MS);

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 20,
        maxMaxBufferLength: 300,
        enableWorker: true,
      });
      hlsRef.current = hls;

      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        clearTimer();
        setStatus("playing");
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          if (networkRetries < MAX_RETRIES) {
            networkRetries++;
            hls.startLoad();
          } else {
            showError();
          }
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          if (mediaRetries < MAX_RETRIES) {
            mediaRetries++;
            hls.recoverMediaError();
          } else {
            showError();
          }
        } else {
          showError();
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = channel.url;

      const onLoaded = () => {
        clearTimer();
        setStatus("playing");
        video.play().catch(() => {});
      };
      const onError = () => showError();

      video.addEventListener("loadedmetadata", onLoaded, { once: true });
      video.addEventListener("error", onError, { once: true });

      return () => {
        clearTimer();
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("error", onError);
      };
    } else {
      // Browser can't play HLS at all
      showError();
    }

    return () => {
      clearTimer();
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [channel.url, retryKey, showError]);

  const handleRetry = () => {
    setStatus("loading");
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

  const errorTitle = language === "bn" ? "চ্যানেল কাজ করছে না" : "Channel Not Working";
  const errorSub = language === "bn" ? "এই মুহূর্তে স্ট্রিম পাওয়া যাচ্ছে না" : "Stream unavailable right now";
  const retryLabel = language === "bn" ? "আবার চেষ্টা করুন" : "Try Again";

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border/50 group"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
        controls={status === "playing"}
        playsInline
      />

      {/* Loading overlay */}
      <AnimatePresence>
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 gap-3"
          >
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-white/70 text-sm font-medium">
              {language === "bn" ? "লোড হচ্ছে..." : "Loading stream..."}
            </p>
            <p className="text-white/40 text-xs">{channel.name.trim()}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error overlay */}
      <AnimatePresence>
        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md z-20 gap-4 p-6"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center">
              <WifiOff className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-base mb-1">{errorTitle}</p>
              <p className="text-white/50 text-xs">{errorSub}</p>
            </div>
            <Button
              onClick={handleRetry}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              {retryLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover info overlay (top gradient) */}
      {status === "playing" && (
        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            {channel.logo && (
              <div className="w-8 h-8 rounded bg-white/10 p-0.5 flex items-center justify-center overflow-hidden">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-full h-full object-contain"
                  onError={e => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
            <div>
              <p className="text-white font-bold text-sm leading-tight">{channel.name.trim()}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white/70 text-[10px] uppercase tracking-wider font-semibold">{t("LIVE")}</span>
              </div>
            </div>
          </div>
          <button
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20 rounded p-1.5 transition-colors pointer-events-auto"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
