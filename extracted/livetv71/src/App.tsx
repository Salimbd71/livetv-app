import React from "react";
import { ThemeProvider } from "next-themes";
import { Switch, Route } from "wouter";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GlobalProvider } from "@/contexts/GlobalContext";
import { Navbar } from "@/components/Navbar";
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
              <a href="/" className="px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
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
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <GlobalProvider>
          <AppRoutes />
        </GlobalProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
