export type WaveData = {
  x: number;
  y: number;
};

type WaveProps = {
  points: WaveData[];
  color: string;
  title: string;
  children?: React.ReactNode;
};

export const Wave = ({ color, points, title, children }: WaveProps) => {
  return (
    <div className="card bg-base-100 mb-6 shadow-lg">
      <div className="card-body">
        <div className="grid grid-cols-4 gap-2">{children}</div>
        <svg
          viewBox="0 0 400 100"
          className="bg-base-200 h-48 w-full shadow-inner"
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
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
          />
        </svg>
        <div className="mt-3 flex justify-between text-sm">
          <span style={{ color }} className="font-medium">
            ■ {title}
          </span>
        </div>
      </div>
    </div>
  );
};
