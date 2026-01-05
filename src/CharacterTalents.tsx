import { useEffect, useState } from "react";
import { useCharacter } from "./useCharacter";

export const CharacterTalents = () => {
  const timeStep = 0.15;
  const timeInterval = 550; // ms

  const [time, setTime] = useState(0);
  const [isRunning] = useState(true);
  const [adaption, setAdaption] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((t) => t + timeStep);
    }, timeInterval);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleAdaptionIncrease = () => {
    setAdaption((prev) => prev + 1);
  };

  const [traits, resource, amount, resonance] = useCharacter(
    time,
    adaption,
    1,
    3,
  );

  return (
    <div className="bg-base-200 mx-auto flex w-full max-w-6xl flex-col gap-6 pb-20">
      <div className="card card-border bg-base-100 mb-6 shadow-lg">
        <div className="card-body">
          <div>{JSON.stringify(traits)}</div>
          <div>{JSON.stringify(resource)}</div>
          <div>{JSON.stringify(amount)}</div>
          <div>{JSON.stringify(resonance)}</div>

          <div>{adaption}</div>
          <button className="btn" onClick={handleAdaptionIncrease}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};
