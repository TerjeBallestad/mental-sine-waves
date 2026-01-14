import clsx from "clsx";

type Props = {
  name: string;
  value: number;
};
export function CharacterStateView({ name, value }: Props) {
  return (
    <li className="list-row flex flex-col">
      <div className="flex justify-between">
        <span className="capitalize">
          {name.replace(/([A-Z])/g, " $1").trim()}
        </span>
        <span className="font-semibold">{Math.round(value)}</span>
      </div>

      <progress
        className={clsx("progress w-full", {
          "progress-success": value > 60,
          "progress-warning": value <= 60 && value > 20,
          "progress-error": value <= 20,
        })}
        value={value}
        max="100"
      ></progress>
    </li>
  );
}
