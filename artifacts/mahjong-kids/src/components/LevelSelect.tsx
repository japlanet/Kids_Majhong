import type { ReactNode } from "react";
import { LEVELS } from "../game/levels";

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  completedLevels: Set<number>;
}

const TIER_LABELS: Record<number, string> = {
  1:  "⭐ Starter",
  3:  "⭐⭐ Easy",
  6:  "⭐⭐⭐ Getting Harder",
  9:  "🌟 Challenge",
  13: "🌟🌟 Big Board",
  17: "🔥 Expert",
  20: "🔥🔥 Super Hard",
  23: "💎 Master",
  26: "💎💎 Champion",
  29: "🏆 Legend",
};

export function LevelSelect({ onSelectLevel, completedLevels }: LevelSelectProps) {
  // Group levels into tiers
  const tierStarts = Object.keys(TIER_LABELS).map(Number).sort((a, b) => a - b);

  function getTierForLevel(id: number): string | null {
    for (let i = tierStarts.length - 1; i >= 0; i--) {
      if (id >= tierStarts[i]) return TIER_LABELS[tierStarts[i]];
    }
    return null;
  }

  // Build display list with tier headers
  type Item =
    | { kind: "header"; label: string }
    | { kind: "level"; levelId: number };

  const items: Item[] = [];
  let lastTier: string | null = null;

  for (const level of LEVELS) {
    const tier = getTierForLevel(level.id);
    if (tier !== lastTier) {
      items.push({ kind: "header", label: tier! });
      lastTier = tier;
    }
    items.push({ kind: "level", levelId: level.id });
  }

  const completedCount = completedLevels.size;

  return (
    <div className="min-h-screen level-select-screen game-bg flex flex-col">
      {/* Fixed header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-white/60 px-4 py-3 text-center shadow-sm">
        <div className="text-4xl mb-1" role="img" aria-label="game">🎮</div>
        <h1 className="text-3xl font-black text-orange-500" style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.08)" }}>
          Tile Match!
        </h1>
        <p className="text-sm font-bold text-teal-600">
          {completedCount}/{LEVELS.length} levels done!
          {completedCount > 0 && " " + "⭐".repeat(Math.min(completedCount, 10))}
        </p>
      </div>

      {/* Scrollable level grid */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {(() => {
          const rendered: ReactNode[] = [];
          let pairBuffer: Item[] = [];

          function flushPairs() {
            if (pairBuffer.length === 0) return;
            rendered.push(
              <div key={`pair-${pairBuffer[0].kind === "level" ? pairBuffer[0].levelId : "h"}`}
                className="grid grid-cols-2 gap-2 mb-2">
                {pairBuffer.map(item => {
                  if (item.kind !== "level") return null;
                  const level = LEVELS.find(l => l.id === item.levelId)!;
                  const done = completedLevels.has(level.id);
                  return (
                    <button
                      key={level.id}
                      onClick={() => onSelectLevel(level.id)}
                      className={`
                        game-btn flex flex-col items-center gap-1 p-3 rounded-2xl min-h-[112px]
                        bg-gradient-to-br ${level.bgColor}
                        border-2 border-white/50
                        shadow-md active:shadow-sm
                        text-slate-900 font-black
                        relative overflow-hidden
                      `}
                      aria-label={`Level ${level.id}: ${level.name}${done ? " - completed" : ""}`}
                    >
                      {done && (
                        <span className="absolute top-1 right-1 text-lg" role="img" aria-label="completed">⭐</span>
                      )}
                      <span className="text-3xl drop-shadow-sm" role="img">{level.emoji}</span>
                      <span className="text-xs font-black bg-white/60 rounded-full px-2 py-0.5 text-slate-800">
                        Level {level.id}
                      </span>
                      <span className="text-xs font-bold bg-white/55 rounded-full px-2 py-0.5 text-center leading-tight text-slate-800">
                        {level.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
            pairBuffer = [];
          }

          for (const item of items) {
            if (item.kind === "header") {
              flushPairs();
              rendered.push(
                <div key={`header-${item.label}`} className="flex items-center gap-2 mt-4 mb-2 first:mt-0">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {item.label}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              );
            } else {
              pairBuffer.push(item);
            }
          }
          flushPairs();

          return rendered;
        })()}

        <div className="h-4" />
      </div>
    </div>
  );
}
