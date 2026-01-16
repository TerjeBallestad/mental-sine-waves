import { makeAutoObservable } from "mobx";

export class ASkill {
  id: SkillID;
  name: string;
  category: SkillCategory;
  tier: SkillTier;
  level = 0; // determines the cost and output
  description: string;
  requirements: Array<SkillRequirement>;

  constructor(
    id: SkillID,
    { category, tier, name, description, requirements }: Omit<SkillData, "id">,
  ) {
    makeAutoObservable(this);
    this.id = id;
    this.name = name;
    this.category = category;
    this.tier = tier;
    this.description = description;
    this.requirements = requirements;
  }

  clone() {
    return new ASkill(this.id, { ...this });
  }

  increaseSkill() {
    if (this.level < 10) {
      this.level++;
    }
  }

  decreaseSkill() {
    if (this.level > 0) {
      this.level--;
    }
  }
}

export const AllSkills = {
  // Tier 0: Sensorimotor (Birth-2 years) - Basic perception and physical interaction
  grossMotorControl: new ASkill("grossMotorControl", {
    category: "physical",
    name: "GrossMotorControl",
    tier: 1,
    requirements: [],
    description: "Large body movements",
  }),
  fineMotorControl: new ASkill("fineMotorControl", {
    category: "physical",
    name: "FineMotorControl",
    tier: 1,
    requirements: [],
    description: "Hand-eye coordination",
  }),

  // Tier 1: Preoperational (2-7 years) - Symbolic thinking, imitation, basic observation
  observation: new ASkill("observation", {
    category: "basic",
    name: "Observation",
    tier: 1,
    requirements: [],
    description: "Noticing details in environment",
  }),
  imitation: new ASkill("imitation", {
    category: "basic",
    name: "Imitation",
    tier: 1,
    requirements: [],
    description: "Copying observed behaviors",
  }),
  symbolicRepresentation: new ASkill("symbolicRepresentation", {
    category: "basic",
    name: "SymbolicRepresentation",
    tier: 1,
    requirements: [],
    description: "Using symbols (words, pictures)",
  }),
  categorization: new ASkill("categorization", {
    category: "basic",
    name: "Categorization",
    tier: 1,
    requirements: [],
    description: "Grouping similar things",
  }),
  verbalExpression: new ASkill("verbalExpression", {
    category: "basic",
    name: "VerbalExpression",
    tier: 1,
    requirements: [],
    description: "Basic spoken communication",
  }),
  imaginativePlay: new ASkill("imaginativePlay", {
    category: "creative",
    name: "ImaginativePlay",
    tier: 1,
    requirements: [],
    description: "Explorative, childlike",
  }),
  artisticObservation: new ASkill("artisticObservation", {
    category: "creative",
    name: "ArtisticObservation",
    tier: 1,
    requirements: [],
    description: "Seeing aesthetic qualities",
  }),
  empathy: new ASkill("empathy", {
    category: "social",
    name: "Empathy",
    tier: 1,
    requirements: [],
    description: "Understanding others' perspectives",
  }),
  cooperation: new ASkill("cooperation", {
    category: "social",
    name: "Cooperation",
    tier: 1,
    requirements: [],
    description: "Working together toward goals",
  }),
  communication: new ASkill("communication", {
    category: "social",
    name: "Communication",
    tier: 1,
    requirements: [],
    description: "Clear expression of ideas",
  }),

  // Tier 2: Concrete Operational (7-11 years) - Logic about concrete objects, systematic classification
  logic: new ASkill("logic", {
    category: "analytical",
    name: "Logic",
    tier: 2,
    requirements: [{ skill: "categorization", level: 3 }],
    description: "Formal reasoning, deduction, proofs",
  }),
  patternRecognition: new ASkill("patternRecognition", {
    category: "analytical",
    name: "PatternRecognition",
    tier: 2,
    requirements: [{ skill: "observation", level: 3 }],
    description: "Identifying trends, structures, regularities",
  }),
  classification: new ASkill("classification", {
    category: "analytical",
    name: "Classification",
    tier: 2,
    requirements: [{ skill: "categorization", level: 3 }],
    description: "Systematic organization into groups",
  }),
  sequentialThinking: new ASkill("sequentialThinking", {
    category: "analytical",
    name: "SequentialThinking",
    tier: 2,
    requirements: [{ skill: "observation", level: 3 }],
    description: "Understanding order and steps",
  }),
  spatialReasoning: new ASkill("spatialReasoning", {
    category: "analytical",
    name: "SpatialReasoning",
    tier: 2,
    requirements: [{ skill: "fineMotorControl", level: 3 }],
    description: "Mental manipulation of physical forms",
  }),
  numericalReasoning: new ASkill("numericalReasoning", {
    category: "analytical",
    name: "NumericalReasoning",
    tier: 2,
    requirements: [{ skill: "categorization", level: 3 }],
    description: "Basic math operations",
  }),
  dataAnalysis: new ASkill("dataAnalysis", {
    category: "analytical",
    name: "DataAnalysis",
    tier: 2,
    requirements: [{ skill: "numericalReasoning", level: 3 }],
    description: "Statistical and quantitative interpretation",
  }),
  planning: new ASkill("planning", {
    category: "organizational",
    name: "Planning",
    tier: 2,
    requirements: [{ skill: "sequentialThinking", level: 3 }],
    description: "Creating effective strategies and schedules",
  }),
  timeManagement: new ASkill("timeManagement", {
    category: "organizational",
    name: "TimeManagement",
    tier: 2,
    requirements: [{ skill: "sequentialThinking", level: 3 }],
    description: "Prioritizing and pacing work",
  }),
  documentation: new ASkill("documentation", {
    category: "organizational",
    name: "Documentation",
    tier: 2,
    requirements: [{ skill: "symbolicRepresentation", level: 3 }],
    description: "Recording and systematizing information",
  }),
  artisticExpression: new ASkill("artisticExpression", {
    category: "creative",
    name: "ArtisticExpression",
    tier: 2,
    requirements: [{ skill: "artisticObservation", level: 3 }],
    description: "Creating aesthetic works",
  }),
  craftsmanship: new ASkill("craftsmanship", {
    category: "technical",
    name: "Craftsmanship",
    tier: 2,
    requirements: [{ skill: "fineMotorControl", level: 3 }],
    description: "Creating physical objects with quality",
  }),
  toolMastery: new ASkill("toolMastery", {
    category: "technical",
    name: "ToolMastery",
    tier: 2,
    requirements: [{ skill: "fineMotorControl", level: 3 }],
    description: "Expert use of instruments/equipment",
  }),
  leadership: new ASkill("leadership", {
    category: "social",
    name: "Leadership",
    tier: 2,
    requirements: [{ skill: "cooperation", level: 3 }],
    description: "Organizing and directing groups",
  }),
  teaching: new ASkill("teaching", {
    category: "social",
    name: "Teaching",
    tier: 2,
    requirements: [{ skill: "communication", level: 3 }],
    description: "Transferring knowledge effectively",
  }),
  collaboration: new ASkill("collaboration", {
    category: "social",
    name: "Collaboration",
    tier: 2,
    requirements: [{ skill: "cooperation", level: 3 }],
    description: "Deep teamwork and coordination",
  }),
  dexterity: new ASkill("dexterity", {
    category: "physical",
    name: "Dexterity",
    tier: 2,
    requirements: [{ skill: "fineMotorControl", level: 3 }],
    description: "Hand-eye coordination, fine movements",
  }),
  agility: new ASkill("agility", {
    category: "physical",
    name: "Agility",
    tier: 2,
    requirements: [{ skill: "grossMotorControl", level: 3 }],
    description: "Quick movements, balance",
  }),

  // Tier 3: Formal Operational (11+ years) - Abstract reasoning, hypothetical thinking
  criticalThinking: new ASkill("criticalThinking", {
    category: "analytical",
    name: "CriticalThinking",
    tier: 3,
    requirements: [{ skill: "logic", level: 5 }],
    description: "Evaluating arguments, finding flaws",
  }),
  hypotheticalReasoning: new ASkill("hypotheticalReasoning", {
    category: "analytical",
    name: "HypoticalReasoning",
    tier: 3,
    requirements: [{ skill: "logic", level: 5 }],
    description: "Thinking about 'what if'",
  }),
  systemAnalysis: new ASkill("systemAnalysis", {
    category: "analytical",
    name: "SystemAnalysis",
    tier: 3,
    requirements: [{ skill: "patternRecognition", level: 5 }],
    description: "Understanding complex interconnections",
  }),
  mathematics: new ASkill("mathematics", {
    category: "analytical",
    name: "Mathematics",
    tier: 3,
    requirements: [{ skill: "dataAnalysis", level: 5 }],
    description: "Advanced quantitative reasoning",
  }),
  narrativeDesign: new ASkill("narrativeDesign", {
    category: "creative",
    name: "NarrativeDesign",
    tier: 3,
    requirements: [{ skill: "artisticExpression", level: 5 }],
    description: "Crafting compelling stories",
  }),
  musicalAbility: new ASkill("musicalAbility", {
    category: "creative",
    name: "MusicalAbility",
    tier: 3,
    requirements: [{ skill: "artisticExpression", level: 5 }],
    description: "Rhythm, harmony, composition",
  }),
  creativeSynthesis: new ASkill("creativeSynthesis", {
    category: "creative",
    name: "CreativeSynthesis",
    tier: 3,
    requirements: [{ skill: "hypotheticalReasoning", level: 5 }],
    description: "Combining concepts in novel ways",
  }),
  aestheticJudgement: new ASkill("aestheticJudgement", {
    category: "creative",
    name: "AestheticJudgement",
    tier: 3,
    requirements: [{ skill: "criticalThinking", level: 5 }],
    description: "Recognizing and creating beauty",
  }),
  negotiation: new ASkill("negotiation", {
    category: "social",
    name: "Negotiation",
    tier: 3,
    requirements: [{ skill: "communication", level: 5 }],
    description: "Finding mutually beneficial outcomes",
  }),
  persuasion: new ASkill("persuasion", {
    category: "social",
    name: "Persuasion",
    tier: 3,
    requirements: [{ skill: "communication", level: 5 }],
    description: "Influencing opinions and decisions",
  }),
  resourceManagement: new ASkill("resourceManagement", {
    category: "organizational",
    name: "ResourceManagement",
    tier: 3,
    requirements: [{ skill: "planning", level: 5 }],
    description: "Allocating limited assets optimally",
  }),
  delegation: new ASkill("delegation", {
    category: "organizational",
    name: "Delegation",
    tier: 3,
    requirements: [{ skill: "leadership", level: 5 }],
    description: "Distributing tasks effectively",
  }),
  precisionWork: new ASkill("precisionWork", {
    category: "technical",
    name: "PrecisionWork",
    tier: 3,
    requirements: [{ skill: "craftsmanship", level: 5 }],
    description: "Exact physical execution",
  }),
  systemOperation: new ASkill("systemOperation", {
    category: "technical",
    name: "SystemOperation",
    tier: 3,
    requirements: [{ skill: "toolMastery", level: 5 }],
    description: "Running complex machinery/software",
  }),
  troubleshooting: new ASkill("troubleshooting", {
    category: "technical",
    name: "Troubleshooting",
    tier: 3,
    requirements: [{ skill: "systemAnalysis", level: 5 }],
    description: "Diagnosing and fixing problems",
  }),
  strength: new ASkill("strength", {
    category: "physical",
    name: "Strength",
    tier: 3,
    requirements: [{ skill: "grossMotorControl", level: 5 }],
    description: "Force application, heavy work",
  }),
  endurance: new ASkill("endurance", {
    category: "physical",
    name: "Endurance",
    tier: 3,
    requirements: [{ skill: "agility", level: 5 }],
    description: "Sustained physical effort",
  }),

  // Tier 4: Post-Formal (Adult expertise) - Domain mastery, creative synthesis, wisdom
  engineering: new ASkill("engineering", {
    category: "technical",
    name: "Engineering",
    tier: 3,
    requirements: [
      { skill: "systemAnalysis", level: 7 },
      { skill: "mathematics", level: 7 },
    ],
    description: "Designing functional systems",
  }),
} satisfies Record<SkillID, ASkill>;

export type SkillCategory =
  | "basic"
  | "analytical"
  | "creative"
  | "social"
  | "organizational"
  | "physical"
  | "technical";

export const SkillCategoryLabels: Record<SkillCategory, string> = {
  basic: "Grunnleggende",
  analytical: "Analytisk",
  creative: "Kreativ",
  organizational: "Organisatorisk",
  physical: "Fysisk",
  social: "Sosial",
  technical: "Teknisk",
};

/**
 * what cognitive tier is the skill?
 * **Tier 0: Sensorimotor Skills (Birth-2 years equivalent)**
 * - Basic perception and physical interaction with world
 * - Foundation for all other learning
 * - Automatically present in characters (pre-game development)
 *
 * **Tier 1: Preoperational Skills (2-7 years equivalent)**
 * - Basic symbolic thinking
 * - Simple categorization
 * - Direct observation and imitation
 * - Required Level: Can begin immediately
 *
 * **Tier 2: Concrete Operational Skills (7-11 years equivalent)**
 * - Logical thinking about concrete objects
 * - Conservation, reversibility
 * - Systematic classification
 * - Required: Tier 1 foundation skills at level 3+
 *
 * **Tier 3: Formal Operational Skills (11+ years equivalent)**
 * - Abstract reasoning
 * - Hypothetical thinking
 * - Complex problem-solving
 * - Required: Tier 2 foundation skills at level 5+
 *
 * **Tier 4: Post-Formal Skills (Adult expertise)**
 * - Domain mastery
 * - Creative synthesis
 * - Wisdom and intuition
 * - Required: Tier 3 foundation skills at level 7+
 */
type SkillTier = 1 | 2 | 3 | 4;
export type SkillRequirement = { skill: SkillID; level: number };

type SkillData = {
  name: string;
  id: SkillID;
  category: SkillCategory;
  tier: SkillTier;
  description: string;
  requirements: SkillRequirement[];
};

export type SkillID =
  | "grossMotorControl"
  | "fineMotorControl"
  | "observation"
  | "imitation"
  | "symbolicRepresentation"
  | "categorization"
  | "verbalExpression"
  | "imaginativePlay"
  | "artisticObservation"
  | "empathy"
  | "cooperation"
  | "communication"
  | "logic"
  | "patternRecognition"
  | "classification"
  | "sequentialThinking"
  | "spatialReasoning"
  | "numericalReasoning"
  | "dataAnalysis"
  | "planning"
  | "timeManagement"
  | "documentation"
  | "artisticExpression"
  | "craftsmanship"
  | "toolMastery"
  | "leadership"
  | "teaching"
  | "collaboration"
  | "dexterity"
  | "agility"
  | "criticalThinking"
  | "hypotheticalReasoning"
  | "systemAnalysis"
  | "mathematics"
  | "narrativeDesign"
  | "musicalAbility"
  | "creativeSynthesis"
  | "aestheticJudgement"
  | "negotiation"
  | "persuasion"
  | "resourceManagement"
  | "delegation"
  | "precisionWork"
  | "systemOperation"
  | "troubleshooting"
  | "strength"
  | "endurance"
  | "engineering";
