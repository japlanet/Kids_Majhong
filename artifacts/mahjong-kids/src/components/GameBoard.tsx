import { useMemo } from "react";
import { TileComponent } from "./TileComponent";
import type { Tile, Level } from "../game/types";

interface GameBoardProps {
  tiles: Tile[];
  level: Level;
  onTileClick: (id: string) => void;
}

export function GameBoard({ tiles, level, onTileClick }: GameBoardProps) {
  const { tileSize, boardWidth, boardHeight, cols, rows } = useMemo(() => {
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
    const cols = maxCol + 1;
    const rows = maxRow + 1;

    // Tile size for iPad-friendly touch (aim for ~80-100px on large screens, smaller on mobile)
    const maxBoardWidth = Math.min(window.innerWidth - 32, 700);
    const maxBoardHeight = Math.min(window.innerHeight - 260, 500);
    const gap = 4;
    const sizeByWidth = Math.floor((maxBoardWidth - gap * (cols - 1)) / cols);
    const sizeByHeight = Math.floor((maxBoardHeight - gap * (rows - 1)) / rows);
    const tileSize = Math.max(56, Math.min(sizeByWidth, sizeByHeight, 100));

    const totalSize = tileSize + gap;
    const boardWidth = cols * totalSize - gap;
    const boardHeight = rows * totalSize - gap;

    return { tileSize, boardWidth, boardHeight, cols, rows };
  }, [level]);

  return (
    <div
      className="relative mx-auto"
      style={{ width: boardWidth, height: boardHeight }}
      aria-label="Mahjong game board"
    >
      {tiles.map(tile => (
        <TileComponent
          key={tile.id}
          tile={tile}
          tileSize={tileSize}
          onClick={onTileClick}
        />
      ))}
    </div>
  );
}
