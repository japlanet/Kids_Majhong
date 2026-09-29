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
  // A selected tile shows only the selected look: no red "wrong" ring, and the
  // hint glow waits until it is let go again.
  const showHint = tile.isHinted && !tile.isSelected;
  const showMismatch = tile.isMismatched && !tile.isSelected;

  // The outer .tile owns the press feedback (shrink + darken on :active); the
  // inner face owns the selected lift and the hint / mismatch animations, so
  // neither transform overrides the other.
  return (
    <div
      className="tile w-full h-full min-w-0 min-h-0 cursor-pointer select-none"
      style={{ zIndex: tile.isSelected || showHint ? 10 : 1 }}
      onClick={() => onClick(tile.id)}
      // An (empty) touch listener lets iPad Safari apply :active on tap.
      onTouchStart={() => {}}
      role="button"
      aria-pressed={tile.isSelected}
      aria-label={`Tile: ${tile.emoji}`}
    >
      <div
        className={[
          "tile-face",
          "rounded-xl",
          "border-2",
          "flex",
          "items-center",
          "justify-center",
          "bg-gradient-to-br",
          "w-full",
          "h-full",
          colorClass,
          tile.isSelected
            ? "ring-4 ring-orange-400 ring-offset-1 shadow-orange-300/60 shadow-lg"
            : "shadow-[2px_4px_0_rgba(0,0,0,0.15)]",
          showHint ? "hint-highlight" : "",
          showMismatch ? "mismatch ring-4 ring-rose-400 ring-offset-1" : "",
        ].filter(Boolean).join(" ")}
        style={{
          transform: tile.isSelected ? "scale(1.08) translateY(-4px)" : "none",
        }}
      >
        <span
          role="img"
          aria-hidden="true"
          className="leading-none select-none"
          style={{
            // Sized from the tile (set by GameBoard), not the viewport
            fontSize: "calc(var(--tile-size, 64px) * 0.62)",
            filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.12))",
          }}
        >
          {tile.emoji}
        </span>
      </div>
    </div>
  );
}
