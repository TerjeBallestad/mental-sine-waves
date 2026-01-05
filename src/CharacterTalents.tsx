import { useEffect, useState } from "react";
import { useCharacter } from "./useCharacter";
import { characters } from "./Data";
import { activities } from "./Activities";
import { generateVisualWaveData, traitsToWave } from "./FunctionLibrary";

export const CharacterTalents = () => {
  const timeStep = 0.15;
  const timeInterval = 50; // ms
  const selectedCharacter = 1;
  const selectedActivity = 1;
  const resolution = 400; // amount of points on the sine wave
  const char = characters[selectedCharacter];
  const activity = activities[selectedActivity];

  const [time, setTime] = useState(0);
  const [isRunning] = useState(false);
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
    selectedCharacter,
    selectedActivity,
  );

  const charWaveData = generateVisualWaveData(
    traitsToWave,
    time,
    traits,
    resolution,
  );

  const actWaveData = generateVisualWaveData(
    traitsToWave,
    time,
    activity.requirements,
    resolution,
  );

  return (
    <div className="page-grid">
      <div className="breakout grid grid-cols-subgrid">
        <div className="tooltip tooltip-bottom col-start-3 justify-self-end">
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
            {char.name} - {activity.name}
          </h1>
          <div className="font-mono">
            {JSON.stringify(traits).replaceAll(/['"]/g, " ")}
          </div>
          <p>{JSON.stringify(resource)}</p>
          <p>{JSON.stringify(amount)}</p>
          <p>{JSON.stringify(resonance)}</p>

          <div>{adaption}</div>
          <button className="btn" onClick={handleAdaptionIncrease}>
            +
          </button>
        </div>
      </div>

      {/* Wave Visualization */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">
            Mental Rhythm Patterns (Hidden from Player)
          </h2>
          <svg
            viewBox="0 0 400 100"
            className="bg-base-200 h-48 w-full rounded shadow-inner"
          >
            <line
              x1="-50"
              y1="50"
              x2="450"
              y2="50"
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <polyline
              points={charWaveData.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={char.color}
              strokeWidth="2.5"
            />
            <polyline
              points={actWaveData.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={activity.color}
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
          </svg>
          <div className="mt-3 flex justify-between text-sm">
            <span style={{ color: char.color }} className="font-medium">
              ■ {char.name}'s rhythm
            </span>
            <span style={{ color: activity.color }} className="font-medium">
              ▪▪▪ {activity.name} demands
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
