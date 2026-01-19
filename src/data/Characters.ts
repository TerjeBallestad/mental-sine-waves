import { action, makeAutoObservable } from "mobx";
import { getGameState } from "../GameState";
import type { AActivity } from "./Activities";
import {
  calculateReward,
  calculateResonance,
} from "../functions/FunctionLibrary";
import { ASkill, type SkillID } from "./Skills";
import type { Resource } from "./Resources";

export type CharacterTraits = {
  agreeableness: number; //no
  conscientiousness: number; //yes
  extraversion: number; //yes
  neuroticism: number; //yes
  openness: number; //yes

  attentionSpan: number; //yes
  creativity: number; //yes
  focus: number; //yes
  fortitude: number; //yes
  intellect: number; //yes
  processingSpeed: number; //yes
  workingMemory: number; //yes
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
  overskudd: number;
  /* Amount of tasks the character can perform at the same time
   */
  workingMemory: number;
  /* Depending on extraversion, high extraversion characters will deplete in low social situations
   * Characters with low extraversion will deplete in high social situations
   * Different from social need. You can have all your social needs met but have your social battery drained
   */
  socialBattery: number;
  /* A multiplier for skill gains. Need to work on relevant skills to get proper skill gains
   */
  flow: number;
  /*  Different from hunger, this is a meassure of how healthy the food that has been eaten
   */
  nutrition: number;
  purpose: number;
  /* Indicator for all fundamental needs (bladder, social, energy, fun, hunger)
   */
  mood: number;
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
  agreeableness: 0,
  attentionSpan: 0,
  conscientiousness: 0,
  creativity: 0,
  extraversion: 0,
  focus: 0,
  fortitude: 0,
  intellect: 0,
  neuroticism: 0,
  openness: 0,
  processingSpeed: 0,
  workingMemory: 0,
};

export const startingCharacterState: CharacterState = {
  attention: 30,
  energy: 80,
  flow: 10,
  mentalCapacity: 80,
  mood: 50,
  nutrition: 50,
  overskudd: 20,
  purpose: 10,
  security: 40,
  socialBattery: 70,
  will: 40,
  workingMemory: 66,
};

export class ACharacter {
  name: string;
  color: string;
  traits: CharacterTraits;
  currentActivity?: AActivity;
  adaptionRating = 10;
  skills: Partial<Record<SkillID, ASkill>> = {};
  state = startingCharacterState;
  overskudd = 30;
  baseOverskuddRegen = 2.0;
  interests: string[];
  // Track mastery per activity (activityId -> mastery points)
  activityMastery: Map<string, number> = new Map();

  description?: string;
  recentRewards = Array<{
    resource: Resource;
    amount: number;
    resonance: number;
    time: number;
  }>();

  private get gameState() {
    return getGameState();
  }

  /**
   * Overskudd per hour - regeneration based on all mental states
   * Slower base rate, can go negative
   */
  get overskuddRegen() {
    // Reduced base regen rate (slower than before)
    let regen = this.baseOverskuddRegen * 0.5; // 50% of original base rate

    const {
      energy,
      will,
      attention,
      mentalCapacity,
      socialBattery,
      mood,
      nutrition,
      security,
      purpose,
      flow,
    } = this.state;

    // Energy modifier: -30% to +30% regen
    const energyModifier = ((energy - 50) / 50) * 0.3;
    regen *= 1 + energyModifier;

    // Will modifier: -20% to +20% regen
    const willModifier = ((will - 50) / 50) * 0.2;
    regen *= 1 + willModifier;

    // Attention modifier: -25% to +25% regen
    const attentionModifier = ((attention - 50) / 50) * 0.25;
    regen *= 1 + attentionModifier;

    // Mental Capacity modifier: -20% to +20% regen
    const mentalCapacityModifier = ((mentalCapacity - 50) / 50) * 0.2;
    regen *= 1 + mentalCapacityModifier;

    // Social Battery modifier: -15% to +15% regen
    const socialBatteryModifier = ((socialBattery - 50) / 50) * 0.15;
    regen *= 1 + socialBatteryModifier;

    // Nutrition modifier: -30% to +30% regen
    const nutritionModifier = ((nutrition - 50) / 50) * 0.3;
    regen *= 1 + nutritionModifier;

    // Mood modifier: -25% to +25% regen
    const moodModifier = ((mood - 50) / 50) * 0.25;
    regen *= 1 + moodModifier;

    // Security modifier: -20% to +20% regen
    const securityModifier = ((security - 50) / 50) * 0.2;
    regen *= 1 + securityModifier;

    // Purpose modifier: -15% to +15% regen
    const purposeModifier = ((purpose - 50) / 50) * 0.15;
    regen *= 1 + purposeModifier;

    // Flow modifier: +0% to +30% regen (bonus only)
    const flowModifier = flow / 100 * 0.3;
    regen *= 1 + flowModifier;

    // Allow negative regen (no minimum floor)
    return regen;
  }

  /**
   * Update character state over time (passive regeneration)
   * Called every game update tick
   */
  updateState(deltaTimeHours: number) {
    // Overskudd regeneration (already calculated)
    // Allow negative values - no cap
    const overskuddRegen = this.overskuddRegen * deltaTimeHours;
    this.state.overskudd = this.state.overskudd + overskuddRegen;

    // Energy regeneration based on nutrition and rest
    const energyRegenBase = 5; // per hour
    let energyRegen = energyRegenBase;
    // Nutrition affects energy regen: -30% to +50%
    const nutritionModifier = ((this.state.nutrition - 50) / 50) * 0.5;
    energyRegen *= 1 + nutritionModifier;
    // If not doing activity, regen faster
    if (!this.currentActivity) {
      energyRegen *= 1.5;
    }
    this.state.energy = Math.min(100, this.state.energy + energyRegen * deltaTimeHours);

    // Will regeneration based on mood and security
    const willRegenBase = 2; // per hour
    let willRegen = willRegenBase;
    // Mood affects will regen: -40% to +40%
    const moodModifier = ((this.state.mood - 50) / 50) * 0.4;
    willRegen *= 1 + moodModifier;
    // Security affects will regen: -20% to +30%
    const securityModifier = ((this.state.security - 50) / 50) * 0.3;
    willRegen *= 1 + securityModifier;
    this.state.will = Math.min(100, this.state.will + willRegen * deltaTimeHours);

    // Attention regeneration based on flow and rest
    const attentionRegenBase = 3; // per hour
    let attentionRegen = attentionRegenBase;
    // Flow affects attention regen: +0% to +100%
    attentionRegen *= 1 + this.state.flow / 100;
    // If not doing activity, regen faster
    if (!this.currentActivity) {
      attentionRegen *= 1.3;
    }
    this.state.attention = Math.min(100, this.state.attention + attentionRegen * deltaTimeHours);

    // Mental capacity regeneration
    const mentalCapacityRegenBase = 4; // per hour
    let mentalCapacityRegen = mentalCapacityRegenBase;
    // Energy affects mental capacity regen: -30% to +30%
    const energyModifier = ((this.state.energy - 50) / 50) * 0.3;
    mentalCapacityRegen *= 1 + energyModifier;
    // If not doing activity, regen faster
    if (!this.currentActivity) {
      mentalCapacityRegen *= 1.4;
    }
    this.state.mentalCapacity = Math.min(
      100,
      this.state.mentalCapacity + mentalCapacityRegen * deltaTimeHours,
    );

    // Social battery regeneration based on extraversion
    const socialBatteryRegenBase = 2; // per hour
    let socialBatteryRegen = socialBatteryRegenBase;
    // Extraversion affects regen: introverts regen faster when alone, extroverts slower
    const extraversionModifier = (this.traits.extraversion - 50) / 50;
    if (!this.currentActivity || this.currentActivity.mentalSignature.extraversion < 30) {
      // Alone or low-social activity
      socialBatteryRegen *= 1 + extraversionModifier * 0.5; // Introverts regen faster
    } else {
      // Social activity
      socialBatteryRegen *= 1 - extraversionModifier * 0.3; // Extroverts regen slower (they're using it)
    }
    this.state.socialBattery = Math.min(
      100,
      this.state.socialBattery + socialBatteryRegen * deltaTimeHours,
    );

    // Nutrition decay (slowly decreases over time)
    const nutritionDecay = 0.5; // per hour
    this.state.nutrition = Math.max(0, this.state.nutrition - nutritionDecay * deltaTimeHours);

    // Mood update based on multiple factors
    const moodChangeBase = 0.2; // per hour (tends toward neutral)
    let moodChange = (50 - this.state.mood) * moodChangeBase * deltaTimeHours;
    // Energy affects mood: low energy = worse mood
    if (this.state.energy < 30) {
      moodChange -= 0.5 * deltaTimeHours;
    } else if (this.state.energy > 70) {
      moodChange += 0.3 * deltaTimeHours;
    }
    // Security affects mood
    if (this.state.security < 30) {
      moodChange -= 0.3 * deltaTimeHours;
    } else if (this.state.security > 70) {
      moodChange += 0.2 * deltaTimeHours;
    }
    this.state.mood = Math.max(0, Math.min(100, this.state.mood + moodChange));

    // Flow decay (slowly decreases)
    const flowDecay = 0.3; // per hour
    this.state.flow = Math.max(0, this.state.flow - flowDecay * deltaTimeHours);

    // Purpose decay (slowly decreases)
    const purposeDecay = 0.1; // per hour
    this.state.purpose = Math.max(0, this.state.purpose - purposeDecay * deltaTimeHours);

    // Security decay (slowly decreases)
    const securityDecay = 0.2; // per hour
    this.state.security = Math.max(0, this.state.security - securityDecay * deltaTimeHours);
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

  /**
   * Check if character would refuse to do this activity based on hidden stat thresholds
   */
  willCharacterRefuseActivity(activity: AActivity): { willRefuse: boolean; reason?: string } {
    const costs = activity.getEffectiveCosts(this);

    // Check will-power threshold - character needs at least 1.5x the required will
    if (costs.will && costs.will > 0) {
      const requiredWill = costs.will * 1.5;
      if (this.state.will < requiredWill) {
        return {
          willRefuse: true,
          reason: `${this.name} doesn't have enough willpower for this task`,
        };
      }
    }

    // Check energy threshold for physically demanding activities (energy cost > 15)
    if (costs.energy && costs.energy > 15) {
      const requiredEnergy = costs.energy * 1.3;
      if (this.state.energy < requiredEnergy) {
        return {
          willRefuse: true,
          reason: `${this.name} is too tired for this physically demanding task`,
        };
      }
    }

    // Check attention threshold for cognitive activities (attention cost > 15)
    if (costs.attention && costs.attention > 15) {
      const requiredAttention = costs.attention * 1.3;
      if (this.state.attention < requiredAttention) {
        return {
          willRefuse: true,
          reason: `${this.name} can't focus enough for this cognitive task`,
        };
      }
    }

    // Check mentalCapacity threshold for complex activities (mentalCapacity cost > 15)
    if (costs.mentalCapacity && costs.mentalCapacity > 15) {
      const requiredMentalCapacity = costs.mentalCapacity * 1.3;
      if (this.state.mentalCapacity < requiredMentalCapacity) {
        return {
          willRefuse: true,
          reason: `${this.name} doesn't have enough mental capacity for this complex task`,
        };
      }
    }

    // Check socialBattery threshold for social activities (socialBattery cost > 15)
    if (costs.socialBattery && costs.socialBattery > 15) {
      const requiredSocialBattery = costs.socialBattery * 1.3;
      if (this.state.socialBattery < requiredSocialBattery) {
        return {
          willRefuse: true,
          reason: `${this.name} doesn't have enough social energy for this task`,
        };
      }
    }

    return { willRefuse: false };
  }

  /**
   * Check if character can afford the activity costs
   * Now checks Overskudd threshold and refusal system
   */
  canAffordActivity(activity: AActivity): { can: boolean; reason?: string } {
    // Check if character would refuse
    const refusalCheck = this.willCharacterRefuseActivity(activity);
    if (refusalCheck.willRefuse) {
      return { can: false, reason: refusalCheck.reason };
    }

    // Check Overskudd threshold (need at least 10 overskudd to start)
    const minOverskuddThreshold = 10;
    if (this.state.overskudd < minOverskuddThreshold) {
      return {
        can: false,
        reason: `Not enough overskudd (need at least ${minOverskuddThreshold})`,
      };
    }

    return { can: true };
  }

  /**
   * Apply continuous Overskudd drain during activity
   * Returns true if activity should continue, false if it should stop (overskudd went negative)
   */
  applyActivityDrain(activity: AActivity, deltaTimeHours: number): boolean {
    const drainRate = activity.getOverskuddDrainRate(this);
    const drainAmount = drainRate * deltaTimeHours;

    this.state.overskudd -= drainAmount;

    // Stop activity if Overskudd goes negative
    if (this.state.overskudd < 0) {
      this.currentActivity = undefined;
      return false;
    }

    return true;
  }

  /**
   * Get mastery level for an activity
   */
  getActivityMastery(activity: AActivity): number {
    return this.activityMastery.get(activity.id) || 0;
  }

  /**
   * Get mastery level (0-10) for an activity
   */
  getActivityMasteryLevel(activity: AActivity): number {
    const mastery = this.getActivityMastery(activity);
    const thresholds = activity.masteryThresholds;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (mastery >= thresholds[i]) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Grant mastery points for completing an activity
   */
  private grantActivityMastery(activity: AActivity, resonance: number) {
    const baseMastery = 0.5; // Base mastery per activity tick
    const resonanceMultiplier = 0.5 + resonance * 0.5; // Better resonance = more mastery
    const masteryGain = baseMastery * resonanceMultiplier;

    const currentMastery = this.getActivityMastery(activity);
    this.activityMastery.set(activity.id, currentMastery + masteryGain);
  }

  /**
   * Grant experience to skills based on activity performance
   */
  private grantSkillExperience(activity: AActivity, resonance: number) {
    const baseExperience = 1; // Base experience per activity tick
    const resonanceMultiplier = 0.5 + resonance * 0.5; // 0.5x to 1.0x based on resonance
    const flowMultiplier = 1 + this.state.flow / 100; // Flow increases experience gain

    const experienceGain = baseExperience * resonanceMultiplier * flowMultiplier;

    // Grant experience to required skills
    activity.requiredSkills.forEach((req) => {
      const skill = this.getSkill(req.id);
      if (skill) {
        const leveledUp = skill.addExperience(experienceGain * 2); // 2x for required skills
        if (leveledUp) {
          // Skill leveled up! Could trigger notification here
        }
      }
    });

    // Grant experience to recommended skills (less than required)
    activity.recomendedSkills.forEach((rec) => {
      const skill = this.getSkill(rec.id);
      if (skill) {
        skill.addExperience(experienceGain * 1.2); // 1.2x for recommended skills
      }
    });

    // Grant experience to skills in the lol field (bonus skills)
    Object.entries(activity.lol || {}).forEach(([skillId, multiplier]) => {
      const skill = this.getSkill(skillId as SkillID);
      if (skill) {
        skill.addExperience(experienceGain * multiplier);
      }
    });
  }

  doActivity(activity: AActivity) {
    if (
      this.gameState.time - activity.previousIntervalTime <
      activity.rewardInterval
    ) {
      return;
    }

    // Set current activity if not already set
    if (!this.currentActivity) {
      // Check if can afford
      const affordCheck = this.canAffordActivity(activity);
      if (!affordCheck.can) {
        return; // Silently fail if can't afford
      }
      this.currentActivity = activity;
    }

    // Verify we're still doing this activity
    if (this.currentActivity !== activity) {
      return;
    }

    // Apply continuous Overskudd drain
    const deltaTime = activity.rewardInterval;
    const shouldContinue = this.applyActivityDrain(activity, deltaTime);

    // If Overskudd went negative, stop the activity
    if (!shouldContinue) {
      activity.previousIntervalTime = this.gameState.time;
      return;
    }

    activity.previousIntervalTime = this.gameState.time;

    const resonance = calculateResonance(
      this.gameState.time,
      this.traits,
      activity.mentalSignature,
    );
    const [resource, baseAmount] = calculateReward(this, activity, resonance);

    // Apply mastery multiplier to rewards
    const masteryMultiplier = activity.getRewardMultiplier(this);
    const amount = Math.floor(baseAmount * masteryMultiplier);

    // Grant skill experience
    this.grantSkillExperience(activity, resonance);

    // Grant activity mastery
    this.grantActivityMastery(activity, resonance);

    // Increase flow based on resonance (good performance increases flow)
    if (resonance > 0.7) {
      this.state.flow = Math.min(100, this.state.flow + 0.5);
    }

    // Increase purpose slightly when doing meaningful activities
    if (activity.baseDifficulty >= 5) {
      this.state.purpose = Math.min(100, this.state.purpose + 0.1);
    }

    this.gameState.addResoure(resource, amount);
    this.recentRewards.unshift({
      resource,
      amount,
      resonance,
      time: Date.now(),
    });

    this.recentRewards.splice(48);
    // console.log(this.recentRewards);
  }

  getSkill(skill: ASkill | SkillID): ASkill | undefined {
    return typeof skill === "object"
      ? this.skills[skill.id]
      : this.skills[skill];
  }

  hasSkill(skill: ASkill | SkillID): boolean {
    return !!this.getSkill(skill);
  }

  getSkillLevel(skill: ASkill | SkillID): number {
    return this.getSkill(skill)?.level ?? 0;
  }

  canLearnSkill(skill: ASkill): boolean {
    return skill.requirements.every(
      (req) => this.getSkillLevel(req.id) >= req.level,
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
