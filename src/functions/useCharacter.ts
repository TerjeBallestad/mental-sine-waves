import { useEffect, useReducer, useState } from "react";
import { characters, type CharacterTraits } from "../data/Data";
import { zeroResources } from "../data/Resources";
import { activities } from "../data/Activities";
import {
  calculateProgress,
  calculateResonance,
  subtractTraits,
  sumTraits,
} from "./FunctionLibrary";
import { resourceReducer } from "./ResourceReducer";

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

  // useEffect(() => {
  //   console.log("time also");
  // }, [time]);
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

//   useEffect(() => {
//   setAdaption((prev) =>
//     Object.keys(prev).reduce((output, key) => {
//       const typedKey = key as keyof CharacterTraits;
//       output[typedKey] = Math.max(
//         -10,
//         Math.min(
//           10,
//           prev[typedKey] +
//             Math.max(-1, Math.min(1, goal[typedKey] - prev[typedKey])),
//         ),
//       );

//       return output;
//     }, {} as CharacterTraits),
//   );
//   }, [time, goal]);
