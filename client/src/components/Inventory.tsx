import { type GameState } from "@/hooks/use-game";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Backpack, Sword, Shield, FlaskConical } from "lucide-react";

interface InventoryProps {
  state: GameState;
  onUse: (item: any) => void;
  onEquip: (item: any) => void;
}

export function Inventory({ state, onUse, onEquip }: InventoryProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'weapon': return <Sword className="w-4 h-4" />;
      case 'armor': return <Shield className="w-4 h-4" />;
      case 'consumable': return <FlaskConical className="w-4 h-4" />;
      default: return <Backpack className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[300px]">
      <div className="p-3 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
        <h2 className="font-serif text-lg text-amber-500 font-bold flex items-center gap-2">
          <Backpack className="w-4 h-4" /> Inventory
        </h2>
        <span className="text-xs font-mono text-slate-500">{state.inventory.length} items</span>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {state.inventory.length === 0 && (
            <p className="text-slate-500 text-sm text-center italic py-4">Your satchel is empty.</p>
          )}
          
          {state.inventory.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="group flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-amber-900/50 hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-slate-950 text-slate-400 group-hover:text-amber-500 transition-colors">
                  {getIcon(item.type)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">{item.name}</span>
                  {item.damage && <span className="text-[10px] text-slate-500 font-mono">DMG: {item.damage}</span>}
                  {item.ac && <span className="text-[10px] text-slate-500 font-mono">AC: {item.ac}</span>}
                </div>
              </div>

              <div className="flex gap-1">
                {(item.type === 'weapon' || item.type === 'armor') && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onEquip(item)}
                    className="h-7 px-2 text-xs hover:bg-amber-900/20 hover:text-amber-400"
                  >
                    Equip
                  </Button>
                )}
                {item.type === 'consumable' && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onUse(item)}
                    className="h-7 px-2 text-xs hover:bg-blue-900/20 hover:text-blue-400"
                  >
                    Use
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
