import { useState, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
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

  // Featured/Random Channels (ডান পাশের সাইডবারের জন্য ফিক্সড ৩-৪টি চ্যানেল)
  const featuredChannels = useMemo(() => {
    return channels.slice(0, 4); // এখানে আপনার ইচ্ছামতো র‍্যান্ডমাইজ বা স্লাইস করতে পারেন
  }, []);

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
          {activeCategory === "⭐ Favorites" ? "কোনো ফেভারিট চ্যানেল নেই।" : "কোনো চ্যানেল পাওয়া যায়নি।"}
        </p>
      )}
    </>
  );

  // ডানপাশের ফিচার্ড কলামের কন্টেন্ট
  const featuredSection = (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Featured Channels</h3>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
        {featuredChannels.map((channel, i) => (
          <ChannelCard
            key={`featured-${channel.url}-${i}`}
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
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-4">
        
        {/* ─── DESKTOP MODE (৩-কলাম লেআউট) ─── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT: Scrollable Category (কলাম ২) */}
          <aside className="lg:col-span-2 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Categories</h3>
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onSelect={setActiveCategory}
              layout="vertical" // যদি আপনার কম্পোনেন্ট ভার্টিকাল সাপোর্ট করে, না হলে এটা নরমাল থাকবে
            />
          </aside>

          {/* MIDDLE: Player or Banner + Grid (কলাম ৮) */}
          <section className="lg:col-span-8 space-y-4">
            {selectedChannel ? (
              <div className="sticky top-4 z-40">
                {playerSection}
              </div>
            ) : (
              <div className="relative w-full overflow-hidden rounded-xl border border-border animate-slide-up">
                <img src={heroBanner} alt="Live TV" className="w-full h-auto object-cover" />
              </div>
            )}
            
            {/* সার্চবার এবং মেইন চ্যানেল গ্রিড */}
            <div className="space-y-3 pt-2">
              {searchBar}
              {channelGrid("grid-cols-3 xl:grid-cols-4")}
            </div>
          </section>

          {/* RIGHT: Featured/Random Channels (কলাম ২) */}
          <aside className="lg:col-span-2 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pl-1">
            {featuredSection}
          </aside>
        </div>

        {/* ─── MOBILE & TABLET MODE (আগের মতই ঠিক থাকবে) ─── */}
        <div className="lg:hidden space-y-4">
          {!selectedChannel && (
            <div className="relative w-full overflow-hidden rounded-xl border border-border">
              <img src={heroBanner} alt="Live TV" className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="space-y-3">
            {selectedChannel && playerSection}
            {searchBar}
            <CategoryFilter categories={categories} active={activeCategory} onSelect={setActiveCategory} />
            {channelGrid(selectedChannel ? "grid-cols-3" : "grid-cols-4 md:grid-cols-5")}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Index;
        
