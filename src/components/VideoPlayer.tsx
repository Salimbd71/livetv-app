import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  PictureInPicture2,
} from "lucide-react";

interface VideoPlayerProps {
  url: string;
  name: string;
  logo: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const VideoPlayer = ({
  url,
  name,
  logo,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekStart, setSeekStart] = useState(0);
  const [seekEnd, setSeekEnd] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);

  const loadStream = (u: string) => {
    const video = videoRef.current;
    if (!video) return;
    setError(null);
    setLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        liveSyncDurationCount: 6,
      });
      hlsRef.current = hls;
      hls.loadSource(u);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        if (isPlaying) {
          video.play().catch(() => {});
        }
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          setLoading(false);
          setError(
            data.type === Hls.ErrorTypes.NETWORK_ERROR
              ? "নেটওয়ার্ক সমস্যা।"
              : "এই চ্যানেল এখন প্লে হচ্ছে না।"
          );
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = u;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        if (isPlaying) {
          video.play().catch(() => {});
        }
      });
      video.addEventListener("error", () => {
        setLoading(false);
        setError("এই চ্যানেল এখন প্লে হচ্ছে না।");
      });
    } else {
      setError("আপনার ব্রাউজার HLS সাপোর্ট করে না।");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStream(url);
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url]);

  const scheduleHide = () => {
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => {
      setIsPlaying(true);
      setShowControls(true);
      scheduleHide();
    };
    const onPause = () => {
      setIsPlaying(false);
      setShowControls(true);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
    const updateTimes = () => {
      setCurrentTime(v.currentTime);
      if (v.seekable.length > 0) {
        setSeekStart(v.seekable.start(0));
        setSeekEnd(v.seekable.end(v.seekable.length - 1));
      }
      if (v.buffered.length > 0) {
        setBufferedEnd(v.buffered.end(v.buffered.length - 1));
      }
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("playing", onPlay);
    v.addEventListener("timeupdate", updateTimes);
    v.addEventListener("progress", updateTimes);
    v.addEventListener("loadedmetadata", updateTimes);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("playing", onPlay);
      v.removeEventListener("timeupdate", updateTimes);
      v.removeEventListener("progress", updateTimes);
      v.removeEventListener("loadedmetadata", updateTimes);
    };
  }, []);

  useEffect(() => {
    const fs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fs);
    const v = videoRef.current;
    const enter = () => setIsPip(true);
    const leave = () => setIsPip(false);
    v?.addEventListener("enterpictureinpicture", enter);
    v?.addEventListener("leavepictureinpicture", leave);
    return () => {
      document.removeEventListener("fullscreenchange", fs);
      v?.removeEventListener("enterpictureinpicture", enter);
      v?.removeEventListener("leavepictureinpicture", leave);
    };
  }, []);

  // ⚠️ অডিও সহ ১০০% পারফেক্ট প্লে/পজ লজিক
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
      // লাইভ অডিও বাফার ফ্রিজ করতে hls স্টপ করা হলো
      if (hlsRef.current) hlsRef.current.stopLoad();
    } else {
      if (hlsRef.current) hlsRef.current.startLoad();
      v.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const changeVolume = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    setVolume(val);
    if (val > 0 && muted) {
      v.muted = false;
      setMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const togglePip = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await v.requestPictureInPicture();
      }
    } catch {
      /* noop */
    }
  };

  const revealControls = () => {
    setShowControls(true);
    scheduleHide();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
      className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-background"
    >
      <video
        ref={videoRef}
        onClick={togglePlay}
        className="h-full w-full object-contain bg-background"
        playsInline
        autoPlay
        muted={muted}
      />

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 pointer-events-none">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">로드 হচ্ছে...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-20">
          <p className="text-sm text-destructive mb-2">{error}</p>
          <button
            onClick={() => loadStream(url)}
            className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Top bar */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-b from-background/90 to-transparent transition-opacity ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {logo && (
            <img src={logo} alt={name} className="h-7 w-7 rounded object-contain bg-secondary flex-shrink-0" />
          )}
          <span className="text-sm font-semibold text-foreground truncate">{name}</span>
          <span className="rounded bg-live px-1.5 py-0.5 text-[10px] font-bold uppercase text-live-foreground animate-pulse-live flex-shrink-0">
            Live
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-secondary/80 p-1.5 text-foreground hover:bg-destructive transition flex-shrink-0"
          aria-label="বন্ধ"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Center controls */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-6 transition-opacity pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="pointer-events-auto rounded-full bg-background/60 p-2.5 text-foreground hover:bg-primary hover:text-primary-foreground transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SkipBack className="h-5 w-5" />
        </button>
        <button
          onClick={togglePlay}
          className="pointer-events-auto rounded-full bg-primary/90 p-4 text-primary-foreground hover:bg-primary transition shadow-lg"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="pointer-events-auto rounded-full bg-background/60 p-2.5 text-foreground hover:bg-primary hover:text-primary-foreground transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      {/* Bottom controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex flex-col gap-1 p-3 bg-gradient-to-t from-background/90 to-transparent transition-opacity ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-foreground hover:text-primary transition">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button onClick={onMute} className="text-foreground hover:text-primary transition">
            {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="hidden sm:block w-20 accent-primary"
          />
          <div className="flex-1" />
          <button onClick={togglePip} className="text-foreground hover:text-primary transition">
            <PictureInPicture2 className={`h-5 w-5 ${isPip ? "text-primary" : ""}`} />
          </button>
          <button onClick={toggleFullscreen} className="text-foreground hover:text-primary transition">
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
    
