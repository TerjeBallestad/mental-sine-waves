import { characters } from "../data/Characters";
import { useCharacter } from "../functions/useCharacter";

export const Header = () => {
  const { character } = useCharacter();

  return (
    <div className="navbar bg-base-200">
      <div className="ps-4">
        <a className="text-lg font-bold">Ellingspillet</a>
      </div>
      <div className="flex grow justify-end px-2">
        <div className="flex items-stretch">
          <select
            defaultValue={character}
            className="select w-50"
            onChange={(event) => {
              setCharacter(Number(event.target.value));
            }}
          >
            {characters.map((c, i) => (
              <option value={i}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
