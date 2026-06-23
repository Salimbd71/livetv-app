import React, { useState } from "react";
import { Mail, MessageSquare, Send, Shield, Phone, Facebook, Instagram } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            LiveTV71 নিয়ে আপনার কোনো মতামত, অভিযোগ বা বিজ্ঞাপনের জন্য নিচের ফর্মটি পূরণ করুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl mx-auto">
          
          {/* Left Column: Contact Info & Socials */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct Contact Cards */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-5 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight">যোগাযোগের মাধ্যম</h2>
              
              {/* Call Me Button */}
              <a 
                href="tel:+8801737462871" 
                className="flex items-center gap-4 group p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground">সরাসরি কল করুন</h3>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">01737462871</p>
                </div>
              </a>

              {/* WhatsApp Button */}
              <a 
                href="https://wa.me/8801737462871" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 group p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {/* MessageSquare used as WhatsApp placeholder icon */}
                  <MessageSquare className="h-5 w-5" /> 
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground">হোয়াটসঅ্যাপ (WhatsApp)</h3>
                  <p className="text-sm font-medium text-foreground group-hover:text-green-500 transition-colors">01737462871</p>
                </div>
              </a>

              {/* Email Card */}
              <div className="flex items-center gap-4 p-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground">ইমেইল করুন</h3>
                  <a href="mailto:salimbd.ga@gmail.com" className="text-sm font-medium text-foreground hover:text-primary transition-colors break-all">
                    salimbd.ga@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight">সোশ্যাল মিডিয়া</h2>
              <div className="grid grid-cols-2 gap-3">
                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/salim.naogaom" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-background hover:bg-blue-500/10 hover:border-blue-500/30 text-muted-foreground hover:text-blue-500 transition-all text-sm font-medium"
                >
                  <Facebook className="h-4 w-4 shrink-0" />
                  <span>Facebook</span>
                </a>

                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/salim.naogaon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-background hover:bg-pink-500/10 hover:border-pink-500/30 text-muted-foreground hover:text-pink-500 transition-all text-sm font-medium"
                >
                  <Instagram className="h-4 w-4 shrink-0" />
                  <span>Instagram</span>
                </a>
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
              
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">আপনার নাম</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: মোঃ সেলিম"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">ইমেইল অ্যাড্রেস</label>
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

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-muted-foreground">আপনার বার্তা বা মতামত</label>
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
