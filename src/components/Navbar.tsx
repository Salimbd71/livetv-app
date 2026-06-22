import { Tv, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (y > lastY.current && y > 60) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastY.current = y;
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
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Tv className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">
            LiveTV
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/" className="text-foreground">Home</Link>
          <Link to="/categories" className="hover:text-foreground transition">Categories</Link>
          <Link to="/favorites" className="hover:text-foreground transition">Favorites</Link>
          <Link to="/about" className="hover:text-foreground transition">About</Link>
          <Link to="/contact" className="hover:text-foreground transition">Contact Us</Link>
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="flex flex-col gap-4 p-4 text-sm font-medium text-muted-foreground">
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/categories" onClick={() => setMobileOpen(false)}>Categories</Link>
            <Link to="/favorites" onClick={() => setMobileOpen(false)}>Favorites</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact Us</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
