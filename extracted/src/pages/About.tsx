import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tv, Zap, Globe, Shield, Smartphone, Radio, Heart, Star, Wifi, Clock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Tv className="w-6 h-6" />,
    titleEn: "161+ Live Channels",
    titleBn: "১৬১+ লাইভ চ্যানেল",
    descEn: "Watch over 161 live TV channels from Bangladesh and around the world, including news, entertainment, sports, Islamic content, and more.",
    descBn: "বাংলাদেশ ও বিশ্বের ১৬১টিরও বেশি লাইভ টিভি চ্যানেল দেখুন — সংবাদ, বিনোদন, খেলাধুলা, ইসলামিক বিষয়বস্তু এবং আরও অনেক কিছু।",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    titleEn: "HLS M3U8 Streaming",
    titleBn: "HLS M3U8 স্ট্রিমিং",
    descEn: "Powered by HLS.js technology for smooth, adaptive M3U8 live streaming. Channels automatically recover from network interruptions.",
    descBn: "HLS.js প্রযুক্তি দ্বারা পরিচালিত মসৃণ M3U8 লাইভ স্ট্রিমিং। নেটওয়ার্ক বিচ্ছিন্নতা থেকে চ্যানেল স্বয়ংক্রিয়ভাবে পুনরুদ্ধার হয়।",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    titleEn: "Bangla & English UI",
    titleBn: "বাংলা ও ইংরেজি ইন্টারফেস",
    descEn: "Full bilingual support — switch between Bangla and English at any time with a single tap. Designed with Bengali viewers in mind.",
    descBn: "সম্পূর্ণ দ্বিভাষিক সমর্থন — যেকোনো সময় একটি ট্যাপে বাংলা ও ইংরেজির মধ্যে পরিবর্তন করুন।",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    titleEn: "Dark & Light Mode",
    titleBn: "ডার্ক ও লাইট মোড",
    descEn: "A cinematic dark mode for late-night viewing and a clean light mode for daytime use. Your preference is saved automatically.",
    descBn: "রাতের দেখার জন্য সিনেমাটিক ডার্ক মোড এবং দিনের ব্যবহারের জন্য পরিষ্কার লাইট মোড। আপনার পছন্দ স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    titleEn: "Favorites",
    titleBn: "পছন্দের তালিকা",
    descEn: "Save your most-watched channels to a Favorites list for instant access. Favorites are stored in your browser and always available.",
    descBn: "তাৎক্ষণিক অ্যাক্সেসের জন্য আপনার সর্বাধিক দেখা চ্যানেলগুলি পছন্দের তালিকায় সংরক্ষণ করুন।",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    titleEn: "Fully Responsive",
    titleBn: "সম্পূর্ণ রেসপন্সিভ",
    descEn: "Optimized for all screen sizes — mobile, tablet, and desktop. The video player stays pinned so you can browse channels while watching.",
    descBn: "সকল স্ক্রিন সাইজের জন্য অপ্টিমাইজড — মোবাইল, ট্যাবলেট এবং ডেস্কটপ। দেখার সময় চ্যানেল ব্রাউজ করতে ভিডিও প্লেয়ার পিন থাকে।",
  },
  {
    icon: <Radio className="w-6 h-6" />,
    titleEn: "Multiple Categories",
    titleBn: "একাধিক ক্যাটাগরি",
    descEn: "Channels organized into 10+ categories: Bangla, English News, Islamic, Kids, Documentary, Indian Bangla, Music, Sports, FM Radio, and more.",
    descBn: "১০+ ক্যাটাগরিতে সংগঠিত চ্যানেল: বাংলা, ইংরেজি সংবাদ, ইসলামিক, শিশু, ডকুমেন্টারি, ইন্ডিয়ান বাংলা, সংগীত, খেলাধুলা, FM রেডিও এবং আরও।",
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    titleEn: "Live Stream Recovery",
    titleBn: "লাইভ স্ট্রিম রিকভারি",
    descEn: "Smart error handling automatically retries failed streams. If a stream is unavailable, you get a clear message with a retry option.",
    descBn: "স্মার্ট এরর হ্যান্ডেলিং স্বয়ংক্রিয়ভাবে ব্যর্থ স্ট্রিম পুনরায় চেষ্টা করে।",
  },
  {
    icon: <Star className="w-6 h-6" />,
    titleEn: "Instant Search",
    titleBn: "তাৎক্ষণিক অনুসন্ধান",
    descEn: "Real-time channel search filters results as you type. Find any channel instantly across all categories.",
    descBn: "রিয়েল-টাইম চ্যানেল অনুসন্ধান টাইপ করার সাথে সাথে ফলাফল ফিল্টার করে। সকল ক্যাটাগরি জুড়ে যেকোনো চ্যানেল তাৎক্ষণিকভাবে খুঁজুন।",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    titleEn: "Always Free",
    titleBn: "সর্বদা বিনামূল্যে",
    descEn: "LiveTV71 is completely free to use — no subscriptions, no sign-up required. Just open and watch.",
    descBn: "LiveTV71 ব্যবহার সম্পূর্ণ বিনামূল্যে — কোনো সাবস্ক্রিপশন নেই, সাইন-আপের প্রয়োজন নেই। শুধু খুলুন এবং দেখুন।",
  },
];

export default function About() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/15 rounded-2xl mb-6 shadow-lg shadow-primary/20">
              <Tv className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              {language === "en" ? (
                <>About <span className="text-primary">LiveTV71</span></>
              ) : (
                <><span className="text-primary">LiveTV71</span> সম্পর্কে</>
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {language === "en"
                ? "LiveTV71 is a free, fast, and beautiful IPTV web application for watching live TV channels — built with Bangladeshi viewers in mind."
                : "LiveTV71 হল একটি বিনামূল্যের, দ্রুত এবং সুন্দর IPTV ওয়েব অ্যাপ্লিকেশন যা বাংলাদেশী দর্শকদের কথা মাথায় রেখে তৈরি করা হয়েছে।"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
            {language === "en" ? "Features" : "বৈশিষ্ট্যসমূহ"}
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            {language === "en"
              ? "Everything you need for a great live TV experience"
              : "একটি দুর্দান্ত লাইভ টিভি অভিজ্ঞতার জন্য আপনার যা প্রয়োজন"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * idx }}
              className="bg-card border border-card-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-bold text-base mb-2 text-card-foreground">
                {language === "en" ? feature.titleEn : feature.titleBn}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === "en" ? feature.descEn : feature.descBn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="border-t border-border bg-card/30">
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground mb-3 font-medium uppercase tracking-widest">
            {language === "en" ? "Built with" : "তৈরিতে ব্যবহৃত প্রযুক্তি"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["React", "TypeScript", "HLS.js", "Tailwind CSS", "Framer Motion", "Vite"].map((tech) => (
              <span key={tech} className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground/70">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
