import type { Tile, Level, GameState } from "./types";
import { getEmoji } from "./levels";

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildTiles(level: Level): Tile[] {
  const layout = level.layout;
  const tiles: Tile[] = [];

  // Count total positions
  let posCount = 0;
  for (let layer = 0; layer < layout.length; layer++) {
    for (let row = 0; row < layout[layer].length; row++) {
      for (let col = 0; col < layout[layer][row].length; col++) {
        if (layout[layer][row][col] === 1) posCount++;
      }
    }
  }

  // Number of pairs = posCount / 2
  const pairCount = Math.floor(posCount / 2);

  // Build paired symbol array
  const symbols: string[] = [];
  const tileSet = level.tileSet;
  for (let i = 0; i < pairCount; i++) {
    const sym = tileSet[i % tileSet.length];
    symbols.push(sym, sym);
  }
  const shuffled = shuffle(symbols);

  let idx = 0;
  for (let layer = 0; layer < layout.length; layer++) {
    for (let row = 0; row < layout[layer].length; row++) {
      for (let col = 0; col < layout[layer][row].length; col++) {
        if (layout[layer][row][col] === 1) {
          const symbol = shuffled[idx++] ?? tileSet[0];
          tiles.push({
            id: `${layer}-${row}-${col}`,
            symbol,
            emoji: getEmoji(symbol),
            row,
            col,
            layer,
            isMatched: false,
            isSelected: false,
            isHinted: false,
            isMismatched: false,
            isBlocked: false,
          });
        }
      }
    }
  }

  return tiles;
}

// This is a simple kids matching game — every unmatched tile is always selectable.
// No Mahjong blocking rules apply.
export function isFreeTile(tile: Tile): boolean {
  return !tile.isMatched;
}

export function getFreeTiles(allTiles: Tile[]): Tile[] {
  return allTiles.filter(t => isFreeTile(t));
}

// Find any matching pair among unmatched tiles
export function findHintPair(allTiles: Tile[]): [Tile, Tile] | null {
  const free = getFreeTiles(allTiles);
  const bySymbol = new Map<string, Tile[]>();

  for (const tile of free) {
    if (!bySymbol.has(tile.symbol)) bySymbol.set(tile.symbol, []);
    bySymbol.get(tile.symbol)!.push(tile);
  }

  for (const [, group] of bySymbol) {
    if (group.length >= 2) {
      return [group[0], group[1]];
    }
  }

  return null;
}

export function initGameState(level: Level): GameState {
  const tiles = buildTiles(level);
  const totalPairs = tiles.length / 2;
  return {
    tiles,
    selectedTile: null,
    matchedPairs: 0,
    totalPairs,
    hintUsed: false,
    levelComplete: false,
    moves: 0,
  };
}

export function selectTile(state: GameState, tileId: string): GameState {
  const tiles = state.tiles.map(t => ({
    ...t,
    isHinted: false,
    isMismatched: false,
  }));
  const tile = tiles.find(t => t.id === tileId);
  if (!tile || tile.isMatched) return { ...state, tiles };

  if (state.selectedTile === null) {
    // Select this tile
    const newTiles = tiles.map(t => ({
      ...t,
      isSelected: t.id === tileId,
    }));
    return { ...state, tiles: newTiles, selectedTile: tile, hintUsed: false };
  }

  if (state.selectedTile.id === tileId) {
    // Tap same tile again — deselect it
    const newTiles = tiles.map(t => ({ ...t, isSelected: false }));
    return { ...state, tiles: newTiles, selectedTile: null };
  }

  if (state.selectedTile.symbol === tile.symbol) {
    // Match!
    const newTiles = tiles.map(t => ({
      ...t,
      isSelected: false,
      isMatched: t.isMatched || t.id === tileId || t.id === state.selectedTile!.id,
    }));
    const newMatchedPairs = state.matchedPairs + 1;
    const levelComplete = newMatchedPairs >= state.totalPairs;
    return {
      ...state,
      tiles: newTiles,
      selectedTile: null,
      matchedPairs: newMatchedPairs,
      levelComplete,
      moves: state.moves + 1,
      hintUsed: false,
    };
  }

  // No match — select the new tile instead
  const newTiles = tiles.map(t => ({
    ...t,
    isSelected: t.id === tileId,
    isMismatched: t.id === tileId || t.id === state.selectedTile!.id,
  }));
  return { ...state, tiles: newTiles, selectedTile: tile, moves: state.moves + 1 };
}

export function applyHint(state: GameState): GameState {
  const pair = findHintPair(state.tiles);
  if (!pair) return state;

  const hintIds = new Set([pair[0].id, pair[1].id]);
  const newTiles = state.tiles.map(t => ({
    ...t,
    isSelected: false,
    isHinted: hintIds.has(t.id),
  }));

  return { ...state, tiles: newTiles, selectedTile: null, hintUsed: true };
}
