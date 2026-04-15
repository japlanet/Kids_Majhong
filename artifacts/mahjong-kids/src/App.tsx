import { useState, useCallback } from "react";
import { LevelSelect } from "./components/LevelSelect";
import { GamePage } from "./pages/Game";

type Screen = "menu" | "game";

function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem("mahjong-kids-completed");
      if (saved) return new Set(JSON.parse(saved) as number[]);
    } catch {}
    return new Set<number>();
  });

  const handleSelectLevel = useCallback((levelId: number) => {
    setCurrentLevel(levelId);
    setScreen("game");
  }, []);

  const handleMenu = useCallback(() => {
    setScreen("menu");
  }, []);

  const handleNextLevel = useCallback((levelId: number) => {
    setCurrentLevel(levelId);
    setScreen("game");
  }, []);

  const handleLevelComplete = useCallback((levelId: number) => {
    setCompletedLevels(prev => {
      const next = new Set(prev);
      next.add(levelId);
      try {
        localStorage.setItem("mahjong-kids-completed", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  if (screen === "game") {
    return (
      <GamePage
        levelId={currentLevel}
        onMenu={handleMenu}
        onNextLevel={handleNextLevel}
        onLevelComplete={handleLevelComplete}
      />
    );
  }

  return (
    <LevelSelect
      onSelectLevel={handleSelectLevel}
      completedLevels={completedLevels}
    />
  );
}

export default App;
