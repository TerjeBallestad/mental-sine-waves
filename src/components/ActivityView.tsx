import { Pause, Play } from "lucide-react";
import type { AActivity } from "../data/Activities";
import { useEffect, useState } from "react";
import { useGameState } from "../GameState";

type Props = {
  activity: AActivity;
};

export function ActivityView({ activity }: Props) {
  const intervalMS = 100;
  const progressStep = 4;
  const steps = 100 / progressStep;
  const activityStep = activity.timeToComplete / steps;

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const gameState = useGameState();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (progress !== 0) {
        gameState.update(activityStep);
        gameState.selectedCharacter.doActivity(activity);
      }

      setProgress((p) => {
        const progress = p + progressStep;
        if (progress > 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return progress;
      });
    }, intervalMS);
    return () => clearInterval(interval);
  }, [activity, activityStep, gameState, isRunning, progress]);

  return (
    <div>
      <p>{activity.name}</p>
      <progress
        className="progress progress-primary"
        value={progress}
        max={100}
      />
      <button className="btn" onClick={() => setIsRunning((r) => !r)}>
        {isRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
}
