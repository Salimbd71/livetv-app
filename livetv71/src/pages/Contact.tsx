import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SiFacebook, SiInstagram, SiWhatsapp, SiGithub, SiYoutube } from "react-icons/si";
import { motion } from "framer-motion";

const PHONE = "01737462871";
const FB = "https://fb.com/salim.naogaon";
const IG = "https://instagram.com/salim.naogaon";
const WA = `https://wa.me/88${PHONE}`;

export default function Contact() {
  const { language } = useLanguage();

  const socialLinks = [
    {
      icon: <SiFacebook className="w-5 h-5" />,
      label: "Facebook",
      handle: "salim.naogaon",
      href: FB,
      color: "hover:text-blue-500 hover:border-blue-500/40 hover:bg-blue-500/10",
    },
    {
      icon: <SiInstagram className="w-5 h-5" />,
      label: "Instagram",
      handle: "salim.naogaon",
      href: IG,
      color: "hover:text-pink-500 hover:border-pink-500/40 hover:bg-pink-500/10",
    },
    {
      icon: <SiWhatsapp className="w-5 h-5" />,
      label: "WhatsApp",
      handle: PHONE,
      href: WA,
      color: "hover:text-green-500 hover:border-green-500/40 hover:bg-green-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 py-14 md:py-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/15 rounded-2xl mb-6 shadow-lg shadow-primary/20">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              {language === "en" ? (
                <>Get in <span className="text-primary">Touch</span></>
              ) : (
                <><span className="text-primary">যোগাযোগ</span> করুন</>
              )}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {language === "en"
                ? "Have a question, suggestion, or issue? Reach out — we're here to help."
                : "কোনো প্রশ্ন, পরামর্শ বা সমস্যা আছে? যোগাযোগ করুন — আমরা সাহায্য করতে প্রস্তুত।"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Developer card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-xl mb-10"
        >
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

          <div className="p-7 md:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 shrink-0 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
                <span className="text-3xl font-black text-primary select-none">S</span>
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  {language === "en" ? "Developer" : "ডেভেলপার"}
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1">
                  Md. Salim Hossain
                </h2>
                <p className="text-muted-foreground text-sm mb-5">
                  {language === "en"
                    ? "Full-Stack Developer · IPTV Enthusiast"
                    : "ফুল-স্ট্যাক ডেভেলপার · IPTV উৎসাহী"}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                  <a
                    href={`tel:+88${PHONE}`}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 active:scale-95 text-sm"
                    data-testid="btn-call"
                  >
                    <Phone className="w-4 h-4" />
                    {language === "en" ? "Call Me" : "ফোন করুন"}
                  </a>
                  <a
                    href={WA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-green-500 transition-all shadow-md shadow-green-600/30 hover:shadow-lg hover:shadow-green-500/40 active:scale-95 text-sm"
                    data-testid="btn-whatsapp"
                  >
                    <SiWhatsapp className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
        >
          <div className="bg-card border border-card-border rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
                {language === "en" ? "Phone / Call" : "ফোন / কল"}
              </p>
              <a href={`tel:+88${PHONE}`} className="font-bold text-foreground hover:text-primary transition-colors text-sm">
                +88 {PHONE}
              </a>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 shrink-0">
              <SiWhatsapp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">WhatsApp</p>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:text-green-500 transition-colors text-sm">
                +88 {PHONE}
              </a>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center">
            {language === "en" ? "Follow on Social" : "সোশ্যাল মিডিয়ায় অনুসরণ করুন"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {socialLinks.map((link, idx) => (
              <motion.a
                key={idx}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.07 }}
                className={`flex flex-col items-center gap-2 bg-card border border-card-border rounded-xl p-5 text-muted-foreground transition-all duration-200 hover:shadow-lg active:scale-95 ${link.color}`}
                data-testid={`social-${link.label.toLowerCase()}`}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  {link.icon}
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm text-foreground">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.handle}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-12"
        >
          {language === "en"
            ? "LiveTV71 is a personal project. For stream issues, please try again later."
            : "LiveTV71 একটি ব্যক্তিগত প্রকল্প। স্ট্রিম সমস্যার জন্য পরে আবার চেষ্টা করুন।"}
        </motion.p>
      </div>
    </div>
  );
}
