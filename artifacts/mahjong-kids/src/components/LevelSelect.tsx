import { LEVELS } from "../game/levels";

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  completedLevels: Set<number>;
}

const BG_COLORS = [
  "from-green-300 to-teal-300",
  "from-pink-300 to-rose-300",
  "from-indigo-300 to-purple-300",
  "from-yellow-300 to-amber-300",
  "from-emerald-300 to-green-300",
];

const BORDER_COLORS = [
  "border-teal-400",
  "border-rose-400",
  "border-purple-400",
  "border-amber-400",
  "border-green-400",
];

export function LevelSelect({ onSelectLevel, completedLevels }: LevelSelectProps) {
  return (
    <div className="min-h-screen game-bg flex flex-col items-center justify-center p-4 py-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3" role="img" aria-label="mahjong game">🎮</div>
        <h1 className="text-4xl font-black text-orange-500 drop-shadow-md" style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.1)" }}>
          Tile Match!
        </h1>
        <p className="text-lg font-bold text-teal-600 mt-1">Pick a level to play!</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        {LEVELS.map((level, i) => {
          const done = completedLevels.has(level.id);
          return (
            <button
              key={level.id}
              onClick={() => onSelectLevel(level.id)}
              className={`
                game-btn
                flex items-center gap-4 p-4 rounded-2xl
                bg-gradient-to-r ${BG_COLORS[i]}
                border-4 ${BORDER_COLORS[i]}
                shadow-lg active:shadow-sm
                text-white font-black text-xl
                w-full
              `}
              aria-label={`Level ${level.id}: ${level.name}${done ? " - completed" : ""}`}
            >
              <span className="text-5xl" role="img">{level.emoji}</span>
              <div className="flex-1 text-left">
                <div className="text-2xl font-black drop-shadow">Level {level.id}</div>
                <div className="text-sm font-bold opacity-90">{level.name}</div>
              </div>
              {done && (
                <span className="text-3xl" role="img" aria-label="completed">⭐</span>
              )}
              <span className="text-2xl" role="img" aria-label="play">▶️</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-3 text-3xl" aria-hidden="true">
        {["🐱", "🍕", "⭐", "⚽", "🌸"].map(e => (
          <span key={e}>{e}</span>
        ))}
      </div>
    </div>
  );
}
