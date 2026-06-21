const LiveBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded bg-accent px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent-foreground">
    <span className="h-2 w-2 rounded-full bg-accent-foreground animate-pulse-live" />
    Live
  </span>
);

export default LiveBadge;
