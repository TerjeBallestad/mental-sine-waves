import {
  generateVisualWaveData,
  traitsToWave,
} from "../functions/FunctionLibrary";
import { SvgWave, type WaveData } from "../components/Wave";
import { useGameState } from "../GameState";
import { emptyTraits } from "../data/Characters";
import { SkillList } from "../components/SkillList";
import { TraitList } from "../components/TraitView";
import { ActivityList } from "../components/ActivityView";
import { CharacterStateList } from "../components/CharacterStateView";
import { RewardList } from "../components/RewardView";

export function CharacterTalents() {
  const resolution = 400; // amount of points on the sine wave

  const { time, selectedCharacter, availableActivities, availableSkills } =
    useGameState();
  const { traits, currentActivity } = selectedCharacter;
  const requirements = currentActivity?.mentalSignature ?? emptyTraits;

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
      name: currentActivity.label,
      color: currentActivity.color,
    });
  }

  return (
    <div className="page-grid gap-y-6">
      <TraitList traits={traits} />

      {/* Recent reward display */}
      <div className="breakout grid grid-cols-8 gap-2">
        <RewardList recentRewards={selectedCharacter.recentRewards} />
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

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Overskudd</h2>
          <progress
            className="progress progress-secondary h-5"
            value={selectedCharacter.state.overskudd}
            max={100}
          />
          <div className="self-end font-semibold">
            {selectedCharacter.state.overskudd}/100
          </div>
        </div>
      </div>

      <div className="breakout grid grid-cols-3 gap-6">
        <div className="card card-border bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Ressurser</h2>
            <CharacterStateList state={selectedCharacter.state} />
          </div>
        </div>

        <div className="card card-border bg-base-100 col-span-2">
          <div className="card-body">
            <h1 className="card-title">Aktiviteter</h1>
            <div className="grid grid-cols-4 gap-3">
              <ActivityList activities={availableActivities} />
            </div>
          </div>
        </div>
      </div>
      <div className="card card-border bg-base-100 shadow-lg">
        <div className="card-body grid grid-cols-4">
          <h2 className="card-title col-span-4">Ferdigheter</h2>
          <SkillList skills={availableSkills} />
        </div>
      </div>
    </div>
  );
}
