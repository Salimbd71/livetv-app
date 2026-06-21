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
      isActive
        ? "border-primary bg-primary/10"
        : "border-border bg-card hover:border-primary/40 hover:bg-channel-hover"
    }`}
  >
    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-secondary">
      {logo ? (
        <img
          src={logo}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
          {name.charAt(0)}
        </div>
      )}
    </div>
    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
      <h3 className="text-sm font-semibold text-card-foreground line-clamp-1">{name}</h3>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
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

export default ChannelCard;
