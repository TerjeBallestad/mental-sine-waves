import { Pause, Play, AlertCircle } from "lucide-react";
import type { AActivity } from "../data/Activities";
import { useEffect, useState } from "react";
import { useGameState } from "../GameState";
import { observer } from "mobx-react-observer";

type ActivityListProps = {
  activities: AActivity[];
};

type ActivityViewProps = {
  activity: AActivity;
};

export function ActivityList({ activities }: ActivityListProps) {
  return activities.map((activity) => (
    <ActivityView key={activity.label} activity={activity} />
  ));
}

const ActivityView = observer(function ActivityView({
  activity,
}: ActivityViewProps) {
  const intervalMS = 100;
  const progressStep = 4;
  const steps = 100 / progressStep;
  const activityStep = activity.timeToComplete / steps;

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const gameState = useGameState();
  const character = gameState.selectedCharacter;
  const affordCheck = character.canAffordActivity(activity);
  const refusalCheck = character.willCharacterRefuseActivity(activity);
  const overskuddDrainRate = activity.getOverskuddDrainRate(character);
  const masteryLevel = character.getActivityMasteryLevel(activity);
  const masteryPoints = character.getActivityMastery(activity);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (progress !== 0) {
        gameState.update(activityStep);
        character.doActivity(activity);

        // Check if activity stopped (Overskudd went negative)
        if (!character.currentActivity || character.currentActivity !== activity) {
          setIsRunning(false);
          setProgress(0);
          clearInterval(interval);
          return;
        }
      }

      setProgress((p) => {
        const progress = p + progressStep;
        if (progress > 100) {
          clearInterval(interval);
          setIsRunning(false);
          // Clear current activity when done
          if (character.currentActivity === activity) {
            character.currentActivity = undefined;
          }
          return 0;
        }
        return progress;
      });
    }, intervalMS);
    return () => clearInterval(interval);
  }, [activity, activityStep, gameState, isRunning, progress, character]);

  const handleStart = () => {
    if (!affordCheck.can) {
      return;
    }
    setIsRunning((r) => !r);
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-4">
        <h3 className="card-title text-sm">{activity.label}</h3>
        {activity.description && (
          <p className="text-xs opacity-70">{activity.description}</p>
        )}

        {/* Mastery Display */}
        {masteryLevel > 0 && (
          <div className="badge badge-success badge-sm mt-1">
            Mastery Level {masteryLevel} ({Math.floor(masteryPoints)} pts)
          </div>
        )}

        {/* Overskudd Drain Rate Display */}
        {overskuddDrainRate > 0 && (
          <div className="mt-2 space-y-1">
            <div className="text-xs font-semibold text-error">Overskudd Drain:</div>
            <div className="flex flex-wrap gap-2">
              <div className="badge badge-sm badge-error">
                -{overskuddDrainRate.toFixed(1)}/hour
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <progress
          className="progress progress-primary mt-2"
          value={progress}
          max={100}
        />

        {/* Start/Pause Button */}
        <button
          className={`btn btn-sm mt-2 ${
            affordCheck.can ? "btn-primary" : "btn-disabled"
          }`}
          onClick={handleStart}
          disabled={!affordCheck.can}
          title={affordCheck.reason}
        >
          {isRunning ? (
            <>
              <Pause className="size-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="size-4" />
              Start
            </>
          )}
        </button>

        {/* Refusal Warning */}
        {refusalCheck.willRefuse && (
          <div className="alert alert-error alert-sm mt-2">
            <AlertCircle className="size-4" />
            <span className="text-xs">{refusalCheck.reason}</span>
          </div>
        )}

        {/* Affordability Warning */}
        {!affordCheck.can && !refusalCheck.willRefuse && (
          <div className="alert alert-warning alert-sm mt-2">
            <AlertCircle className="size-4" />
            <span className="text-xs">{affordCheck.reason}</span>
          </div>
        )}
      </div>
    </div>
  );
});
