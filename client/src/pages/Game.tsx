import { useEffect, useState } from "react";
import { useGame, INITIAL_STATE } from "@/hooks/use-game";
import { GameLog } from "@/components/GameLog";
import { MapGrid } from "@/components/MapGrid";
import { CharacterSheet } from "@/components/CharacterSheet";
import { Inventory } from "@/components/Inventory";
import { Controls } from "@/components/Controls";
import { LOCATIONS, NPCS } from "@/lib/gameData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSaves, useCreateSave, useDeleteSave } from "@/hooks/use-saves";
import { Save, Loader2, Trash2, History } from "lucide-react";
import { format } from "date-fns";

export default function Game() {
  const { 
    state, move, startCombat, attack, flee, equipItem, useItem, 
    startDialogue, chooseResponse, endDialogue, loadGame 
  } = useGame();

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const { data: saves, isLoading: loadingSaves } = useSaves();
  const createSave = useCreateSave();
  const deleteSave = useDeleteSave();

  // NPCs in current location
  const currentLoc = LOCATIONS.find(l => l.id === state.locationId);
  const npcsHere = NPCS.filter(npc => currentLoc?.npcs.includes(npc.id));

  // Current Dialogue Node
  const currentNpc = state.dialogue.npcId ? NPCS.find(n => n.id === state.dialogue.npcId) : null;
  const dialogueNode = currentNpc && state.dialogue.nodeId ? currentNpc.dialogueTree[state.dialogue.nodeId] : null;

  const handleSave = () => {
    createSave.mutate({
      name: `${state.player.level} - ${currentLoc?.name || 'Unknown'} - ${new Date().toLocaleTimeString()}`,
      data: state
    });
  };

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 overflow-hidden flex flex-col font-sans selection:bg-amber-900/50 selection:text-amber-100">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/20">
            <span className="font-serif font-bold text-slate-900 text-lg">N</span>
          </div>
          <h1 className="font-serif text-xl font-bold tracking-widest text-amber-500 text-shadow">
            NEVERWINTER
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSaveOpen(true)}
            className="border-slate-700 hover:bg-slate-800 text-amber-500 hover:text-amber-400 gap-2 font-serif"
          >
            <History className="w-4 h-4" /> Archives
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Log & Interaction */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800 bg-slate-950/30">
          <div className="flex-1 p-6 overflow-hidden flex flex-col relative">
            <GameLog logs={state.logs} />
            
            {/* Dialogue Overlay */}
            {state.dialogue.npcId && dialogueNode && (
              <div className="absolute inset-x-6 bottom-6 bg-slate-900/95 border border-amber-900/50 rounded-xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 z-20">
                <h3 className="text-amber-500 font-serif text-lg mb-2">{currentNpc?.name}</h3>
                <p className="text-lg text-slate-200 font-serif italic mb-6">"{dialogueNode.text}"</p>
                <div className="flex flex-wrap gap-3">
                  {dialogueNode.responses.map((resp, i) => (
                    <Button 
                      key={i}
                      onClick={() => chooseResponse(resp.nextNode)}
                      variant="outline"
                      className="border-slate-700 hover:border-amber-500 hover:text-amber-500 text-slate-300"
                    >
                      {resp.text}
                    </Button>
                  ))}
                  {dialogueNode.responses.length === 0 && (
                    <Button onClick={endDialogue} className="bg-amber-700 hover:bg-amber-600 text-white">
                      End Conversation
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar (Non-Combat) */}
          {!state.combat.inCombat && !state.dialogue.npcId && (
            <div className="h-20 border-t border-slate-800 bg-slate-900/50 p-4 flex items-center gap-4 overflow-x-auto">
               <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mr-2">Interact:</span>
               {npcsHere.map(npc => (
                 <Button 
                   key={npc.id} 
                   onClick={() => startDialogue(npc.id)}
                   variant="secondary"
                   className="bg-slate-800 text-amber-200 border border-slate-700 hover:border-amber-500/50"
                 >
                   Talk to {npc.name}
                 </Button>
               ))}
               {npcsHere.length === 0 && <span className="text-slate-600 text-sm italic font-serif">No one to talk to here...</span>}
            </div>
          )}

          {/* Combat Controls */}
          <Controls 
            state={state} 
            onAttack={attack} 
            onFlee={flee} 
            onTalk={startDialogue} 
          />
        </div>

        {/* Right Column: Stats & Map */}
        <div className="w-[380px] flex flex-col bg-slate-950 border-l border-slate-800">
          <ScrollArea className="flex-1 p-6 space-y-6">
            <div className="space-y-6 pb-20">
              <CharacterSheet state={state} />
              
              <div className="space-y-2">
                <h3 className="font-serif text-amber-500 text-sm font-bold uppercase tracking-wider pl-1">Location</h3>
                <MapGrid 
                  currentLocationId={state.locationId} 
                  onLocationClick={move}
                  inCombat={state.combat.inCombat}
                />
              </div>

              <div className="space-y-2">
                <Inventory 
                  state={state} 
                  onUse={useItem} 
                  onEquip={equipItem} 
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </main>

      {/* Save/Load Dialog */}
      <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-500 font-serif">Game Archives</DialogTitle>
            <DialogDescription className="text-slate-400">
              Save your current progress or load a previous journey.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <Button 
              onClick={handleSave} 
              disabled={createSave.isPending}
              className="w-full bg-amber-700 hover:bg-amber-600 text-white font-serif"
            >
              {createSave.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Create New Save
            </Button>
            
            <div className="h-[200px] rounded-md border border-slate-800 bg-slate-950/50 overflow-hidden relative">
              {loadingSaves ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-2">
                    {saves?.length === 0 && (
                      <p className="text-center text-slate-500 text-sm py-8">No records found.</p>
                    )}
                    {saves?.map(save => (
                      <div key={save.id} className="flex items-center justify-between p-3 rounded bg-slate-900 border border-slate-800 hover:border-slate-600 transition-colors group">
                        <div className="flex flex-col">
                          <span className="font-serif text-amber-100 font-bold">{save.name}</span>
                          <span className="text-xs text-slate-500 font-mono">
                            {save.createdAt && format(new Date(save.createdAt), "MMM d, yyyy HH:mm")}
                          </span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="h-8 px-2 text-xs"
                            onClick={() => {
                              loadGame(save.data as any);
                              setIsSaveOpen(false);
                            }}
                          >
                            Load
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => deleteSave.mutate(save.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSaveOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
