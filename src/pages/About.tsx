import { Tv, ShieldCheck, Zap, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 text-center bg-gradient-to-b from-primary/10 via-transparent to-transparent">
        <div className="container max-w-3xl space-y-4 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 animate-fade-in">
            <Tv className="h-3.5 w-3.5" /> LiveTV71 স্ট্রিমিং প্ল্যাটফর্ম
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            বিনামূল্যে সরাসরি দেখুন আপনার প্রিয় চ্যানেল
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            LiveTV71 হলো একটি আধুনিক এবং দ্রুতগতির লাইভ টিভি স্ট্রিমিং প্ল্যাটফর্ম। কোনো রকম ঝামেলা বা বাফারিং ছাড়াই যেকোনো সময়, যেকোনো জায়গা থেকে সম্পূর্ণ ফ্রিতে দেশি-বিদেশি লাইভ চ্যানেল উপভোগ করুন।
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 px-4">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            কেন আমাদের প্ল্যাটফর্ম ব্যবহার করবেন?
          </h2>
          <p className="text-sm text-muted-foreground">
            সেরা স্ট্রিমিং অভিজ্ঞতার জন্য আমরা যুক্ত করেছি বেশ কিছু দারুণ ফিচার।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md hover:border-primary/50">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">হাই-স্পিড স্ট্রিমিং</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              লো-ইন্টারনেট স্পিডেও যেন বাফারিং ছাড়া চ্যানেল দেখতে পারেন, সেজন্য আমাদের সার্ভার বিশেষভাবে অপ্টিমাইজড।
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md hover:border-primary/50">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">১০০% নিরাপদ ও ফ্রি</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              কোনো সাবস্ক্রিপশন ফি বা হিডেন চার্জ নেই। কোনো প্রকার অ্যাকাউন্ট খোলা ছাড়াই সরাসরি দেখতে পারবেন।
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md hover:border-primary/50">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold mb-2">ফেভারিট লিস্ট</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              আপনার পছন্দের চ্যানেলগুলোকে খুব সহজেই স্টার (⭐) মার্ক করে আলাদা তালিকায় জমিয়ে রাখতে পারবেন।
            </p>
          </div>
        </div>
      </section>

      {/* Simple Stats Section */}
      <section className="container py-8 px-4 border-t border-border mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="p-4">
            <div className="text-3xl font-extrabold text-primary">৫০+</div>
            <div className="text-xs text-muted-foreground mt-1">লাইভ চ্যানেল</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-extrabold text-primary">২৪/৭</div>
            <div className="text-xs text-muted-foreground mt-1">অনলাইন সাপোর্ট</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-extrabold text-primary">১০৮০p</div>
            <div className="text-xs text-muted-foreground mt-1">এইচডি কোয়ালিটি</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-extrabold text-primary">০৳</div>
            <div className="text-xs text-muted-foreground mt-1">সম্পূর্ণ ফ্রি</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
      
