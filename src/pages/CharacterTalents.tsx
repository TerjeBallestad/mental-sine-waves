import { useState } from "react";
import { useCharacter } from "../functions/useCharacter";

import { activities } from "../data/Activities";
import {
  generateVisualWaveData,
  traitsToWave,
} from "../functions/FunctionLibrary";
import { SvgWave, type WaveData } from "../components/Wave";
import { ActivityView } from "../components/Activity";
import { useGameState } from "../GameState";
import { emptyTraits } from "../data/Characters";

export function CharacterTalents() {
  const selectedActivity = 1;
  const resolution = 400; // amount of points on the sine wave

  const activity = activities[selectedActivity];
  const { time, selectedCharacter } = useGameState();
  const { traits, currentActivity } = selectedCharacter;
  const requirements = currentActivity?.requirements ?? emptyTraits;

  const [adaption, setAdaption] = useState(0);

  const handleAdaptionIncrease = () => {
    setAdaption((prev) => prev + 1);
  };

  const { resource, amount, resonance } = useCharacter(time, adaption, 1);

  const waves = Array<WaveData>({
    points: generateVisualWaveData(traitsToWave, time, traits, resolution),
    ...selectedCharacter,
  });

  if (currentActivity) {
    waves.push({
      points: generateVisualWaveData(
        traitsToWave,
        time,
        requirements,
        resolution,
      ),
      dashed: true,
      ...currentActivity,
    });
  }

  return (
    <div className="page-grid gap-y-6">
      <div className="card card-border bg-base-100 shadow-lg">
        <div className="card-body">
          <h1 className="card-title">
            {selectedCharacter.name} - {activity.name}
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

      <div className="card card-border bg-base-100">
        <div className="card-body">
          <h1 className="card-title">Activities</h1>
          <div className="grid grid-cols-4 gap-3">
            {activities.map((activity) => (
              <ActivityView key={activity.name} activity={activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Wave Visualization */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">
            Mental Rhythm Patterns (Hidden from Player)
          </h2>
          <SvgWave waves={waves} />
        </div>
      </div>
    </div>
  );
}
