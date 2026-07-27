import React, { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Switch, Route } from "wouter";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GlobalProvider } from "@/contexts/GlobalContext";
import { Navbar } from "@/components/Navbar";
import SplashScreen from "@/components/SplashScreen";
import Home from "@/pages/Home";
import AllCategory from "@/pages/AllCategory";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

function AppRoutes() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <div style={{ paddingTop: "var(--navbar-h)" }}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/all-category" component={AllCategory} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route>
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
              <p className="text-5xl font-black text-muted-foreground/30">404</p>
              <p className="text-xl font-bold">Page not found</p>
              <a
                href="/"
                className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Go Home
              </a>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // ১.৫ সেকেন্ড পর ফেইড-আউট অ্যানিমেশন শুরু হবে
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // অ্যানিমেশন শেষ হওয়ার পর (৫০০ms) DOM থেকে SplashScreen রিমুভ হবে
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <GlobalProvider>
          {showSplash && (
            <div
              className={`fixed inset-0 z-[9999] transition-opacity duration-500 ease-in-out ${
                fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <SplashScreen />
            </div>
          )}
          <AppRoutes />
        </GlobalProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
