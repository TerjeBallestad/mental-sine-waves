import { useEffect, useReducer, useState } from "react";
import { elling, type CharacterTraits } from "../data/Characters";
import { zeroResources } from "../data/Resources";
import { AllActivities } from "../data/Activities";
import {
  calculateProgress,
  calculateResonance,
  subtractTraits,
  sumTraits,
} from "./FunctionLibrary";
import { resourceReducer } from "./ResourceReducer";

/**
 * Custom hook that calculates character traits and resource progression based on activity requirements and adaptation rating.
 */
export const useCharacter = (
  time: number,
  adaptionRating: number,
  selectedActivity: number,
) => {
  const character = elling;

  const activity = AllActivities[selectedActivity];
  const { traits: baseTraits } = character;
  const { requirements } = activity;
  const [prevAdaptionRating, setPrevAdaptionRating] = useState(adaptionRating);

  const [resources, dispatchResources] = useReducer(
    resourceReducer,
    zeroResources,
  );

  const goal = subtractTraits(requirements, baseTraits);

  if (adaptionRating !== prevAdaptionRating) {
    setPrevAdaptionRating(adaptionRating);
  }

  const adaption = (Object.keys(goal) as Array<keyof CharacterTraits>).reduce(
    (output, key) => {
      output[key] = Math.max(
        -adaptionRating,
        Math.min(adaptionRating, goal[key]),
      );
      return output;
    },
    {} as CharacterTraits,
  );
  console.log("hello");

  const traits = sumTraits(adaption, baseTraits);
  const resonance = calculateResonance(time, traits, requirements);
  const [resource, amount] = calculateProgress(character, activity, resonance);

  useEffect(() => {
    dispatchResources({ type: "added", resource, amount });
  }, [amount, resource, time]);

  return {
    traits,
    resource,
    amount,
    resonance,
    resources,
    dispatchResources,

    character,
  };
};
