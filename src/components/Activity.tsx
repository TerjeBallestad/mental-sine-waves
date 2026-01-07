import { Pause, Play } from "lucide-react";
import type { Activity } from "../data/Activities";
import { useEffect, useState } from "react";

type Props = {
  activity: Activity;
};

export const ActivityView = ({ activity }: Props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  console.log("activity render");

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const value = p + 4;
        if (value >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return value;
      });
    }, 100);
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
};
