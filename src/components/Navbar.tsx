import { Tv, Search, Bell, User } from "lucide-react";

const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
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
      <div className="flex items-center gap-3">
        <button className="text-muted-foreground hover:text-foreground transition">
          <Search className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition">
          <Bell className="h-5 w-5" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <User className="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>
);

export default Navbar;
