import { LOCATIONS, type Location } from "@/lib/gameData";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Castle, Anchor, Tent, Mountain, Home, Skull, MapPin } from "lucide-react";

interface MapGridProps {
  currentLocationId: string;
  onLocationClick: (id: string) => void;
  inCombat: boolean;
}

export function MapGrid({ currentLocationId, onLocationClick, inCombat }: MapGridProps) {
  // Map dimensions based on LOCATIONS data
  const gridWidth = 5;
  const gridHeight = 5;

  const getLocationAt = (x: number, y: number) => {
    return LOCATIONS.find(l => l.x === x && l.y === y);
  };

  const getIcon = (id: string) => {
    if (id.includes('castle')) return <Castle className="w-5 h-5" />;
    if (id.includes('dock') || id.includes('leviathan')) return <Anchor className="w-5 h-5" />;
    if (id.includes('market')) return <Tent className="w-5 h-5" />;
    if (id.includes('chasm')) return <Mountain className="w-5 h-5" />;
    if (id.includes('gate') || id.includes('ward')) return <Home className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  return (
    <div className="aspect-square bg-slate-900/80 rounded-xl border border-slate-800 p-4 relative overflow-hidden group">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20%_20%] opacity-20 pointer-events-none" />

      <div className="grid grid-cols-5 grid-rows-5 gap-2 h-full w-full relative z-10">
        {Array.from({ length: gridHeight * gridWidth }).map((_, i) => {
          const x = i % gridWidth;
          const y = Math.floor(i / gridWidth);
          const location = getLocationAt(x, y);
          const isCurrent = location?.id === currentLocationId;
          const currentLoc = LOCATIONS.find(l => l.id === currentLocationId);
          const isAdjacent = currentLoc && Math.abs(currentLoc.x - x) + Math.abs(currentLoc.y - y) <= 1.5; // Roughly adjacent

          if (!location) return <div key={i} className="opacity-10" />;

          return (
            <Tooltip key={location.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => isAdjacent && !isCurrent && onLocationClick(location.id)}
                  disabled={!isAdjacent || isCurrent || inCombat}
                  className={cn(
                    "flex items-center justify-center rounded-md transition-all duration-300 relative",
                    "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500/50",
                    isCurrent 
                      ? "bg-amber-600 text-slate-950 shadow-[0_0_15px_rgba(217,119,6,0.5)] z-20" 
                      : "bg-slate-800/40 text-slate-500 hover:bg-slate-700 hover:text-slate-300",
                    isAdjacent && !isCurrent && !inCombat && "cursor-pointer bg-slate-800/80 text-amber-500/70 border border-amber-900/30 animate-pulse-slow",
                    (!isAdjacent || inCombat) && !isCurrent && "cursor-not-allowed opacity-50 grayscale"
                  )}
                >
                  {getIcon(location.id)}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-amber-100 font-serif">
                <p>{location.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
