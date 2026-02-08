import { useState, useCallback, useEffect } from "react";
import { LOCATIONS, ENEMIES, NPCS, type Location, type Enemy } from "@/lib/gameData";
import { useToast } from "@/hooks/use-toast";

interface LogEntry {
  id: string;
  type: 'narrative' | 'combat' | 'info' | 'success' | 'error';
  text: string;
  timestamp: string;
}

interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'misc';
  value: number;
  effect?: { type: 'heal', amount: string };
  damage?: string;
  ac?: number;
}

interface PlayerStats {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  gold: number;
  rations: number;
  ac: number;
  str: number; dex: number; con: number; int: number; wis: number; cha: number;
}

export interface GameState {
  player: PlayerStats;
  inventory: Item[];
  equipped: {
    weapon: Item | null;
    armor: Item | null;
  };
  locationId: string;
  combat: {
    inCombat: boolean;
    enemyId: string | null;
    enemyHp: number;
    turn: 'player' | 'enemy';
    log: string[];
  };
  dialogue: {
    npcId: string | null;
    nodeId: string | null;
  };
  logs: LogEntry[];
}

export const INITIAL_STATE: GameState = {
  player: {
    hp: 12, maxHp: 12, xp: 0, level: 1, gold: 10, rations: 5,
    ac: 10,
    str: 14, dex: 12, con: 14, int: 10, wis: 12, cha: 10
  },
  inventory: [
    { id: 'dagger', name: 'Rusty Dagger', type: 'weapon', value: 2, damage: '1d4' },
    { id: 'potion', name: 'Health Potion', type: 'consumable', value: 10, effect: { type: 'heal', amount: '2d4+2' } }
  ],
  equipped: { weapon: null, armor: null },
  locationId: 'docks', // Starting location
  combat: { inCombat: false, enemyId: null, enemyHp: 0, turn: 'player', log: [] },
  dialogue: { npcId: null, nodeId: null },
  logs: []
};

// Helper for dice rolling
const roll = (expr: string) => {
  const [count, sidesMod] = expr.split('d');
  const [sides, mod] = sidesMod.split('+');
  let total = parseInt(mod || '0');
  for (let i = 0; i < parseInt(count); i++) {
    total += Math.floor(Math.random() * parseInt(sides)) + 1;
  }
  return total;
};

export function useGame() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const { toast } = useToast();

  const addLog = useCallback((type: LogEntry['type'], text: string) => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, {
        id: Math.random().toString(36),
        type,
        text,
        timestamp: new Date().toLocaleTimeString()
      }].slice(-50) // Keep last 50 logs
    }));
  }, []);

  // Initialize game with description
  useEffect(() => {
    if (state.logs.length === 0) {
      const loc = LOCATIONS.find(l => l.id === state.locationId);
      if (loc) {
        addLog('narrative', `You arrive at ${loc.name}. ${loc.description}`);
        addLog('info', `Ambience: ${loc.ambience}`);
      }
    }
  }, [state.locationId, state.logs.length, addLog]);

  const move = useCallback((newLocationId: string) => {
    if (state.combat.inCombat) {
      addLog('error', "You cannot travel while in combat!");
      return;
    }

    const newLoc = LOCATIONS.find(l => l.id === newLocationId);
    if (!newLoc) return;

    // Check distance (simple adjacency check logic could go here)
    const currentLoc = LOCATIONS.find(l => l.id === state.locationId)!;
    const dist = Math.abs(currentLoc.x - newLoc.x) + Math.abs(currentLoc.y - newLoc.y);
    
    if (dist > 1.5) { // allow diagonals roughly
       // Too far logic could be here, but for now we rely on the UI only showing adjacent
    }

    setState(prev => ({ ...prev, locationId: newLocationId }));
    addLog('narrative', `You travel to ${newLoc.name}.`);
    addLog('narrative', newLoc.description);
    addLog('info', `Ambience: ${newLoc.ambience}`);

    // Random encounter chance (10%)
    if (Math.random() < 0.1) {
      const enemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
      startCombat(enemy.id);
    }
  }, [state.combat.inCombat, state.locationId, addLog]);

  const startCombat = useCallback((enemyId: string) => {
    const enemy = ENEMIES.find(e => e.id === enemyId);
    if (!enemy) return;

    setState(prev => ({
      ...prev,
      combat: {
        inCombat: true,
        enemyId,
        enemyHp: enemy.hp,
        turn: 'player',
        log: []
      }
    }));
    addLog('combat', `A wild ${enemy.name} appears!`);
  }, [addLog]);

  const attack = useCallback(() => {
    if (!state.combat.inCombat || !state.combat.enemyId) return;
    
    const enemy = ENEMIES.find(e => e.id === state.combat.enemyId)!;
    const weapon = state.equipped.weapon;
    const damageRoll = weapon?.damage || '1d4'; // Unarmed is 1d4
    
    // Player hits? (d20 + str mod vs AC)
    const hitRoll = Math.floor(Math.random() * 20) + 1 + Math.floor((state.player.str - 10) / 2);
    
    if (hitRoll >= enemy.ac) {
      const dmg = roll(damageRoll) + Math.floor((state.player.str - 10) / 2);
      setState(prev => {
        const newHp = prev.combat.enemyHp - dmg;
        if (newHp <= 0) {
          // Victory
          addLog('success', `You strike the ${enemy.name} for ${dmg} damage, killing it!`);
          addLog('success', `Gained ${enemy.xp} XP.`);
          return {
            ...prev,
            player: {
              ...prev.player,
              xp: prev.player.xp + enemy.xp,
              gold: prev.player.gold + (enemy.drops.gold || 0),
              rations: prev.player.rations + (enemy.drops.rations || 0)
            },
            combat: { ...INITIAL_STATE.combat } // Reset combat
          };
        }
        addLog('combat', `You hit the ${enemy.name} for ${dmg} damage.`);
        return {
          ...prev,
          combat: { ...prev.combat, enemyHp: newHp, turn: 'enemy' }
        };
      });
    } else {
      addLog('combat', `You missed the ${enemy.name}.`);
      setState(prev => ({ ...prev, combat: { ...prev.combat, turn: 'enemy' } }));
    }
  }, [state.combat, state.equipped.weapon, state.player.str, addLog]);

  // Enemy turn effect
  useEffect(() => {
    if (state.combat.inCombat && state.combat.turn === 'enemy') {
      const timer = setTimeout(() => {
        const enemy = ENEMIES.find(e => e.id === state.combat.enemyId)!;
        const attack = enemy.attacks[0];
        
        // Enemy hits?
        const hitRoll = Math.floor(Math.random() * 20) + 1 + attack.bonus;
        const playerAc = 10 + Math.floor((state.player.dex - 10) / 2) + (state.equipped.armor?.ac || 0);

        if (hitRoll >= playerAc) {
          const dmg = roll(attack.damage);
          addLog('combat', `The ${enemy.name} hits you with ${attack.name} for ${dmg} damage!`);
          setState(prev => ({
            ...prev,
            player: { ...prev.player, hp: Math.max(0, prev.player.hp - dmg) },
            combat: { ...prev.combat, turn: 'player' }
          }));
        } else {
          addLog('combat', `The ${enemy.name} attacks but misses.`);
          setState(prev => ({ ...prev, combat: { ...prev.combat, turn: 'player' } }));
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.combat.inCombat, state.combat.turn, state.combat.enemyId, state.player.dex, state.equipped.armor, addLog]);

  const flee = useCallback(() => {
    if (Math.random() > 0.5) {
      addLog('narrative', "You managed to escape!");
      setState(prev => ({ ...prev, combat: { ...INITIAL_STATE.combat } }));
    } else {
      addLog('combat', "Failed to escape!");
      setState(prev => ({ ...prev, combat: { ...prev.combat, turn: 'enemy' } }));
    }
  }, [addLog]);

  const equipItem = useCallback((item: Item) => {
    setState(prev => {
      const newEquipped = { ...prev.equipped };
      if (item.type === 'weapon') newEquipped.weapon = item;
      if (item.type === 'armor') newEquipped.armor = item;
      
      addLog('info', `Equipped ${item.name}.`);
      return { ...prev, equipped: newEquipped };
    });
  }, [addLog]);

  const useItem = useCallback((item: Item) => {
    if (item.type === 'consumable' && item.effect?.type === 'heal') {
      const heal = roll(item.effect.amount);
      setState(prev => ({
        ...prev,
        player: { ...prev.player, hp: Math.min(prev.player.maxHp, prev.player.hp + heal) },
        inventory: prev.inventory.filter(i => i !== item) // Remove used item
      }));
      addLog('success', `You used ${item.name} and healed ${heal} HP.`);
      
      // If in combat, it takes a turn
      if (state.combat.inCombat) {
        setState(prev => ({ ...prev, combat: { ...prev.combat, turn: 'enemy' } }));
      }
    }
  }, [state.combat.inCombat, addLog]);

  // Dialogue
  const startDialogue = useCallback((npcId: string) => {
    setState(prev => ({
      ...prev,
      dialogue: { npcId, nodeId: 'start' }
    }));
  }, []);

  const chooseResponse = useCallback((nextNodeId: string) => {
    setState(prev => ({
      ...prev,
      dialogue: { ...prev.dialogue, nodeId: nextNodeId }
    }));
  }, []);

  const endDialogue = useCallback(() => {
    setState(prev => ({
      ...prev,
      dialogue: { npcId: null, nodeId: null }
    }));
  }, []);

  const loadGame = useCallback((savedState: GameState) => {
    setState(savedState);
    addLog('info', "Game loaded successfully.");
  }, [addLog]);

  return {
    state,
    move,
    startCombat,
    attack,
    flee,
    equipItem,
    useItem,
    startDialogue,
    chooseResponse,
    endDialogue,
    loadGame
  };
}
