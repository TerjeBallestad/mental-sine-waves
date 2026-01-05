import { useEffect, useReducer, useState } from "react";
import { characters, type CharacterTraits } from "../data/Characters";
import { zeroResources } from "../data/Resources";
import { activities } from "../data/Activities";
import {
  calculateProgress,
  calculateResonance,
  subtractTraits,
  sumTraits,
} from "./FunctionLibrary";
import { resourceReducer } from "./ResourceReducer";

/**
 * Custom hook that calculates character traits and resource progression based on activity requirements and adaptation rating.
 *
 * @param time - The current time value used for resonance calculations
 * @param adaptionRating - The maximum adaptation level that can be applied to character traits
 * @param selectedIndex - The index of the selected character from the characters array
 * @param selectedActivity - The index of the selected activity from the activities array
 *
 * @returns An object containing:
 *   - traits: The calculated character traits after adaptation
 *   - resource: The type of resource being generated
 *   - amount: The quantity of resource being generated
 *   - resonance: The calculated resonance value based on traits and requirements
 *   - resources: The current state of accumulated resources
 *   - dispatchResources: Function to dispatch resource state updates
 */
export const useCharacter = (
  time: number,
  adaptionRating: number,
  selectedIndex: number,
  selectedActivity: number,
) => {
  const char = characters[selectedIndex];
  const activity = activities[selectedActivity];
  const { traits: baseTraits } = char;
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
  const [resource, amount] = calculateProgress(
    char,
    traits,
    activity,
    resonance,
  );

  useEffect(() => {
    dispatchResources({ type: "added", resource, amount });
  }, [amount, resource, time]);

  return { traits, resource, amount, resonance, resources, dispatchResources };
};
