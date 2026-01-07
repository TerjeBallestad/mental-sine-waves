import { Header } from "./components/Header";
import { CharacterTalents } from "./pages/CharacterTalents";
import { GameStateProvider } from "./GameState";

export const Game = () => {
  console.log("game render");

  return (
    <GameStateProvider>
      <Header />
      <CharacterTalents />;
    </GameStateProvider>
  );
};
