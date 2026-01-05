export type Resource =
  | "none"
  | "SocialExperience"
  | "TechnicalExperience"
  | "AnalyticalExperience"
  | "Ideas"
  | "Information"
  | "Innovation"
  | "Insight"
  | "Knowledge"
  | "Research"
  | "Truth"
  | "Wisdom"
  | "Authority"
  | "Connection"
  | "Influence"
  | "Reputation"
  | "Trust"
  | "Popularity"
  | "Beauty"
  | "Vision"
  | "Wonder"
  | "Infrastructure"
  | "Materials"
  | "Momentum"
  | "Money"
  | "Order"
  | "Plans"
  | "Refinement"
  | "Clarity"
  | "Destruction"
  | "Failure"
  | "Deconstruction"
  | "Legacy"
  | "Mastery"
  | "Purpose"
  | "Focus"
  | "Intuition";

export type ResourceData = {
  amount: number;
  chance: number;
  // How much the final amount is influenced by the ressonance of the sine waves
  // 0 = the whole amount is given in all cases
  // 1 = the final amount is 100% influenced by the sine wave ressonance
  influence: number;
};

export const zeroResources: Record<Resource, number> = {
  none: 0,
  SocialExperience: 0,
  TechnicalExperience: 0,
  AnalyticalExperience: 0,
  Ideas: 0,
  Information: 0,
  Innovation: 0,
  Insight: 0,
  Knowledge: 0,
  Research: 0,
  Truth: 0,
  Wisdom: 0,
  Authority: 0,
  Connection: 0,
  Influence: 0,
  Reputation: 0,
  Trust: 0,
  Popularity: 0,
  Beauty: 0,
  Vision: 0,
  Wonder: 0,
  Infrastructure: 0,
  Materials: 0,
  Momentum: 0,
  Money: 0,
  Order: 0,
  Plans: 0,
  Refinement: 0,
  Clarity: 0,
  Destruction: 0,
  Failure: 0,
  Deconstruction: 0,
  Legacy: 0,
  Mastery: 0,
  Purpose: 0,
  Focus: 0,
  Intuition: 0,
};
