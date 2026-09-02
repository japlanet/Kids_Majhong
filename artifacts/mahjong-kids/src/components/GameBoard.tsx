import { useMemo } from "react";
import { TileComponent } from "./TileComponent";
import type { Tile, Level } from "../game/types";

interface GameBoardProps {
  tiles: Tile[];
  level: Level;
  onTileClick: (id: string) => void;
}

export function GameBoard({ tiles, level, onTileClick }: GameBoardProps) {
  const { cols, rows } = useMemo(() => {
    const layout = level.layout;
    let maxRow = 0, maxCol = 0;
    for (const layer of layout) {
      for (let r = 0; r < layer.length; r++) {
        for (let c = 0; c < layer[r].length; c++) {
          if (layer[r][c] === 1) {
            if (r > maxRow) maxRow = r;
            if (c > maxCol) maxCol = c;
          }
        }
      }
    }
    return { cols: maxCol + 1, rows: maxRow + 1 };
  }, [level]);

  // Build a lookup: "row-col" -> tile
  const tileMap = useMemo(() => {
    const map = new Map<string, Tile>();
    for (const t of tiles) {
      map.set(`${t.row}-${t.col}`, t);
    }
    return map;
  }, [tiles]);

  return (
    <div
      className="grid gap-1.5 mx-auto"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: "100%",
         maxWidth: `min(${cols * 112}px, 100%)`,
        aspectRatio: `${cols} / ${rows}`,
      }}
      aria-label="Mahjong game board"
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const tile = tileMap.get(`${row}-${col}`);
          if (!tile) return <div key={`empty-${row}-${col}`} />;
          return (
            <TileComponent
              key={tile.id}
              tile={tile}
              onClick={onTileClick}
            />
          );
        })
      ).flat()}
    </div>
  );
}
