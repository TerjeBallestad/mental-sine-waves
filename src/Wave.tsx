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
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {children}
      <svg viewBox="0 0 400 100" className="w-full h-48 bg-gray-50 rounded">
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
      <div className="flex justify-between mt-3 text-sm">
        <span style={{ color }} className="font-medium">
          ■ {title}
        </span>
      </div>
    </div>
  );
};
