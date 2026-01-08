import { action, makeAutoObservable } from "mobx";
import {
  ACharacter,
  elling,
  kjellBjarne,
  nora,
  testDummy,
} from "./data/Characters";
import { zeroResources, type Resource } from "./data/Resources";

export class AGameState {
  time = 0;
  characters: Array<ACharacter>;
  selectedCharacter: ACharacter;
  globalResources = zeroResources;

  constructor() {
    makeAutoObservable(this, {
      update: action,
      addResoure: action,
    });
    this.characters = [elling, kjellBjarne, testDummy, nora];
    this.selectedCharacter = elling;
  }

  update(deltaTime: number) {
    this.time += deltaTime;
  }

  selectCharacter(char: ACharacter) {
    this.selectedCharacter = char;
  }

  addResoure(resource: Resource, amount: number) {
    this.globalResources[resource] += amount;
  }
}

const gameState = new AGameState();
export const useGameState = () => {
  return gameState;
};

// react doesn't like the 'use' prefix being thrown around outside react
export const getGameState = () => {
  return gameState;
};
