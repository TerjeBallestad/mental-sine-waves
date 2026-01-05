import { useEffect, useState } from "react";
import { activities, characters } from "./Data";
import { subtractTraits, sumTraits } from "./FunctionLibrary";

export const useCharacter = (
  time: number,
  selectedIndex: number,
  selectedActivity: number,
) => {
  const { traits: baseTraits } = characters[selectedIndex];
  const { requirements } = activities[selectedActivity];
  const [adaption, setAdaption] = useState(0);

  const goal = subtractTraits(requirements, baseTraits);
  useEffect(() => {}, [time]);
  const adaptionTraits = sumTraits(goal, baseTraits);

  setAdaption((prev) => prev + 1);
  return [baseTraits, adaption, adaptionTraits];
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
