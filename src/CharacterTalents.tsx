import { useEffect, useState } from "react";
import { useCharacter } from "./useCharacter";
import { activities, characters } from "./Data";

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

  const { traits, resource, amount, resonance, resources } = useCharacter(
    time,
    adaption,
    1,
    3,
  );

  return (
    <div className="page-grid">
      <div className="full-width flex justify-end">
        <div className="tooltip tooltip-bottom mr-200">
          <div className="tooltip-content grid min-w-300 grid-cols-8">
            {Object.entries(resources).map(([key, value]) => (
              <div key={key}>
                <p>{key}</p>
                <p>{value}</p>
              </div>
            ))}
          </div>
          <button className="btn btn-primary">Resources</button>
        </div>
      </div>
      <div className="card card-border bg-base-100 mb-6 shadow-lg">
        <div className="card-body">
          <h1 className="card-title">
            {characters[1].name} - {activities[3].name}
          </h1>
          <pre>{JSON.stringify(traits).replaceAll(/['"]/g, " ")}</pre>
          <p>{JSON.stringify(resource)}</p>
          <p>{JSON.stringify(amount)}</p>
          <p>{JSON.stringify(resonance)}</p>

          <div>{adaption}</div>
          <button className="btn" onClick={handleAdaptionIncrease}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};
