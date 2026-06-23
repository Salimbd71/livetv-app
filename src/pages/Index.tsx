import { useState, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";
// import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import ChannelCard from "@/components/ChannelCard";
import CategoryFilter from "@/components/CategoryFilter";
import heroBanner from "@/assets/hero-broadcast.jpg";
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

const uniqueCategories = Array.from(new Set(channels.map((c) => c.category)));
const categories = ["FIFA Live", "All", "⭐ Favorites", ...uniqueCategories.filter((c) => c !== "FIFA Live")];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);

  const toggleFavorite = useCallback((url: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      saveFavorites(next);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    let result: Channel[];
    if (activeCategory === "⭐ Favorites") {
      result = channels.filter((c) => favorites.has(c.url));
    } else if (activeCategory === "All") {
      result = channels;
    } else {
      result = channels.filter((c) => c.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.channel?.toLowerCase().includes(q) ?? false)
      );
    }
    return result;
  }, [activeCategory, searchQuery, favorites]);

  const idx = selectedChannel ? filtered.findIndex((c) => c.url === selectedChannel.url) : -1;
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < filtered.length - 1;

  const playerSection = selectedChannel && (
    <VideoPlayer
      url={selectedChannel.url}
      name={selectedChannel.channel || selectedChannel.name}
      logo={selectedChannel.logo}
      onClose={() => setSelectedChannel(null)}
      onPrev={hasPrev ? () => setSelectedChannel(filtered[idx - 1]) : undefined}
      onNext={hasNext ? () => setSelectedChannel(filtered[idx + 1]) : undefined}
      hasPrev={hasPrev}
      hasNext={hasNext}
    />
  );

  const searchBar = (
    <div className="flex items-center gap-3">
      <h2 className="text-lg font-bold text-foreground whitespace-nowrap">
        চ্যানেল ({filtered.length})
      </h2>
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="চ্যানেল খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full bg-secondary pl-9 pr-8 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  const categoryBar = (
    <CategoryFilter
      categories={categories}
      active={activeCategory}
      onSelect={setActiveCategory}
    />
  );

  const channelGrid = (cols: string) => (
    <>
      <div className={`grid ${cols} gap-2`}>
        {filtered.map((channel, i) => (
          <ChannelCard
            key={`${channel.url}-${i}`}
            name={channel.channel || channel.name}
            logo={channel.logo}
            category={channel.category}
            isActive={selectedChannel?.url === channel.url}
            isFavorite={favorites.has(channel.url)}
            onClick={() => setSelectedChannel(channel)}
            onToggleFavorite={() => toggleFavorite(channel.url)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          {activeCategory === "⭐ Favorites" ? "কোনো ফেভারিট চ্যানেল নেই। হার্ট আইকনে ক্লিক করে যোগ করুন।" : "কোনো চ্যানেল পাওয়া যায়নি।"}
        </p>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
     // <Navbar/>
      <main className="container py-4 space-y-4">
        {/* Hero Banner */}
        {!selectedChannel && (
          <section className="animate-slide-up">
            <div className="relative w-full overflow-hidden rounded-xl border border-border">
              <img
                src={heroBanner}
                alt="সম্পূর্ণ ফ্রিতে দেখুন সব ধরনের লাইভ টিভি"
                className="w-full h-auto object-cover"
              />
            </div>
          </section>
        )}

        {selectedChannel ? (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 xl:col-span-9 sticky top-2 z-40 self-start">
              {playerSection}
            </div>
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-2 space-y-3 lg:max-h-[calc(100vh-1rem)] lg:overflow-y-auto pr-1">
                {searchBar}
                {categoryBar}
                {channelGrid("grid-cols-3")}
              </div>
            </aside>
          </div>
        ) : (
          <section className="space-y-3">
            {searchBar}
            {categoryBar}
            {channelGrid("grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8")}
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
