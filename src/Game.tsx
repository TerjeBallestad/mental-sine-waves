import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { useGameState } from "./GameState";
import { CharacterTalents } from "./pages/CharacterTalents";
import { Dashboard } from "./pages/Dashboard";
import { ActivitiesPage } from "./pages/ActivitiesPage";
import { SkillsPage } from "./pages/SkillsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import PatientResourcePrototype from "./pages/ResourceTrinity";
import { ResourceSystem } from "./pages/ResourceSystem";
import OverskuddMathPrototype from "./pages/OverskuddSystemet";

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
    <BrowserRouter>
      <Header isRunning={isRunning} setIsRunning={setIsRunning} />
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/character" element={<CharacterTalents />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        {/* Legacy prototype pages - can be removed later */}
        <Route path="/prototypes/resource-system" element={<ResourceSystem />} />
        <Route
          path="/prototypes/resource-trinity"
          element={<PatientResourcePrototype />}
        />
        <Route
          path="/prototypes/overskudd"
          element={<OverskuddMathPrototype />}
        />
      </Routes>
    </BrowserRouter>
  );
}
