import { type Tile } from "../game/types";

interface TileProps {
  tile: Tile;
  tileSize: number;
  onClick: (id: string) => void;
}

const TILE_COLORS = [
  "from-amber-100 to-yellow-200 border-yellow-300",
  "from-pink-100 to-rose-200 border-rose-300",
  "from-sky-100 to-blue-200 border-blue-300",
  "from-emerald-100 to-green-200 border-green-300",
  "from-violet-100 to-purple-200 border-purple-300",
  "from-orange-100 to-amber-200 border-amber-300",
];

function hashSymbol(symbol: string): number {
  let h = 0;
  for (const c of symbol) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return Math.abs(h);
}

export function TileComponent({ tile, tileSize, onClick }: TileProps) {
  if (tile.isMatched) return null;

  const colorClass = TILE_COLORS[hashSymbol(tile.symbol) % TILE_COLORS.length];
  const fontSize = Math.round(tileSize * 0.52);
  const gap = 4;
  const totalSize = tileSize + gap;

  const classes = [
    "tile",
    "absolute",
    "rounded-xl",
    "border-2",
    "flex",
    "items-center",
    "justify-center",
    "bg-gradient-to-br",
    "shadow-md",
    colorClass,
    tile.isSelected ? "selected ring-4 ring-orange-400 ring-offset-1 shadow-orange-300 shadow-lg" : "",
    tile.isHinted ? "hint-highlight" : "",
    tile.isBlocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      style={{
        width: tileSize,
        height: tileSize,
        left: tile.col * totalSize,
        top: tile.row * totalSize,
        fontSize,
        lineHeight: 1,
        zIndex: tile.layer * 10 + (tile.isSelected ? 20 : 0),
        transform: tile.isSelected
          ? `translate(${tile.layer * -2}px, ${tile.layer * -2}px) scale(1.08) translateY(-4px)`
          : `translate(${tile.layer * -2}px, ${tile.layer * -2}px)`,
        boxShadow: tile.isSelected
          ? "0 6px 20px rgba(251,146,60,0.5), 0 2px 8px rgba(0,0,0,0.15)"
          : `${tile.layer * 2 + 2}px ${tile.layer * 2 + 4}px 0 rgba(0,0,0,0.15)`,
      }}
      onClick={() => onClick(tile.id)}
      role="button"
      aria-pressed={tile.isSelected}
      aria-label={`Tile: ${tile.emoji}`}
    >
      <span role="img" aria-hidden="true" style={{ fontSize, filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.15))" }}>
        {tile.emoji}
      </span>
    </div>
  );
}
