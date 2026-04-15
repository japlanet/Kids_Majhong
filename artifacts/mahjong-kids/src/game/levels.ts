import type { Level } from "./types";

// Each tile symbol maps to an emoji
export const TILE_SETS = {
  animals: [
    { symbol: "cat", emoji: "🐱" },
    { symbol: "dog", emoji: "🐶" },
    { symbol: "rabbit", emoji: "🐰" },
    { symbol: "bear", emoji: "🐻" },
    { symbol: "duck", emoji: "🦆" },
    { symbol: "frog", emoji: "🐸" },
    { symbol: "pig", emoji: "🐷" },
    { symbol: "chick", emoji: "🐥" },
    { symbol: "monkey", emoji: "🐵" },
    { symbol: "panda", emoji: "🐼" },
    { symbol: "fox", emoji: "🦊" },
    { symbol: "koala", emoji: "🐨" },
    { symbol: "tiger", emoji: "🐯" },
    { symbol: "lion", emoji: "🦁" },
    { symbol: "elephant", emoji: "🐘" },
    { symbol: "penguin", emoji: "🐧" },
  ],
  food: [
    { symbol: "pizza", emoji: "🍕" },
    { symbol: "cake", emoji: "🎂" },
    { symbol: "ice-cream", emoji: "🍦" },
    { symbol: "donut", emoji: "🍩" },
    { symbol: "cookie", emoji: "🍪" },
    { symbol: "candy", emoji: "🍬" },
    { symbol: "cupcake", emoji: "🧁" },
    { symbol: "lollipop", emoji: "🍭" },
    { symbol: "strawberry", emoji: "🍓" },
    { symbol: "watermelon", emoji: "🍉" },
    { symbol: "apple", emoji: "🍎" },
    { symbol: "grapes", emoji: "🍇" },
    { symbol: "banana", emoji: "🍌" },
    { symbol: "cherry", emoji: "🍒" },
    { symbol: "pineapple", emoji: "🍍" },
    { symbol: "corn", emoji: "🌽" },
  ],
  space: [
    { symbol: "star", emoji: "⭐" },
    { symbol: "moon", emoji: "🌙" },
    { symbol: "sun", emoji: "☀️" },
    { symbol: "rainbow", emoji: "🌈" },
    { symbol: "comet", emoji: "☄️" },
    { symbol: "planet", emoji: "🪐" },
    { symbol: "rocket", emoji: "🚀" },
    { symbol: "alien", emoji: "👾" },
    { symbol: "ufo", emoji: "🛸" },
    { symbol: "astronaut", emoji: "👨‍🚀" },
    { symbol: "telescope", emoji: "🔭" },
    { symbol: "satellite", emoji: "🛰️" },
    { symbol: "crystal", emoji: "💎" },
    { symbol: "lightning", emoji: "⚡" },
    { symbol: "snowflake", emoji: "❄️" },
    { symbol: "fire", emoji: "🔥" },
  ],
  sports: [
    { symbol: "soccer", emoji: "⚽" },
    { symbol: "basketball", emoji: "🏀" },
    { symbol: "baseball", emoji: "⚾" },
    { symbol: "football", emoji: "🏈" },
    { symbol: "tennis", emoji: "🎾" },
    { symbol: "volleyball", emoji: "🏐" },
    { symbol: "rugby", emoji: "🏉" },
    { symbol: "bowling", emoji: "🎳" },
    { symbol: "golf", emoji: "⛳" },
    { symbol: "bicycle", emoji: "🚴" },
    { symbol: "swimming", emoji: "🏊" },
    { symbol: "trophy", emoji: "🏆" },
    { symbol: "medal", emoji: "🥇" },
    { symbol: "dart", emoji: "🎯" },
    { symbol: "kite", emoji: "🪁" },
    { symbol: "skateboard", emoji: "🛹" },
  ],
  nature: [
    { symbol: "flower", emoji: "🌸" },
    { symbol: "sunflower", emoji: "🌻" },
    { symbol: "rose", emoji: "🌹" },
    { symbol: "tulip", emoji: "🌷" },
    { symbol: "tree", emoji: "🌲" },
    { symbol: "cactus", emoji: "🌵" },
    { symbol: "mushroom", emoji: "🍄" },
    { symbol: "leaf", emoji: "🍀" },
    { symbol: "snail", emoji: "🐌" },
    { symbol: "butterfly", emoji: "🦋" },
    { symbol: "bee", emoji: "🐝" },
    { symbol: "ladybug", emoji: "🐞" },
    { symbol: "dragonfly", emoji: "🪲" },
    { symbol: "turtle", emoji: "🐢" },
    { symbol: "fish", emoji: "🐠" },
    { symbol: "crab", emoji: "🦀" },
  ],
};

// Simple flat grid layouts — no stacking for kids
// 1 = tile, 0 = empty
// Layout is [row][col] for a single layer game

// Level 1: 4x4 grid = 8 pairs (very easy)
const LEVEL1_LAYOUT: number[][][] = [
  [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ],
];

// Level 2: 5x4 grid = 10 pairs  
const LEVEL2_LAYOUT: number[][][] = [
  [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ],
];

// Level 3: 6x4 grid = 12 pairs
const LEVEL3_LAYOUT: number[][][] = [
  [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ],
];

// Level 4: 7x4 grid = 14 pairs  
const LEVEL4_LAYOUT: number[][][] = [
  [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
];

// Level 5: 8x4 grid = 16 pairs
const LEVEL5_LAYOUT: number[][][] = [
  [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Animals",
    emoji: "🐱",
    layout: LEVEL1_LAYOUT,
    tileSet: TILE_SETS.animals.slice(0, 8).map(t => t.symbol),
    bgColor: "from-green-200 via-teal-100 to-cyan-200",
    bgEmoji: "🌿",
  },
  {
    id: 2,
    name: "Yummy Food",
    emoji: "🍕",
    layout: LEVEL2_LAYOUT,
    tileSet: TILE_SETS.food.slice(0, 10).map(t => t.symbol),
    bgColor: "from-pink-200 via-rose-100 to-orange-200",
    bgEmoji: "🍭",
  },
  {
    id: 3,
    name: "Outer Space",
    emoji: "⭐",
    layout: LEVEL3_LAYOUT,
    tileSet: TILE_SETS.space.slice(0, 12).map(t => t.symbol),
    bgColor: "from-indigo-200 via-purple-100 to-blue-200",
    bgEmoji: "🚀",
  },
  {
    id: 4,
    name: "Sports Fun",
    emoji: "⚽",
    layout: LEVEL4_LAYOUT,
    tileSet: TILE_SETS.sports.slice(0, 14).map(t => t.symbol),
    bgColor: "from-yellow-200 via-amber-100 to-lime-200",
    bgEmoji: "🏆",
  },
  {
    id: 5,
    name: "Nature",
    emoji: "🌸",
    layout: LEVEL5_LAYOUT,
    tileSet: TILE_SETS.nature.slice(0, 16).map(t => t.symbol),
    bgColor: "from-emerald-200 via-green-100 to-teal-200",
    bgEmoji: "🦋",
  },
];

// Map symbol -> emoji
export function getEmoji(symbol: string): string {
  for (const set of Object.values(TILE_SETS)) {
    const found = set.find(t => t.symbol === symbol);
    if (found) return found.emoji;
  }
  return "❓";
}
