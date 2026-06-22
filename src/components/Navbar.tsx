import { Tv } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 60) setHidden(true);
      else setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Tv className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">LiveTV</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="text-foreground">Home</a>
          <a href="#" className="hover:text-foreground transition">Guide</a>
          <a href="#" className="hover:text-foreground transition">Channels</a>
          <a href="#" className="hover:text-foreground transition">Library</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
