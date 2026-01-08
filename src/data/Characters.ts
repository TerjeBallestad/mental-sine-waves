import { action, makeAutoObservable } from "mobx";
import { getGameState } from "../GameState";
import type { AActivity } from "./Activities";
import {
  calculateProgress,
  calculateResonance,
} from "../functions/FunctionLibrary";

export type CharacterTraits = {
  workingMemory: number; //yes
  intellect: number; //yes
  agreeableness: number; //no
  attentionSpan: number; //yes
  processingSpeed: number; //yes
  fortitude: number; //yes
  creativity: number; //yes
  focus: number; //yes
  openness: number; //yes
  conscientiousness: number; //yes
  extraversion: number; //yes
  neuroticism: number; //yes
};

export type CharacterData = {
  name: string;
  color: string;
  traits: CharacterTraits;
  interests: string[];
  description?: string;
};

export const emptyTraits: CharacterTraits = {
  attentionSpan: 0,
  processingSpeed: 0,
  workingMemory: 0,
  fortitude: 0,
  creativity: 0,
  focus: 0,
  intellect: 0,
  openness: 0,
  conscientiousness: 0,
  extraversion: 0,
  agreeableness: 0,
  neuroticism: 0,
};

export class ACharacter {
  name: string;
  color: string;
  traits: CharacterTraits;
  currentActivity?: AActivity;
  interests: string[];

  description?: string;

  private get gameState() {
    return getGameState();
  }

  constructor(
    name: string,
    { color, interests, traits, description }: Omit<CharacterData, "name">,
  ) {
    makeAutoObservable(this, {
      doActivity: action,
    });
    this.name = name;
    this.color = color;
    this.traits = traits;
    this.interests = interests;
    this.description = description;
  }

  doActivity(activity: AActivity, progress: number) {
    this.currentActivity = activity;
    console.log(activity, progress);

    const resonance = calculateResonance(
      this.gameState.time,
      this.traits,
      activity.requirements,
    );
    const [resource, amount] = calculateProgress(this, activity, resonance);
    console.log(resonance, resource, amount);

    this.gameState.addResoure(resource, amount);
  }
}

export const elling = new ACharacter("Elling", {
  color: "#3b82f6",
  traits: {
    // Cognitive traits
    attentionSpan: 45,
    processingSpeed: 60,
    workingMemory: 70,
    fortitude: 40, // → frequency (low stamina = slow, deliberate)
    creativity: 75, // → harmonics complexity
    focus: 55, // → amplitude (focused output)
    intellect: 50,
    // Personality traits
    openness: 70,
    conscientiousness: 60,
    extraversion: 30,
    agreeableness: 50,
    neuroticism: 65,
  },
  interests: ["writing", "observation", "solitude"],
  description: "Anxious, creative, needs routine with breaks",
});

export const testDummy = new ACharacter("Test Dummy", {
  color: "#ff00ff",
  traits: {
    attentionSpan: 50,
    processingSpeed: 20,
    workingMemory: 10,
    fortitude: 10,
    creativity: 10,
    focus: 10,
    intellect: 20,
    openness: 1,
    conscientiousness: 1,
    extraversion: 1,
    agreeableness: 1,
    neuroticism: 1,
  },
  interests: ["routine", "observation"],
  description: "Balanced, neutral character for testing",
});

export const kjellBjarne = new ACharacter("Kjell-Bjarne", {
  color: "#10b981",
  traits: {
    attentionSpan: 55,
    processingSpeed: 50,
    workingMemory: 60,
    fortitude: 70, // → high stamina = consistent pace
    creativity: 40,
    focus: 65, // → strong focused output
    intellect: 20,
    openness: 40,
    conscientiousness: 80,
    extraversion: 50,
    agreeableness: 70,
    neuroticism: 30,
  },
  interests: ["cooking", "routine", "helping"],
  description: "Steady, reliable, prefers consistent pace",
});

export const nora = new ACharacter("Nora", {
  color: "#8b5cf6",
  traits: {
    attentionSpan: 70,
    processingSpeed: 75,
    workingMemory: 65,
    fortitude: 60, // → good stamina = adaptive rhythm
    creativity: 80, // → complex thinking patterns
    focus: 70, // → strong execution
    intellect: 70,
    openness: 85,
    conscientiousness: 55,
    extraversion: 60,
    agreeableness: 40,
    neuroticism: 25,
  },
  interests: ["self-discovery", "social-dynamics", "independence"],
  description: "Dynamic, adaptable, thrives on variety",
});
