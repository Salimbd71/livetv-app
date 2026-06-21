import { Play, Volume2, Maximize, SkipForward } from "lucide-react";
import heroBroadcast from "@/assets/hero-broadcast.jpg";
import LiveBadge from "./LiveBadge";

interface HeroPlayerProps {
  channel: {
    name: string;
    program: string;
    category: string;
    viewers: string;
  };
}

const HeroPlayer = ({ channel }: HeroPlayerProps) => (
  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
    <img
      src={heroBroadcast}
      alt={channel.program}
      className="h-full w-full object-cover"
      width={1920}
      height={1080}
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-player-overlay via-player-overlay/40 to-transparent" />

    {/* Top bar */}
    <div className="absolute top-4 left-4 flex items-center gap-3">
      <LiveBadge />
      <span className="text-sm font-medium text-foreground/80">{channel.viewers} watching</span>
    </div>

    {/* Bottom info */}
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
        {channel.category}
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
        {channel.program}
      </h2>
      <p className="text-sm text-muted-foreground">{channel.name}</p>

      {/* Controls */}
      <div className="mt-4 flex items-center gap-4">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90">
          <Play className="h-5 w-5 fill-current" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-channel-hover">
          <SkipForward className="h-4 w-4" />
        </button>
        <div className="ml-auto flex items-center gap-3">
          <button className="text-muted-foreground transition hover:text-foreground">
            <Volume2 className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground transition hover:text-foreground">
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default HeroPlayer;
