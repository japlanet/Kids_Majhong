import { type Tile } from "../game/types";

interface TileProps {
  tile: Tile;
  onClick: (id: string) => void;
}

const TILE_COLORS = [
  "from-amber-100 to-yellow-200 border-yellow-400",
  "from-pink-100 to-rose-200 border-rose-400",
  "from-sky-100 to-blue-200 border-blue-400",
  "from-emerald-100 to-green-200 border-green-400",
  "from-violet-100 to-purple-200 border-purple-400",
  "from-orange-100 to-amber-200 border-amber-400",
];

function hashSymbol(symbol: string): number {
  let h = 0;
  for (const c of symbol) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return Math.abs(h);
}

export function TileComponent({ tile, onClick }: TileProps) {
  // Matched tiles render as invisible spacers to hold grid structure
  if (tile.isMatched) {
    return <div className="rounded-xl" aria-hidden="true" />;
  }

  const colorClass = TILE_COLORS[hashSymbol(tile.symbol) % TILE_COLORS.length];

  return (
    <div
      className={[
        "tile",
        "rounded-xl",
        "border-2",
        "flex",
        "items-center",
        "justify-center",
        "bg-gradient-to-br",
        "w-full",
        "h-full",
        "min-w-0",
        "min-h-0",
        colorClass,
        tile.isSelected
          ? "ring-4 ring-orange-400 ring-offset-1 shadow-orange-300/60 shadow-lg"
          : "shadow-[2px_4px_0_rgba(0,0,0,0.15)]",
        tile.isHinted ? "hint-highlight" : "",
        "cursor-pointer",
        "select-none",
      ].filter(Boolean).join(" ")}
      style={{
        transform: tile.isSelected ? "scale(1.08) translateY(-4px)" : "none",
        zIndex: tile.isSelected ? 10 : 1,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onClick={() => onClick(tile.id)}
      role="button"
      aria-pressed={tile.isSelected}
      aria-label={`Tile: ${tile.emoji}`}
    >
      <span
        role="img"
        aria-hidden="true"
        className="leading-none select-none"
        style={{
          fontSize: "clamp(1.5rem, 5vw, 3.5rem)",
          filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.12))",
        }}
      >
        {tile.emoji}
      </span>
    </div>
  );
}
