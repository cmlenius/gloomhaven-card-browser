import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useSpoilers } from "../../hooks/useSpoilers";
import {
  characterSpoilerFilter,
  getBaseUrl,
  getCharacterClasses,
} from "../../common/helpers";
import { Character, CharacterAbility, Option } from "../../common/types";
import CardList from "../../components/CardList";
import Sort from "../../components/Sort";

const sortOrderOptions: Option[] = [
  { id: "level", name: "Level" },
  { id: "initiative", name: "Initiative" },
  { id: "name", name: "Name" },
];

type ClassFilterProps = {
  characterClass: string;
  game: string;
};

const ClassFilter = ({ characterClass, game }: ClassFilterProps) => {
  const router = useRouter();
  const query = router.query;

  return (
    <div className="filters">
      {getCharacterClasses(game)
        .filter((c) => !c.hidden)
        .map((char) => (
          <Link
            key={char.class}
            href={{
              pathname: `/${game}/characters/${char.class}`,
              query: {
                ...(query.dir && { dir: query.dir }),
                ...(query.order && { order: query.order }),
              },
            }}
          >
            <a
              className={`filter-icon ${
                characterClass === char.class ? "filter-icon-selected" : ""
              }`}
            >
              <img
                alt=""
                src={
                  getBaseUrl() + `icons/characters/${game}/${char.class}.png`
                }
              />
            </a>
          </Link>
        ))}
    </div>
  );
};

type CharacterDetailsProps = {
  character: Character;
};

const CharacterDetails = ({ character }: CharacterDetailsProps) => {
  return (
    <div className="character-details">
      <img alt="" src={getBaseUrl() + character.matImageBack} />
      <img alt="" src={getBaseUrl() + character.matImage} />
      <img alt="" src={getBaseUrl() + character.sheetImage} />
    </div>
  );
};

type PageProps = {
  searchResults: CharacterAbility[];
  game: string;
  character: Character;
};

const CharactersPage = ({ character, game, searchResults }: PageProps) => {
  const { spoilers, updateSpoilers } = useSpoilers();
  const [showCharacterDetails, setShowCharacterDetails] = useState(false);

  const updateLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value);
    if (!newLevel || newLevel < 1 || newLevel > 9) return;

    updateSpoilers({ ...spoilers, level: newLevel });
  };

  const cardList = searchResults?.filter(characterSpoilerFilter(spoilers));

  useEffect(() => {
    if (character)
      document.documentElement.style.setProperty("--primary", character.colour);
  }, [character]);

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-inner">
          <div>
            <div className="flex">
              <Sort sortOrderOptions={sortOrderOptions} />
            </div>
          </div>
          {!spoilers.loading && (
            <div className="slider">
              <span>{"Level: " + (spoilers.level || "1")}</span>
              <input
                type="range"
                name="level"
                id="level"
                min="1"
                max="9"
                onInput={updateLevel}
                value={spoilers.level || 1}
              />
            </div>
          )}
          <div>
            <div className="button-group">
              <button
                className={!showCharacterDetails ? "btn-selected" : ""}
                onClick={() => setShowCharacterDetails(false)}
              >
                Ability Cards
              </button>
              <button
                className={showCharacterDetails ? "btn-selected" : ""}
                onClick={() => setShowCharacterDetails(true)}
              >
                Character Details
              </button>
            </div>
          </div>
        </div>
      </div>
      <ClassFilter game={game} characterClass={character?.class} />

      {!spoilers.loading &&
        (showCharacterDetails ? (
          <CharacterDetails character={character} />
        ) : (
          <CardList cardList={cardList} />
        ))}
    </>
  );
};

export default CharactersPage;
