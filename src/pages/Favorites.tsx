import { useState, useMemo, useCallback } from "react";
import { Heart } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelCard from "@/components/ChannelCard";
import channelsData from "@/data/channels.json";

interface Channel {
  name: string;
  channel?: string;
  logo: string;
  category: string;
  url: string;
}

const channels: Channel[] = channelsData;
const FAVORITES_KEY = "livetv_favorites";

const loadFavorites = (): Set<string> => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveFavorites = (favs: Set<string>) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs]));
};

const Favorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  // ফেভারিট থেকে রিমুভ করার ফাংশন
  const toggleFavorite = useCallback((url: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      saveFavorites(next);
      return next;
    });
  }, []);

  // শুধুমাত্র ফেভারিট চ্যানেলগুলো ফিল্টার করা
  const favoriteChannels = useMemo(() => {
    return channels.filter((c) => favorites.has(c.url));
  }, [favorites]);

  // প্লেয়ার নেভিগেশনের জন্য ইনডেক্স হিসাব
  const idx = selectedChannel ? favoriteChannels.findIndex((c) => c.url === selectedChannel.url) : -1;
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < favoriteChannels.length - 1;

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-4">
      <div className="container max-w-7xl mx-auto space-y-6">
        
        {/* ভিডিও প্লেয়ার সেকশন */}
        {selectedChannel && (
          <div className="max-w-4xl mx-auto mb-6 animate-fade-in">
            <VideoPlayer
              url={selectedChannel.url}
              name={selectedChannel.channel || selectedChannel.name}
              logo={selectedChannel.logo}
              onClose={() => setSelectedChannel(null)}
              onPrev={hasPrev ? () => setSelectedChannel(favoriteChannels[idx - 1]) : undefined}
              onNext={hasNext ? () => setSelectedChannel(favoriteChannels[idx + 1]) : undefined}
              hasPrev={hasPrev}
              hasNext={hasNext}
            />
          </div>
        )}

        {/* হেডার সেকশন */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Heart className="h-6 w-6 text-destructive fill-destructive" />
          <h1 className="text-2xl font-bold tracking-tight">
            পছন্দের তালিকা ({favoriteChannels.length})
          </h1>
        </div>

        {/* চ্যানেল গ্রিড */}
        {favoriteChannels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {favoriteChannels.map((channel, i) => (
              <ChannelCard
                key={`${channel.url}-${i}`}
                name={channel.channel || channel.name}
                logo={channel.logo}
                category={channel.category}
                isActive={selectedChannel?.url === channel.url}
                isFavorite={true}
                onClick={() => setSelectedChannel(channel)}
                onToggleFavorite={() => toggleFavorite(channel.url)}
              />
            ))}
          </div>
        ) : (
          /* ফেভারিট খালি থাকলে এই মেসেজটি দেখাবে */
          <div className="text-center py-16 space-y-2">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto stroke-[1.5]" />
            <p className="text-base font-medium text-muted-foreground">
              আপনার পছন্দের তালিকায় কোনো চ্যানেল নেই।
            </p>
            <p className="text-sm text-muted-foreground/70">
              হোম পেজ থেকে চ্যানেলগুলোর হার্ট আইকনে ক্লিক করে এখানে যোগ করতে পারেন।
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Favorites;
          
