import { makeAutoObservable } from "mobx";

type SkillCategory =
  | "basic"
  | "analytical"
  | "creative"
  | "social"
  | "organizational"
  | "physical"
  | "technical";

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
type SkillRequirement = { skill: SkillID; level: number };

type SkillData = {
  name: string;
  id: string;
  category: SkillCategory;
  tier: SkillTier;
  description: string;
  requirements: Array<SkillRequirement>;
};

export class ASkill {
  id: SkillID;
  name: string;
  category: SkillCategory;
  tier: SkillTier;
  level = 0; // determines the cost and output
  description: string;
  requirements: Array<SkillRequirement>;

  constructor(
    id: string,
    { category, tier, name, description, requirements }: Omit<SkillData, "id">,
  ) {
    makeAutoObservable(this);
    this.id = id as SkillID;
    this.name = name;
    this.category = category;
    this.tier = tier;
    this.description = description;
    this.requirements = requirements;
  }

  clone() {
    return new ASkill(this.id, { ...this });
  }
}

export const AllSkills = {
  patternRecognition: new ASkill("patternRecognition", {
    category: "basic",
    name: "PatternRecognition",
    tier: 1,
    requirements: [],
    description: "Identifying trends, structures, regularities",
  }),
  classification: new ASkill("classification", {
    category: "basic",
    name: "Classification",
    tier: 1,
    requirements: [],
    description: "Systematic organization into groups",
  }),
  logic: new ASkill("logic", {
    category: "basic",
    name: "Logic",
    tier: 1,
    requirements: [],
    description: "Formal reasoning, deduction, proofs",
  }),
  mathematics: new ASkill("mathematics", {
    category: "basic",
    name: "Mathematics",
    tier: 1,
    requirements: [],
    description: "Advanced quantitative reasoning",
  }),
  dataAnalysis: new ASkill("dataAnalysis", {
    category: "basic",
    name: "DataAnalysis",
    tier: 1,
    requirements: [],
    description: "Statistical and quantitative interpretation",
  }),
  criticalThinking: new ASkill("criticalThinking", {
    category: "basic",
    name: "CriticalThinking",
    tier: 1,
    requirements: [],
    description: "Evaluating arguments, finding flaws",
  }),
  sequentialThinking: new ASkill("sequentialThinking", {
    category: "basic",
    name: "SequentialThinking",
    tier: 1,
    requirements: [],
    description: "Understanding order and steps",
  }),
  spatialReasoning: new ASkill("spatialReasoning", {
    category: "basic",
    name: "SpatialReasoning",
    tier: 1,
    requirements: [],
    description: "Mental manipulation of physical forms",
  }),
  numericalReasoning: new ASkill("numericalReasoning", {
    category: "basic",
    name: "NumericalReasoning",
    tier: 1,
    requirements: [],
    description: "Basic math operations",
  }),
  systemAnalysis: new ASkill("systemAnalysis", {
    category: "basic",
    name: "SystemAnalysis",
    tier: 1,
    requirements: [],
    description: "Understanding complex interconnections",
  }),
  hypotheticalReasoning: new ASkill("hypotheticalReasoning", {
    category: "basic",
    name: "HypotheticalReasoning",
    tier: 1,
    requirements: [],
    description: "Thinking about 'what if'",
  }),
  observation: new ASkill("observation", {
    category: "basic",
    name: "Observation",
    tier: 1,
    requirements: [],
    description: "Noticing details in environment",
  }),
  categorization: new ASkill("categorization", {
    category: "basic",
    name: "Categorization",
    tier: 1,
    requirements: [],
    description: "Grouping similar things",
  }),
  imitation: new ASkill("imitation", {
    category: "basic",
    name: "Imitation",
    tier: 1,
    requirements: [],
    description: "Copying observed behaviors",
  }),
  verbalExpression: new ASkill("verbalExpression", {
    category: "basic",
    name: "VerbalExpression",
    tier: 1,
    requirements: [],
    description: "Basic spoken communication",
  }),
  symbolicRepresentation: new ASkill("symbolicRepresentation", {
    category: "basic",
    name: "SymbolicRepresentation",
    tier: 1,
    requirements: [],
    description: "Using symbols (words, pictures)",
  }),
  fineMotorControl: new ASkill("fineMotorControl", {
    category: "basic",
    name: "FineMotorControl",
    tier: 1,
    requirements: [],
    description: "Hand-eye coordination",
  }),
  grossMotorControl: new ASkill("grossMotorControl", {
    category: "basic",
    name: "GrossMotorControl",
    tier: 1,
    requirements: [],
    description: "Large body movements",
  }),
  artisticObservation: new ASkill("artisticObservation", {
    category: "basic",
    name: "ArtisticObservation",
    tier: 1,
    requirements: [],
    description: "Seeing aesthetic qualities",
  }),
  imaginativePlay: new ASkill("imaginativePlay", {
    category: "basic",
    name: "ImaginativePlay",
    tier: 1,
    requirements: [],
    description: "Explorative, childlike",
  }),
  artisticExpression: new ASkill("artisticExpression", {
    category: "basic",
    name: "ArtisticExpression",
    tier: 1,
    requirements: [],
    description: "Creating aesthetic works",
  }),
  narrativeDesign: new ASkill("narrativeDesign", {
    category: "basic",
    name: "NarrativeDesign",
    tier: 1,
    requirements: [],
    description: "Crafting compelling stories",
  }),
  musicalAbility: new ASkill("musicalAbility", {
    category: "basic",
    name: "MusicalAbility",
    tier: 1,
    requirements: [],
    description: "Rhythm, harmony, composition",
  }),
  creativeSynthesis: new ASkill("creativeSynthesis", {
    category: "basic",
    name: "CreativeSynthesis",
    tier: 1,
    requirements: [],
    description: "Combining concepts in novel ways",
  }),
  aestheticJudgement: new ASkill("aestheticJudgement", {
    category: "basic",
    name: "AestheticJudgement",
    tier: 1,
    requirements: [],
    description: "Recognizing and creating beauty",
  }),
  empathy: new ASkill("empathy", {
    category: "basic",
    name: "Empathy",
    tier: 1,
    requirements: [],
    description: "Understanding others' perspectives",
  }),
  communication: new ASkill("communication", {
    category: "basic",
    name: "Communication",
    tier: 1,
    requirements: [],
    description: "Clear expression of ideas",
  }),
  cooperation: new ASkill("cooperation", {
    category: "basic",
    name: "Cooperation",
    tier: 1,
    requirements: [],
    description: "Working together toward goals",
  }),
  leadership: new ASkill("leadership", {
    category: "basic",
    name: "Leadership",
    tier: 1,
    requirements: [],
    description: "Organizing and directing groups",
  }),
  teaching: new ASkill("teaching", {
    category: "basic",
    name: "Teaching",
    tier: 1,
    requirements: [],
    description: "Transferring knowledge effectively",
  }),
  negotiation: new ASkill("negotiation", {
    category: "basic",
    name: "Negotiation",
    tier: 1,
    requirements: [],
    description: "Finding mutually beneficial outcomes",
  }),
  persuasion: new ASkill("persuasion", {
    category: "basic",
    name: "Persuasion",
    tier: 1,
    requirements: [],
    description: "Influencing opinions and decisions",
  }),
  collaboration: new ASkill("collaboration", {
    category: "basic",
    name: "Collaboration",
    tier: 1,
    requirements: [],
    description: "Deep teamwork and coordination",
  }),
  craftsmanship: new ASkill("craftsmanship", {
    category: "basic",
    name: "Craftsmanship",
    tier: 1,
    requirements: [],
    description: "Creating physical objects with quality",
  }),
  precisionWork: new ASkill("precisionWork", {
    category: "basic",
    name: "PrecisionWork",
    tier: 1,
    requirements: [],
    description: "Exact physical execution",
  }),
  toolMastery: new ASkill("toolMastery", {
    category: "basic",
    name: "ToolMastery",
    tier: 1,
    requirements: [],
    description: "Expert use of instruments/equipment",
  }),
  systemOperation: new ASkill("systemOperation", {
    category: "basic",
    name: "SystemOperation",
    tier: 1,
    requirements: [],
    description: "Running complex machinery/software",
  }),
  troubleshooting: new ASkill("troubleshooting", {
    category: "basic",
    name: "Troubleshooting",
    tier: 1,
    requirements: [],
    description: "Diagnosing and fixing problems",
  }),
  engineering: new ASkill("engineering", {
    category: "basic",
    name: "Engineering",
    tier: 1,
    requirements: [],
    description: "Designing functional systems",
  }),
  dexterity: new ASkill("dexterity", {
    category: "basic",
    name: "Dexterity",
    tier: 1,
    requirements: [],
    description: "Hand-eye coordination, fine movements",
  }),
  endurance: new ASkill("endurance", {
    category: "basic",
    name: "Endurance",
    tier: 1,
    requirements: [],
    description: "Sustained physical effort",
  }),
  strength: new ASkill("strength", {
    category: "basic",
    name: "Strength",
    tier: 1,
    requirements: [],
    description: "Force application, heavy work",
  }),
  agility: new ASkill("agility", {
    category: "basic",
    name: "Agility",
    tier: 1,
    requirements: [],
    description: "Quick movements, balance",
  }),
  planning: new ASkill("planning", {
    category: "basic",
    name: "Planning",
    tier: 1,
    requirements: [],
    description: "Creating effective strategies and schedules",
  }),
  resourceManagement: new ASkill("resourceManagement", {
    category: "basic",
    name: "ResourceManagement",
    tier: 1,
    requirements: [],
    description: "Allocating limited assets optimally",
  }),
  timeManagement: new ASkill("timeManagement", {
    category: "basic",
    name: "TimeManagement",
    tier: 1,
    requirements: [],
    description: "Prioritizing and pacing work",
  }),
  documentation: new ASkill("documentation", {
    category: "basic",
    name: "Documentation",
    tier: 1,
    requirements: [],
    description: "Recording and systematizing information",
  }),
  delegation: new ASkill("delegation", {
    category: "basic",
    name: "Delegation",
    tier: 1,
    requirements: [],
    description: "Distributing tasks effectively",
  }),
} satisfies Record<string, ASkill>;

export type SkillID = keyof typeof AllSkills;
