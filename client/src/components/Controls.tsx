import { Button } from "@/components/ui/button";
import { GameState } from "@/hooks/use-game";
import { Sword, Skull, Footprints, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { NPCS } from "@/lib/gameData";

interface ControlsProps {
  state: GameState;
  onAttack: () => void;
  onFlee: () => void;
  onTalk: (npcId: string) => void;
}

export function Controls({ state, onAttack, onFlee, onTalk }: ControlsProps) {
  const currentLocation = NPCS.filter(npc => {
    // This logic relies on finding the NPCs in the current location
    // Since we don't pass location details directly to props often, we need to match via data
    // For simplicity, let's assume valid NPCs are passed or computed above. 
    // Actually, we need to know WHICH NPCs are here.
    // The LOCATIONS array in gameData has npc IDs.
    // We'll trust the parent component to handle talking logic or filter it here if we imported LOCATIONS.
    return true; 
  }); 

  // Better approach: Parent passes available interactions?
  // Let's stick to state.combat checks mainly.

  if (state.combat.inCombat) {
    return (
      <div className="bg-red-950/20 border-t-2 border-red-900/50 p-6 backdrop-blur-md">
        <div className="max-w-xl mx-auto flex gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={onAttack}
            disabled={state.combat.turn === 'enemy'}
            className="bg-red-700 hover:bg-red-600 text-white border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.3)] w-full font-serif tracking-wider"
          >
            <Sword className="mr-2 h-5 w-5" /> Attack
          </Button>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={onFlee}
            disabled={state.combat.turn === 'enemy'}
            className="w-full font-serif tracking-wider bg-slate-800 hover:bg-slate-700"
          >
            <Footprints className="mr-2 h-5 w-5" /> Flee
          </Button>
        </div>
        {state.combat.turn === 'enemy' && (
          <p className="text-center text-red-400 mt-3 text-sm font-serif animate-pulse">
            The enemy is preparing to strike...
          </p>
        )}
      </div>
    );
  }

  return null;
}
