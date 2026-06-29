import React from "react";
import { ChannelCard } from "./ChannelCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tv } from "lucide-react";
import { motion } from "framer-motion";

interface Channel {
  name: string;
  url: string;
  category: string;
  logo?: string;
}

interface ChannelGridProps {
  channels: Channel[];
  activeChannelName: string | null;
  onSelect: (channel: Channel) => void;
  favorites: string[];
  toggleFavorite: (channelName: string) => void;
}

export function ChannelGrid({ channels, activeChannelName, onSelect, favorites, toggleFavorite }: ChannelGridProps) {
  const { t } = useLanguage();

  if (channels.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-50">
        <Tv className="w-16 h-16 mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">{t("No channels found")}</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-5 w-full">
      <div className="flex justify-between items-center mb-3 md:mb-5 px-1">
        <h2 className="text-base md:text-lg font-bold tracking-tight">{t("channels")}</h2>
        <span className="text-xs text-muted-foreground font-medium">{channels.length} {t("channels")}</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
        {channels.map((channel, idx) => (
          <motion.div
            key={channel.name + idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.03, 0.5), duration: 0.25 }}
          >
            <ChannelCard
              channel={channel}
              isActive={activeChannelName === channel.name}
              isFavorite={favorites.includes(channel.name)}
              onSelect={() => onSelect(channel)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                toggleFavorite(channel.name);
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
