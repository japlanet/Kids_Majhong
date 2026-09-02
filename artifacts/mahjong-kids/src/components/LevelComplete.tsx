import { Confetti } from "./Confetti";

interface LevelCompleteProps {
  levelId: number;
  totalLevels: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onMenu: () => void;
}

export function LevelComplete({ levelId, totalLevels, onNextLevel, onRetry, onMenu }: LevelCompleteProps) {
  const isLastLevel = levelId >= totalLevels;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm p-4">
      <Confetti />
      <div className="bounce-in bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border-4 border-yellow-300">
        <div className="text-7xl mb-4" role="img" aria-label="celebration">
          {isLastLevel ? "🏆" : "🎉"}
        </div>

        <h2 className="text-3xl font-black text-orange-500 mb-1">
          {isLastLevel ? "You Did It!" : "Great Job!"}
        </h2>
          <p className="text-lg font-bold text-teal-600 mb-6">
          {isLastLevel
              ? `You finished all ${totalLevels} levels! You're amazing!`
            : "Level complete! Keep going!"}
        </p>

        <div className="flex gap-2 justify-center mb-6" aria-hidden="true">
          {["⭐", "⭐", "⭐"].map((s, i) => (
            <span key={i} className="text-4xl" style={{ animationDelay: `${i * 0.2}s` }}>{s}</span>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {!isLastLevel && (
            <button
              onClick={onNextLevel}
              className="game-btn w-full py-4 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-black text-xl shadow-lg border-b-4 border-orange-600 active:border-b-0"
              aria-label="Play next level"
            >
              Next Level ▶️
            </button>
          )}
          <button
            onClick={onRetry}
            className="game-btn w-full py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-400 text-white font-black text-lg shadow-lg border-b-4 border-sky-600 active:border-b-0"
            aria-label="Play this level again"
          >
            Play Again 🔄
          </button>
          <button
            onClick={onMenu}
            className="game-btn w-full py-3 rounded-2xl bg-gradient-to-r from-violet-400 to-purple-400 text-white font-black text-lg shadow-lg border-b-4 border-violet-600 active:border-b-0"
            aria-label="Go to level select"
          >
            Level Select 🏠
          </button>
        </div>
      </div>
    </div>
  );
}
