import { useState } from "react";
import { activities, characters, type CharacterTraits } from "./Data";
import {
  calculateProgress,
  calculateResonance,
  subtractTraits,
  sumTraits,
} from "./FunctionLibrary";

export const useCharacter = (
  time: number,
  adaptionRating: number,
  selectedIndex: number,
  selectedActivity: number,
) => {
  const { traits: baseTraits } = characters[selectedIndex];
  const { requirements } = activities[selectedActivity];
  const [prevAdaptionRating, setPrevAdaptionRating] = useState(adaptionRating);
  // const [adaption, setAdaption] = useState(emptyTraits);

  const goal = subtractTraits(requirements, baseTraits);

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

  if (adaptionRating !== prevAdaptionRating) {
    setPrevAdaptionRating(adaptionRating);
  }
  console.log("hello");

  // useEffect(() => {
  //   console.log("time also");
  // }, [time]);
  const traits = sumTraits(adaption, baseTraits);
  const resonance = calculateResonance(time, traits, requirements);
  const [resource, amount] = calculateProgress(
    characters[selectedIndex],
    traits,
    activities[selectedActivity],
    resonance,
  );

  return [traits, resource, amount, resonance];
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
