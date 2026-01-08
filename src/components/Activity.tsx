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
  // const activityIntervals = activity.timeToComplete / intervals
  const activityStep = activity.timeToComplete / steps;

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  console.log("activity render");
  const gameState = useGameState();
  if (isRunning) {
    gameState.update(activityStep);
    gameState.selectedCharacter.doActivity(activity, progress);
  }

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const value = p + progressStep;
        if (value > 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return value;
      });
    }, intervalMS);
    return () => clearInterval(interval);
  }, [isRunning]);

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
