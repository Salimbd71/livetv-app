import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Moon, Sun, Globe, Menu, X, Home, LayoutGrid, Info, Phone, Heart, Tv } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { useGlobal } from "@/contexts/GlobalContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", icon: <Home className="w-5 h-5" />, labelKey: "Home" },
  { href: "/all-category", icon: <LayoutGrid className="w-5 h-5" />, labelKey: "All Category" },
  { href: "/about", icon: <Info className="w-5 h-5" />, labelKey: "About" },
  { href: "/contact", icon: <Phone className="w-5 h-5" />, labelKey: "Contact Us" },
];

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery } = useGlobal();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => location === href || (href === "/" && location === "/");

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-[1600px] mx-auto px-3 md:px-5">
          {/* Single main row */}
          <div className="h-14 flex items-center gap-2 md:gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0" data-testid="nav-logo">
              <div className="relative">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
                  <Tv className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
              </div>
              <div className="leading-none">
                <div className="font-black text-xl tracking-tight text-foreground">
                  Live<span className="text-primary">TV</span><span className="text-foreground">71</span>
                </div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-medium hidden sm:block">
                  {t("Live TV Streaming")}
                </div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-0.5 ml-3">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                    ${isActive(link.href)
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                    data-testid={`nav-${link.labelKey.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {t(link.labelKey)}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-sm ml-auto">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder={t("Search channels...")}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/40 border-transparent focus:bg-background rounded-full h-9 text-sm"
                  data-testid="input-search"
                />
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1 ml-auto md:ml-3 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="font-semibold px-2.5 h-9 text-sm gap-1.5" data-testid="btn-lang">
                <Globe className="w-3.5 h-3.5" />
                {language === "en" ? "বাং" : "EN"}
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative rounded-full h-9 w-9" data-testid="btn-theme">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Hamburger — mobile only */}
              <Button variant="ghost" size="icon" className="md:hidden rounded-full h-9 w-9"
                onClick={() => setMenuOpen(true)} data-testid="btn-hamburger">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile search row */}
          <div className="md:hidden pb-2.5">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={t("Search channels...")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/40 border-transparent rounded-full h-9 text-sm"
                data-testid="input-search-mobile"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-[70] w-[280px] bg-background border-r border-border flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="h-14 flex items-center justify-between px-5 border-b border-border shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
                    <Tv className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-lg">Live<span className="text-primary">TV</span>71</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 p-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                    <span className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer
                      ${isActive(link.href)
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      data-testid={`mobile-nav-${link.labelKey.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {link.icon}
                      {t(link.labelKey)}
                    </span>
                  </Link>
                ))}

                <div className="h-px bg-border my-2" />

                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer">
                    <Heart className="w-5 h-5 text-primary" />
                    {t("Favorites")}
                  </span>
                </Link>
              </nav>

              {/* Drawer footer */}
              <div className="p-4 border-t border-border shrink-0">
                <p className="text-xs text-muted-foreground text-center">LiveTV71 · Free Live TV</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
