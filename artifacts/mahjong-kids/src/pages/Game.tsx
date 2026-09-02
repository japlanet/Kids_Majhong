import { useState, useCallback, useEffect, useRef } from "react";
import { GameBoard } from "../components/GameBoard";
import { LevelComplete } from "../components/LevelComplete";
import { LEVELS } from "../game/levels";
import { initGameState, selectTile, applyHint } from "../game/engine";
import type { Level } from "../game/types";
import { useGameSounds } from "../hooks/useGameSounds";

interface GamePageProps {
  levelId: number;
  onMenu: () => void;
  onNextLevel: (levelId: number) => void;
  onLevelComplete: (levelId: number) => void;
}

export function GamePage({ levelId, onMenu, onNextLevel, onLevelComplete }: GamePageProps) {
  const level = LEVELS.find(l => l.id === levelId) ?? LEVELS[0];
  const [gameState, setGameState] = useState(() => initGameState(level));
  const [hintCooldown, setHintCooldown] = useState(false);
  const [levelCompleteShown, setLevelCompleteShown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      // Sound is on unless the player has explicitly turned it off.
      return localStorage.getItem("mahjong-kids-sound-enabled") !== "false";
    } catch {
      return true;
    }
  });
  const sounds = useGameSounds(soundEnabled);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHintCooldown = useCallback(() => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    setHintCooldown(false);
  }, []);

  // Re-init when level changes
  useEffect(() => {
    setGameState(initGameState(level));
    setLevelCompleteShown(false);
    clearHintCooldown();
  }, [levelId, level, clearHintCooldown]);

  // Don't leave a hint timer running after the page unmounts
  useEffect(() => clearHintCooldown, [clearHintCooldown]);

  // Detect level complete
  useEffect(() => {
    if (gameState.levelComplete && !levelCompleteShown) {
      onLevelComplete(levelId);
      // Small delay so the last match animation plays
      const t = setTimeout(() => setLevelCompleteShown(true), 400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [gameState.levelComplete, levelCompleteShown, levelId, onLevelComplete]);

  const handleTileClick = useCallback((id: string) => {
    // Compute the next state here, in the tap's own call stack, so the audio
    // context is unlocked by the user gesture and each sound plays exactly once.
    const next = selectTile(gameState, id);
    const tappedTile = gameState.tiles.find(tile => tile.id === id);

    if (next.matchedPairs > gameState.matchedPairs) {
      sounds.playMatch();
      if (next.levelComplete) sounds.playComplete();
    } else if (
      gameState.selectedTile &&
      tappedTile &&
      gameState.selectedTile.id !== tappedTile.id &&
      gameState.selectedTile.symbol !== tappedTile.symbol
    ) {
      sounds.playMismatch();
    } else {
      sounds.playSelect();
    }

    setGameState(next);
  }, [gameState, sounds]);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem("mahjong-kids-sound-enabled", String(next));
      } catch {}
      return next;
    });
  }, []);

  const handleHint = useCallback(() => {
    if (hintCooldown) return;
    setGameState(prev => applyHint(prev));
    setHintCooldown(true);
    hintTimerRef.current = setTimeout(() => {
      hintTimerRef.current = null;
      setHintCooldown(false);
    }, 3000);
  }, [hintCooldown]);

  const handleRetry = useCallback(() => {
    setGameState(initGameState(level));
    setLevelCompleteShown(false);
    clearHintCooldown();
  }, [level, clearHintCooldown]);

  const handleNextLevel = useCallback(() => {
    const nextId = levelId + 1;
    if (nextId <= LEVELS.length) {
      onNextLevel(nextId);
    }
  }, [levelId, onNextLevel]);

  const progress = gameState.totalPairs > 0
    ? (gameState.matchedPairs / gameState.totalPairs) * 100
    : 0;

  const remaining = gameState.totalPairs - gameState.matchedPairs;

  return (
    <div className={`min-h-screen game-screen game-bg bg-gradient-to-br ${level.bgColor} flex flex-col`}>
      {/* Header */}
      <div className="game-header flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={onMenu}
          className="game-btn w-12 h-12 rounded-xl bg-white/80 shadow flex items-center justify-center text-2xl font-black border-b-4 border-gray-200"
          aria-label="Back to level select"
        >
          ←
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" role="img">{level.emoji}</span>
            <span className="font-black text-lg text-white drop-shadow">Level {level.id}</span>
            <span className="ml-auto font-bold text-white drop-shadow text-sm">
              {gameState.matchedPairs}/{gameState.totalPairs} pairs
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-3 bg-white/40 rounded-full overflow-hidden">
            <div
              className="progress-bar h-full bg-white rounded-full shadow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Sound toggle */}
        <button
          onClick={handleToggleSound}
          className="game-btn w-12 h-12 rounded-xl bg-white/80 shadow flex items-center justify-center text-2xl border-b-4 border-gray-200 active:border-b-0"
          aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
          title={soundEnabled ? "Sound on" : "Sound off"}
        >
          <span role="img" aria-hidden="true">{soundEnabled ? "🔊" : "🔇"}</span>
        </button>

        {/* Hint button */}
        <button
          onClick={handleHint}
          disabled={hintCooldown || gameState.levelComplete}
          className={`
            game-btn w-16 h-12 rounded-xl shadow flex items-center justify-center
            font-black text-lg border-b-4
            ${hintCooldown
              ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
              : "bg-yellow-300 border-yellow-500 text-yellow-800 active:border-b-0"}
          `}
          aria-label="Get a hint"
          title="Hint"
        >
          <span role="img" aria-label="lightbulb">💡</span>
        </button>
      </div>

      {/* Remaining tiles indicator */}
      <div className="flex justify-center mb-2">
        <div className="bg-white/60 rounded-xl px-4 py-1 text-sm font-bold text-gray-700">
           {remaining > 0
             ? `${remaining} pair${remaining !== 1 ? "s" : ""} left!`
             : "All matched! 🎉"}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center px-3 pb-2 min-h-0">
        <div className="bg-white/30 rounded-3xl p-3 shadow-inner backdrop-blur-sm w-full max-w-2xl">
          <GameBoard
            tiles={gameState.tiles}
            level={level}
            onTileClick={handleTileClick}
          />
        </div>
      </div>

      {/* Retry button at bottom */}
      <div className="game-footer flex justify-center pb-4 gap-3">
        <button
          onClick={handleRetry}
          className="game-btn px-5 sm:px-6 py-3 rounded-xl bg-white/80 shadow font-bold text-gray-700 border-b-4 border-gray-200 active:border-b-0 text-lg"
          aria-label="Restart level"
        >
          <span role="img" aria-hidden="true">🔄</span>
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>

      {/* Level Complete Modal */}
      {gameState.levelComplete && levelCompleteShown && (
        <LevelComplete
          levelId={levelId}
          totalLevels={LEVELS.length}
          moves={gameState.moves}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
          onMenu={onMenu}
        />
      )}
    </div>
  );
}
