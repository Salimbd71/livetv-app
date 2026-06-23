import React, { useState } from "react";
import { Mail, MessageSquare, Send, Globe, Shield } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে আপনার ফর্ম সাবমিট লজিক বা API কল যুক্ত করতে পারেন
    alert(`ধন্যবাদ ${formData.name}! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে।`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            LiveTV71 নিয়ে আপনার কোনো মতামত, অভিযোগ বা বিজ্ঞাপনের জন্য নিচের ফর্মটি পূরণ করুন অথবা সরাসরি আমাদের ইমেইল করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl mx-auto">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <h2 className="text-xl font-bold tracking-tight">যোগাযোগের মাধ্যম</h2>
              
              {/* Email Card */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">সরাসরি ইমেইল করুন</h3>
                  <a 
                    href="mailto:salimbd.ga@gmail.com" 
                    className="text-base font-medium text-primary hover:underline break-all"
                  >
                    salimbd.ga@gmail.com
                  </a>
                </div>
              </div>

              {/* Support Card */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">অনলাইন সাপোর্ট</h3>
                  <p className="text-sm text-foreground font-medium">
                    আমরা সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে উত্তর দিয়ে থাকি।
                  </p>
                </div>
              </div>

              {/* Platform Status */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">নিরাপত্তা ও পলিসি</h3>
                  <p className="text-sm text-foreground font-medium">
                    আপনার পাঠানো সমস্ত তথ্য সম্পূর্ণ নিরাপদ ও গোপন রাখা হবে।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <form 
              onSubmit={handleSubmit} 
              className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm"
            >
              <h2 className="text-xl font-bold tracking-tight mb-2">বার্তা পাঠান</h2>
              
              {/* Name Input */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন:সেলিম "
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  ইমেইল অ্যাড্রেস
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sakib@example.com"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                />
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                  আপনার বার্তা বা মতামত
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="এখানে বিস্তারিত লিখুন..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Send className="h-4 w-4" /> বার্তা পাঠান
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
            
