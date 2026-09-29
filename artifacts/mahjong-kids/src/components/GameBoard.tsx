import { useMemo, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { TileComponent } from "./TileComponent";
import type { Tile, Level } from "../game/types";

// Largest tile we ever draw, and the gap / panel padding used below (gap-1.5, p-3)
const MAX_TILE = 112;
const GAP = 6;
const PANEL_PADDING = 12;

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

  // Measure the space the board may use so it fits BOTH the width and the height
  // (iPad landscape is short; portrait is narrow), then size square tiles to fit.
  const areaRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setArea({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tileSize = Math.max(0, Math.floor(Math.min(
    MAX_TILE,
    (area.width - PANEL_PADDING * 2 - GAP * (cols - 1)) / cols,
    (area.height - PANEL_PADDING * 2 - GAP * (rows - 1)) / rows,
  )));

  return (
    <div ref={areaRef} className="w-full h-full min-w-0 min-h-0 flex items-center justify-center">
      {tileSize > 0 && (
        <div className="bg-white/30 rounded-3xl p-3 shadow-inner backdrop-blur-sm">
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
              "--tile-size": `${tileSize}px`,
            } as CSSProperties}
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
        </div>
      )}
    </div>
  );
}
