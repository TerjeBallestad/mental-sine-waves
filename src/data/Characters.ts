import { action, makeAutoObservable } from "mobx";
import { getGameState } from "../GameState";
import type { AActivity } from "./Activities";
import {
  calculateProgress,
  calculateResonance,
} from "../functions/FunctionLibrary";
import { ASkill, type SkillID } from "./Skills";

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

export type CharacterState = {
  energy: number;
  mentalCapacity: number;
  /* Attention

   */
  attention: number;
  /* when the player chooses something, they spend these points
    every interaction that isn't a habit costs will.
  */
  will: number;
  security: number;
  overskudd: number; // NOS
  /* Amount of tasks the character can perform at the same time

   */
  workingMemory: number;
  /* Depending on extraversion, high extraversion characters will deplete in low social situations
    Characters with low extraversion will deplete in high social situations
  */
  socialBattery: number;
  /* A multiplier for skill gains. Need to work on relevant skills to get proper skill gains
   */
  flow: number;
  /*
  To be effective, humans need a combination of cognitive, emotional, physical, and social resources. These interconnected resources help individuals manage stress, solve problems, maintain relationships, and achieve goals.
Cognitive Resources
These are the mental capacities and abilities that enable individuals to perform tasks efficiently.
Attention Control: The ability to sustain focus amidst distractions is crucial for task completion and quality work.
Memory: Strong short-term and working memory are linked to better work ability and overall health.
Problem-Solving Skills: A flexible approach to problem-solving and the ability to think critically are essential for navigating challenges.
Learning Agility: An openness to new experiences and a willingness to learn new skills boost self-confidence and a sense of purpose.
Emotional Resources
These resources relate to understanding and managing feelings and building resilience.
Emotional Intelligence (EI): The ability to recognize, understand, and manage one's own emotions, as well as empathize with others, is key to navigating social complexities and regulating stress.
Resilience: The capacity to "bounce back" after failure, adversity, or challenging situations.
Optimism and Hope: A positive outlook toward the future and the belief that there are alternate pathways to achieve a goal contribute to well-being and a productive mindset.
Self-Efficacy: The belief in one's own ability to perform tasks and achieve goals, which reinforces motivation.
Physical Resources
Physical health directly impacts mental well-being and effectiveness.
Adequate Sleep: Prioritizing quality sleep is fundamental, as it significantly impacts mood, focus, and the ability to cope with life's demands.
Physical Activity: Regular exercise reduces stress and depression, improves mood, and enhances self-esteem by causing positive chemical changes in the brain.
Nutrition: A balanced diet with essential nutrients helps maintain mood and energy levels, while poor eating habits can lead to fatigue and anxiety.
Mind-Body Practices: Techniques such as mindfulness and meditation help manage stress, improve emotional regulation, and enhance focus.
Social Resources
Strong relationships and support systems are vital for mental well-being and effectiveness.
Strong Connections: Good relationships with friends, family, and colleagues build a sense of belonging, provide emotional support, and allow for shared experiences.
Support Systems: Having a network of trusted individuals or professionals (mentors, support groups) provides a safety net during challenging times and offers different perspectives.
Sense of Purpose: Engagement in a community, job, or volunteering can provide a feeling of purpose and self-worth, which supports long-term emotional health
*/
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
  adaptionRating = 10;
  skills: Partial<Record<SkillID, ASkill>> = {};

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

    this.gameState.addResoure(resource, amount);
  }

  getSkill(skill: ASkill | SkillID): ASkill | undefined {
    return typeof skill === "object"
      ? this.getSkill(skill.id)
      : this.getSkill(skill);
  }

  hasSkill(skill: ASkill | SkillID): boolean {
    return !!this.getSkill(skill);
  }

  getSkillLevel(skill: ASkill | SkillID): number {
    return this.getSkill(skill)?.level ?? 0;
  }

  canLearnSkill(skill: ASkill): boolean {
    return skill.requirements.every(
      (req) => this.getSkillLevel(skill) >= req.level,
    );
  }

  grantSkill(skill: ASkill): boolean {
    if (this.hasSkill(skill)) {
      return true;
    }

    if (!this.canLearnSkill(skill)) {
      return false;
    }

    const newSkill = skill.clone();
    this.skills[newSkill.id] = newSkill;
    return true;
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
