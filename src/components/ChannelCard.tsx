import { Heart } from "lucide-react";
import LiveBadge from "./LiveBadge";

interface ChannelCardProps {
  name: string;
  logo: string;
  category: string;
  isActive?: boolean;
  isFavorite?: boolean;
  onClick?: () => void;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

const ChannelCard = ({ name, logo, category, isActive, isFavorite, onClick, onToggleFavorite }: ChannelCardProps) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-3 overflow-hidden rounded-lg border p-3 transition-all text-left w-full ${
    className={`group relative flex flex-col items-center gap-2 overflow-hidden rounded-lg border p-3 transition-all text-center w-full ${
      isActive
        ? "border-primary bg-primary/10"
        : "border-border bg-card hover:border-primary/40 hover:bg-channel-hover"
    }`}
  >
    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-secondary">
    {onToggleFavorite && (
      <div
        role="button"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(e); }}
        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/60 backdrop-blur-sm hover:bg-secondary transition z-10"
      >
        <Heart className={`h-3.5 w-3.5 transition ${isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground hover:text-foreground"}`} />
      </div>
    )}
    {isActive && (
      <div className="absolute top-1.5 left-1.5 z-10">
        <LiveBadge />
      </div>
    )}
    <div className="relative aspect-square w-full max-w-[72px] overflow-hidden rounded bg-secondary flex items-center justify-center">
      {logo ? (
        <img
          src={logo}
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
        <div className="text-lg font-bold text-muted-foreground">
          {name.charAt(0)}
        </div>
      )}
    </div>
    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
      <h3 className="text-sm font-semibold text-card-foreground line-clamp-1">{name}</h3>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
    <div className="flex flex-col gap-0.5 min-w-0 w-full">
      <h3 className="text-xs font-semibold text-card-foreground line-clamp-2 leading-tight">{name}</h3>
      <span className="text-[9px] font-semibold uppercase tracking-wider text-primary line-clamp-1">
        {category}
      </span>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {isActive && <LiveBadge />}
      {onToggleFavorite && (
        <div
          role="button"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(e); }}
          className="p-1 rounded-full hover:bg-secondary transition"
        >
          <Heart className={`h-4 w-4 transition ${isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground hover:text-foreground"}`} />
        </div>
      )}
    </div>
  </button>
);
