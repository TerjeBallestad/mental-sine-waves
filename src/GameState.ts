import { action, makeAutoObservable } from "mobx";
import {
  ACharacter,
  elling,
  kjellBjarne,
  nora,
  testDummy,
} from "./data/Characters";
import { zeroResources } from "./data/Resources";

export class AGameState {
  time = 0;
  characters = [elling, kjellBjarne, testDummy, nora];
  selectedCharacter = elling;
  globalResources = zeroResources;

  constructor() {
    makeAutoObservable(this, {
      update: action,
    });
  }

  update(deltaTime: number) {
    this.time += deltaTime;
  }

  selectCharacter(char: ACharacter) {
    this.selectedCharacter = char;
  }
}

const gameState = new AGameState();
export const useGameState = () => {
  return gameState;
};
