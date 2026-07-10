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
  condition?: { type: 'quest_complete' | 'has_item'; value: string };
  startQuest?: Quest;
}

export interface DialogueResponse {
  text: string;
  nextNode: string;
  skill_check?: { skill: string; dc: number };
  failNode?: string;
  item_required?: string;
  startQuest?: Quest;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward?: { gold?: number };
}

export const LOCATIONS: Location[] = [
  {
    id: "castle-never",
    name: "Castle Never",
    x: 2, y: 1,
    description: "The fortress looms over the city, half restored, half scarred. Banners of the Open Lord snap in the wind, and armored patrols move with disciplined rhythm.",
    ambience: "Steel on stone, muffled orders, the scent of oil and old parchment.",
    npcs: ["dagult-neverember"]
  },
  {
    id: "protectors-enclave",
    name: "Protector's Enclave",
    x: 2, y: 2,
    description: "Banners ripple above marble steps and crowded market stalls. Priests and merchants weave through the square while guards keep a steady line.",
    ambience: "Temple bells, market chatter, the scrape of boots on stone.",
    npcs: ["brann", "gundren-rockseeker"]
  },
  { id: "docks", name: "The Docks", x: 2, y: 0, description: "Ropes creak and gulls cry above busy piers.", ambience: "Salt and tar.", npcs: [] },
  { id: "market", name: "Market Row", x: 3, y: 2, description: "Stalls spill over with wares and gossip.", ambience: "Haggling voices and scents of spices.", npcs: [] },
  { id: "blacklake", name: "Blacklake District", x: 4, y: 2, description: "Narrow alleys and lamplit windows.", ambience: "Distant laughter and clinking glass.", npcs: [] },
  {
    id: "beached-leviathan",
    name: "Beached Leviathan",
    x: 1, y: 3,
    description: "A massive ship, long grounded, now serves as tavern and refuge. Lantern light gleams off salt-stained timber while sea wind slithers through warped planks.",
    ambience: "Creaking wood, brine-soaked air, low laughter, clinking mugs.",
    npcs: ["madame-rosene"]
  },
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
    id: "madame-rosene",
    name: "Madame Rosene",
    role: "Fortune Teller",
    dialogueTree: {
      start: {
        text: "Wrapped in violet silks, Madame Rosene reads the future in a bowl of dark water. Her eyes never quite focus on you, yet she answers as if she already knows your questions. 'The cards whisper, traveler. Do you seek fate, or coin?'",
        responses: [
          { text: "Read my fortune.", nextNode: "fortune" },
          { text: "I want rumors about the city.", nextNode: "rumors" },
          {
            text: "Can you help me? I need guidance.",
            nextNode: "persuasion",
            skill_check: { skill: "persuasion", dc: 13 },
            failNode: "cold"
          }
        ]
      },
      fortune: {
        text: "She traces symbols in the water. 'A blade in shadow, a coin on edge, a name whispered from stone. Beware the chasm and those who profit from it.'",
        responses: [{ text: "Thank you for the warning.", nextNode: "end" }]
      },
      rumors: {
        text: "Her voice drops to a whisper. 'Neverember moves pieces across the city like a game board. Some say the board is cracking.'",
        responses: [{ text: "Who opposes him?", nextNode: "opposition" }]
      },
      opposition: {
        text: "'Old blood, old guilds, and the whisper of the Chasm. That's all I will say. The cards close when pressed too hard.'",
        responses: [{ text: "I understand. Enough for now.", nextNode: "end" }]
      },
      persuasion: {
        text: "She studies you with newfound respect. 'You have a silver tongue. Take this: a name, Rinna of the docks. She knows things the guards don't.'",
        responses: [{ text: "I will seek her out.", nextNode: "end" }]
      },
      cold: {
        text: "She turns away, cards snapping shut. 'My price is steep and my time scarce. Come back with proof of courage, not empty words.'",
        responses: [{ text: "I'll return when I'm worthy.", nextNode: "end" }]
      },
      end: {
        text: "The cards close like a door. She turns away, already reading another fate.",
        responses: []
      }
    }
  },
  {
    id: "gundren-rockseeker",
    name: "Gundren Rockseeker",
    role: "Dwarf Prospector",
    dialogueTree: {
      start: {
        text: "Gundren's beard is braided with iron rings, his pack heavy with maps and stone dust. He speaks quickly, as if afraid someone might steal the words. 'Aye! You look capable. Ever heard of Wave Echo Cave?'",
        responses: [
          { text: "Tell me about the cave.", nextNode: "cave" },
          { text: "I might help for the right price.", nextNode: "price" },
          { text: "Not interested.", nextNode: "end" }
        ]
      },
      cave: {
        text: "His eyes light up. 'Old dwarven legends, lost forge, and riches for the taking. I've got a lead but I need a blade to back it. The road east is dangerous.'",
        responses: [
          { text: "I'm listening. What's the plan?", nextNode: "offer" },
          { text: "Sounds too dangerous for me.", nextNode: "danger" }
        ]
      },
      offer: {
        text: "He leans in conspiratorially. 'Escort my supply wagon east to Phandalin. We split the profits and glory when we find the forge. Deal?'",
        responses: [
          { text: "Deal. When do we leave?", nextNode: "deal" },
          { text: "I need time to think about it.", nextNode: "end" }
        ]
      },
      price: {
        text: "He laughs, a sound like gravel in a barrel. 'Sharp! I like that. I can pay in coin now, or double after the cave is found. Your choice.'",
        responses: [
          { text: "Double later sounds good.", nextNode: "deal" },
          { text: "Coin now, please.", nextNode: "deal" }
        ]
      },
      danger: {
        text: "He grins. 'Danger is where legends are made. Or graves. Either way, we walk it together or not at all.'",
        responses: [{ text: "All right, you've convinced me.", nextNode: "deal" }]
      },
      deal: {
        text: "He clasps your arm with a grip like iron. 'Then we ride at dawn. Meet me by the East Gate. Bring your courage and a sharp blade.'",
        responses: [{ text: "I'll be there.", nextNode: "end" }]
      },
      end: {
        text: "Gundren shoulders his pack and scans the crowd for trouble, already planning the route.",
        responses: []
      }
    }
  },
  {
    id: "dagult-neverember",
    name: "Dagult Neverember",
    role: "Open Lord",
    dialogueTree: {
      start: {
        text: "Neverember stands with the weight of a city on his shoulders, cloak clasped by a silver gryphon. His gaze measures every word for its cost. 'You stand before the Open Lord. Speak your intent.'",
        responses: [
          { text: "I seek work in service of the city.", nextNode: "work" },
          {
            text: "Tell me about your rivals and enemies.",
            nextNode: "rivals",
            skill_check: { skill: "investigation", dc: 14 },
            failNode: "deflect"
          },
          { text: "I only wish to pay my respects.", nextNode: "respect" }
        ]
      },
      work: {
        text: "His expression hardens. 'Then prove your loyalty. Keep the peace in the Blacklake District. Return with names of those who conspire against order.'",
        responses: [{ text: "As you command, Lord Neverember.", nextNode: "end" }]
      },
      rivals: {
        text: "He studies you carefully before answering. 'The noble houses and the old guilds watch me like hawks. The Chasm is their favorite hiding place. Be careful who you trust.'",
        responses: [{ text: "I will investigate discreetly.", nextNode: "end" }]
      },
      deflect: {
        text: "His eyes narrow. 'Curiosity can be dangerous in Neverwinter. Earn my trust before you pry into matters of state.'",
        responses: [{ text: "Understood. I apologize.", nextNode: "end" }]
      },
      respect: {
        text: "He nods slightly. 'Respect is rare in these times. If you value order and prosperity, we will speak again.'",
        responses: [{ text: "I will return when I have proven myself.", nextNode: "end" }]
      },
      end: {
        text: "Neverember turns back to the council table, already planning his next move. Guards watch your exit.",
        responses: []
      }
    }
  },
  {
    id: "brann",
    name: "Brann",
    role: "Guard",
    dialogueTree: {
      start: { text: "Brann eyes you, hand near his spear. \"What business do you have in the Enclave?\"", responses: [{ text: "Just passing.", nextNode: "pass" }, { text: "Looking for work.", nextNode: "work" }] },
      pass: { text: "\"Keep to the lanes and mind your step.\"", responses: [] },
      work: { text: "\"The watch could use an extra pair of eyes at night. Report to the barracks.\"", responses: [] }
    }
  }
];
