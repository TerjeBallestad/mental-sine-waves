export type PointData = {
  x: number;
  y: number;
};

type WaveProps = {
  points: PointData[];
  color: string;
  name: string;
  children?: React.ReactNode;
};

export const WaveCard = ({ color, points, name, children }: WaveProps) => {
  return (
    <div className="card bg-base-100 mb-6 shadow-lg">
      <div className="card-body">
        <div className="grid grid-cols-4 gap-2">{children}</div>
        <SvgWave waves={[{ points, color, name }]} />
      </div>
    </div>
  );
};

export type WaveData = {
  points: PointData[];
  color: string;
  name: string;
  dashed?: boolean;
};

type SvgWaveProps = {
  waves: WaveData[];
};

export const SvgWave = ({ waves }: SvgWaveProps) => {
  return (
    <>
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
        {waves.map((w) => (
          <polyline
            points={w.points.map((p) => `${p.x},${p.y}`).join(" ")}
            key={w.name}
            fill="none"
            stroke={w.color}
            strokeWidth="2.5"
            strokeDasharray={w.dashed ? "5 3" : undefined}
          />
        ))}
      </svg>
      <div className="mt-3 flex justify-between text-sm">
        {waves.map((w) => (
          <span key={w.name} style={{ color: w.color }} className="font-medium">
            ■ {w.name}
          </span>
        ))}
      </div>
    </>
  );
};
