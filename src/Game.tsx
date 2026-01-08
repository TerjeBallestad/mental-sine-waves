import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { useGameState } from "./GameState";

import { CharacterTalents } from "./pages/CharacterTalents";

export function Game() {
  const timeStep = 0.05; // hours (3 min)
  const timeInterval = 100; // ms
  const gameState = useGameState();

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      gameState.update(timeStep);
    }, timeInterval);

    return () => clearInterval(interval);
  }, [gameState, isRunning]);

  return (
    <>
      <Header isRunning={isRunning} setIsRunning={setIsRunning} />
      <CharacterTalents />;
    </>
  );
}
