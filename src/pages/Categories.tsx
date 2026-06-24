import { useNavigate } from "react-router-dom";
import { ChevronRight, Tv, Radio, Trophy, Film, Globe, Heart } from "lucide-react";
import channelsData from "@/data/channels.json";

interface Channel {
  category: string;
}

const channels: Channel[] = channelsData;

// ইউনিক ক্যাটাগরিগুলো বের করা (FIFA Live কে সবার ওপরে রাখার জন্য)
const uniqueCategories = Array.from(new Set(channels.map((c) => c.category)));
const orderedCategories = [
  "FIFA Live",
  "⭐ Favorites",
  ...uniqueCategories.filter((c) => c !== "FIFA Live")
];

// ক্যাটাগরি অনুযায়ী সুন্দর আইকন সেট করার ফাংশন
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "fifa live":
    case "sports":
    case "খেলাধুলা":
      return <Trophy className="h-5 w-5 text-amber-500" />;
    case "⭐ favorites":
      return <Heart className="h-5 w-5 text-destructive fill-destructive" />;
    case "news":
    case "খবর":
      return <Globe className="h-5 w-5 text-blue-500" />;
    case "movies":
    case "বিনোদন":
      return <Film className="h-5 w-5 text-purple-500" />;
    case "music":
    case "গান":
      return <Radio className="h-5 w-5 text-pink-500" />;
    default:
      return <Tv className="h-5 w-5 text-primary" />;
  }
};

const Categories = () => {
  const navigate = useNavigate();

  // ক্যাটাগরিতে ক্লিক করলে হোম পেজে নিয়ে যাবে এবং সেই ক্যাটাগরি একটিভ করবে
  const handleCategoryClick = (category: string) => {
    // এখানে আমরা হোম পেজে স্টেট বা কুয়েরি প্যারামিটার পাঠাতে পারি
    // আপাতত সরাসরি হোম পেজে রিডাইরেক্ট করা হচ্ছে
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="container max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            সব ক্যাটাগরি ({orderedCategories.length})
          </h1>
          <p className="text-sm text-muted-foreground">
            আপনার পছন্দের ক্যাটাগরি বেছে নিন এবং সরাসরি লাইভ স্ট্রিমিং উপভোগ করুন।
          </p>
        </div>

        {/* Vertical Category List */}
        <div className="flex flex-col gap-2">
          {orderedCategories.map((category, index) => {
            // এই ক্যাটাগরিতে কয়টি চ্যানেল আছে তা গণনা করা
            const channelCount = category === "⭐ Favorites" 
              ? "Favs" 
              : channels.filter((c) => c.category === category).length;

            return (
              <button
                key={`${category}-${index}`}
                onClick={() => handleCategoryClick(category)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm hover:border-primary/40 hover:bg-secondary/20 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Container */}
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(category)}
                  </div>
                  
                  {/* Category Name */}
                  <div>
                    <h2 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                      {category}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {category === "⭐ Favorites" ? "আপনার সংরক্ষিত তালিকা" : `${channelCount}টি চ্যানেল আছে`}
                    </p>
                  </div>
                </div>

                {/* Right Arrow */}
                <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Categories;
