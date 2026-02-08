import { type GameState } from "@/hooks/use-game";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Shield, Sword, Heart, Coins, Apple, Skull } from "lucide-react";

export function CharacterSheet({ state }: { state: GameState }) {
  const { player } = state;
  const hpPercent = (player.hp / player.maxHp) * 100;

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
        <h2 className="font-serif text-lg text-amber-500 font-bold">Character Sheet</h2>
        <span className="text-xs font-mono text-slate-500">Lvl {player.level}</span>
      </div>

      <div className="p-4 space-y-4">
        {/* HP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs uppercase tracking-wider text-slate-400 font-bold">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /> Health</span>
            <span className="font-mono">{player.hp}/{player.maxHp}</span>
          </div>
          <Progress value={hpPercent} className="h-2 bg-slate-800" indicatorClassName="bg-gradient-to-r from-red-900 to-red-600" />
        </div>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-4 h-4" />
              <span className="text-xs uppercase font-bold">AC</span>
            </div>
            <span className="font-mono text-amber-100 font-bold">{player.ac}</span>
          </div>

          <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Sword className="w-4 h-4" />
              <span className="text-xs uppercase font-bold">ATK</span>
            </div>
            <span className="font-mono text-amber-100 font-bold">+{Math.floor((player.str - 10) / 2)}</span>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Ability Scores */}
        <div className="grid grid-cols-6 gap-1 text-center">
          {[
            { label: 'STR', val: player.str },
            { label: 'DEX', val: player.dex },
            { label: 'CON', val: player.con },
            { label: 'INT', val: player.int },
            { label: 'WIS', val: player.wis },
            { label: 'CHA', val: player.cha },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold">{stat.label}</span>
              <span className="font-mono text-sm text-slate-300">{stat.val}</span>
            </div>
          ))}
        </div>

        <Separator className="bg-slate-800" />

        {/* Resources */}
        <div className="flex justify-between px-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Coins className="w-4 h-4" />
            <span className="font-mono text-sm">{player.gold} gp</span>
          </div>
          <div className="flex items-center gap-2 text-orange-300">
            <Apple className="w-4 h-4" />
            <span className="font-mono text-sm">{player.rations}</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <Skull className="w-4 h-4" />
            <span className="font-mono text-sm">{player.xp} xp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
