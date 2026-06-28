import React from "react";
import { Search, Moon, Sun, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30">
            71
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-xl tracking-tight leading-none text-foreground">
              LiveTV<span className="text-primary">71</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              {t("Live TV Streaming")}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder={t("Search channels...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 bg-muted/50 border-transparent focus:bg-background transition-all rounded-full h-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="font-medium px-3"
            data-testid="button-lang-toggle"
          >
            <Globe className="w-4 h-4 mr-2" />
            {language === "en" ? "বাং" : "EN"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            data-testid="button-theme-toggle"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
