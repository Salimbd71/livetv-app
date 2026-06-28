import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tv, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface ChannelCardProps {
  channel: {
    name: string;
    logo?: string;
    category: string;
    url: string;
  };
  isActive: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export function ChannelCard({ channel, isActive, isFavorite, onSelect, onToggleFavorite }: ChannelCardProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`relative group cursor-pointer rounded-lg overflow-hidden bg-card border transition-all duration-200 flex flex-col h-full
        ${isActive
          ? "border-primary ring-2 ring-primary/40 shadow-[0_0_16px_rgba(230,0,0,0.35)] dark:shadow-[0_0_16px_rgba(230,0,0,0.45)]"
          : "border-card-border hover:border-primary/40 hover:shadow-md"
        }`}
      data-testid={`card-channel-${channel.name.replace(/\s+/g, "-")}`}
    >
      {/* Favorite button */}
      <button
        onClick={onToggleFavorite}
        className={`absolute top-1 right-1 z-10 p-1 rounded-full bg-background/60 backdrop-blur-sm transition-all hover:bg-background/90
          ${isFavorite ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"}`}
        data-testid={`btn-fav-${channel.name.replace(/\s+/g, "-")}`}
      >
        <Heart className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isFavorite ? "fill-current" : ""}`} />
      </button>

      {/* Logo area */}
      <div className="aspect-video w-full bg-muted/20 flex items-center justify-center p-2 md:p-4 overflow-hidden relative">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-center justify-center ${channel.logo ? "hidden" : "flex"}`}
        >
          <Tv className="w-6 h-6 md:w-10 md:h-10 text-muted-foreground/25" />
        </div>
      </div>

      {/* Info */}
      <div className="px-1.5 py-1.5 md:px-3 md:py-2 flex-1 flex flex-col gap-1">
        <h3 className="font-semibold text-card-foreground leading-tight line-clamp-2 text-[10px] md:text-sm">
          {channel.name.trim()}
        </h3>
        <div className="flex items-center gap-1 mt-auto">
          <span className={`inline-flex items-center gap-1 text-[8px] md:text-[10px] font-bold px-1 md:px-1.5 py-0.5 rounded uppercase tracking-wider
            ${isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
            <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isActive ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
            {t("LIVE")}
          </span>
        </div>
      </div>

      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
      )}
    </motion.div>
  );
}
