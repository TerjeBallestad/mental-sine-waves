import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import { ResonanceSystem } from "./ResonanceSystem.tsx";
import { CharacterTalents } from "./CharacterTalents.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <ResonanceSystem /> */}
    <CharacterTalents />
  </StrictMode>,
);
