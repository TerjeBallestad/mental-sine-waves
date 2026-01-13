import { action, makeAutoObservable } from "mobx";
import {
  ACharacter,
  elling,
  kjellBjarne,
  nora,
  testDummy,
} from "./data/Characters";
import { zeroResources, type Resource } from "./data/Resources";
import { AllSkills } from "./data/Skills";
import { AllActivities } from "./data/Activities";

export class AGameState {
  time = 0;
  characters: Array<ACharacter>;
  selectedCharacter: ACharacter;

  availableSkills = AllSkills;
  availableActivities = AllActivities;
  globalResources = zeroResources;
  dateTime = { day: 1, time: 0 };
  private previousTime = Date.now();

  constructor() {
    makeAutoObservable(this, {
      update: action,
      addResoure: action,
    });
    this.characters = [elling, kjellBjarne, testDummy, nora];
    this.selectedCharacter = elling;
  }

  update(deltaTime: number) {
    if (this.previousTime === Date.now()) {
      // prevent multiple updates in the same frame
      return;
    }
    this.previousTime = Date.now();
    this.time += deltaTime;
    this.dateTime = {
      day: Math.floor(this.time / 24),
      time: this.time % 24,
    };
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
