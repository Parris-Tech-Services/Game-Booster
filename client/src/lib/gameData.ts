export interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  ambience: string;
  npcs: string[];
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  xp: number;
  attacks: { name: string; bonus: number; damage: string }[];
  drops: { gold?: number; rations?: number };
}

export interface Npc {
  id: string;
  name: string;
  role: string;
  dialogueTree: Record<string, DialogueNode>;
}

export interface DialogueNode {
  text: string;
  responses: DialogueResponse[];
  startQuest?: Quest;
}

export interface DialogueResponse {
  text: string;
  nextNode: string;
  startQuest?: Quest;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward?: { gold?: number };
}

export const LOCATIONS: Location[] = [
  { id: "castle-never", name: "Castle Never", x: 2, y: 1, description: "The grand keep towers over the docks. Smoke drifts.", ambience: "Cool sea breeze mixed with smoke and ale.", npcs: ["rosene"] },
  { id: "protectors-enclave", name: "Protector's Enclave", x: 2, y: 2, description: "Worn cobblestones and watchful guards.", ambience: "Guards patrol, voices carry.", npcs: ["brann"] },
  { id: "docks", name: "The Docks", x: 2, y: 0, description: "Ropes creak and gulls cry above busy piers.", ambience: "Salt and tar.", npcs: [] },
  { id: "market", name: "Market Row", x: 3, y: 2, description: "Stalls spill over with wares and gossip.", ambience: "Haggling voices and scents of spices.", npcs: [] },
  { id: "blacklake", name: "Blacklake District", x: 4, y: 2, description: "Narrow alleys and lamplit windows.", ambience: "Distant laughter and clinking glass.", npcs: [] },
  { id: "beached-leviathan", name: "Beached Leviathan", x: 1, y: 3, description: "A massive ribcage juts from the sand.", ambience: "The sea whispers through bone.", npcs: [] },
  { id: "the-chasm", name: "The Chasm", x: 2, y: 4, description: "A yawning fissure cuts the earth open.", ambience: "Cold drafts rise from below.", npcs: [] },
  { id: "north-gate", name: "North Gate", x: 2, y: -1, description: "A heavy gate marks the road north.", ambience: "Horse hooves, distant road noise.", npcs: [] },
  { id: "east-ward", name: "East Ward", x: 4, y: 1, description: "Quiet residential lanes and tidy gardens.", ambience: "Chatter from shutters.", npcs: [] },
  { id: "westward", name: "Westward Lane", x: 0, y: 2, description: "A narrow lane leading to old docks and warehouses.", ambience: "Faint creaks and the smell of oil.", npcs: [] }
];

export const ENEMIES: Enemy[] = [
  { id: "goblin", name: "Goblin Scavenger", hp: 7, maxHp: 7, ac: 12, xp: 25, attacks: [{ name: "Scimitar", bonus: 4, damage: "1d6+2" }], drops: { gold: 2, rations: 1 } },
  { id: "bandit", name: "Street Thug", hp: 11, maxHp: 11, ac: 11, xp: 50, attacks: [{ name: "Dagger", bonus: 3, damage: "1d4+1" }], drops: { gold: 5 } },
  { id: "wolf", name: "Hungry Wolf", hp: 11, maxHp: 11, ac: 13, xp: 50, attacks: [{ name: "Bite", bonus: 4, damage: "2d4+2" }], drops: { rations: 2 } }
];

export const NPCS: Npc[] = [
  {
    id: "rosene", name: "Rosene", role: "Innkeeper",
    dialogueTree: {
      start: { text: "Rosene smiles as she wipes a mug. \"A warm stew tonight, stranger?\"", responses: [{ text: "Yes, please.", nextNode: "thanks" }, { text: "What's new in town?", nextNode: "gossip" }, { text: "Not hungry.", nextNode: "goodbye" }] },
      gossip: { text: "\"Well, there's talk of a broken statue near the market, and the guard Brann's had strange visitors at night.\"", responses: [{ text: "Where is the market?", nextNode: "directions" }, { text: "I'll look into the statue.", nextNode: "thanks" }] },
      directions: { text: "\"Market Row's east of the Enclave, you'll see the stalls.\"", responses: [] },
      thanks: { text: "\"Here you go. Keep warm, traveler.\"", responses: [] },
      goodbye: { text: "\"Safe journeys.\"", responses: [] }
    }
  },
  {
    id: "brann", name: "Brann", role: "Guard",
    dialogueTree: {
      start: { text: "Brann eyes you, hand near his spear. \"What business do you have in the Enclave?\"", responses: [{ text: "Just passing.", nextNode: "pass" }, { text: "Looking for work.", nextNode: "work" }] },
      pass: { text: "\"Keep to the lanes and mind your step.\"", responses: [] },
      work: { text: "\"The watch could use an extra pair of eyes at night. Report to the barracks.\"", responses: [] }
    }
  }
];
