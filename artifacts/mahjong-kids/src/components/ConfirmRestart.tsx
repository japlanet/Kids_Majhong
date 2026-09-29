interface ConfirmRestartProps {
  /** What "yes" does: start this level over, or leave for the level list. */
  action: "restart" | "menu";
  onConfirm: () => void;
  onCancel: () => void;
}

/** "Stop this board?" in pictures: a big no (keep playing) and a big yes. */
export function ConfirmRestart({ action, onConfirm, onCancel }: ConfirmRestartProps) {
  const yesEmoji = action === "restart" ? "🔄" : "🏠";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm p-4">
      <div className="bounce-in bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border-4 border-sky-300">
        <div className="text-7xl mb-6" role="img" aria-label={action === "restart" ? "start over" : "go home"}>
          🀄{yesEmoji}
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            className="game-btn flex-1 py-4 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-400 text-white font-black text-4xl shadow-lg border-b-4 border-sky-600 active:border-b-0"
            aria-label="No, keep playing"
          >
            ↩️
          </button>
          <button
            onClick={onConfirm}
            className="game-btn flex-1 py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-black text-4xl shadow-lg border-b-4 border-rose-600 active:border-b-0"
            aria-label={action === "restart" ? "Yes, start this level over" : "Yes, go back to the levels"}
          >
            {yesEmoji}
          </button>
        </div>
      </div>
    </div>
  );
}
