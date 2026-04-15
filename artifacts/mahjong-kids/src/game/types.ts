export interface Tile {
  id: string;
  symbol: string;
  emoji: string;
  row: number;
  col: number;
  layer: number;
  isMatched: boolean;
  isSelected: boolean;
  isHinted: boolean;
  isBlocked: boolean;
}

export interface Level {
  id: number;
  name: string;
  emoji: string;
  layout: number[][][]; // [layer][row][col] 1=tile, 0=empty
  tileSet: string[];
  bgColor: string;
  bgEmoji: string;
}

export interface GameState {
  tiles: Tile[];
  selectedTile: Tile | null;
  matchedPairs: number;
  totalPairs: number;
  hintUsed: boolean;
  levelComplete: boolean;
  moves: number;
}
