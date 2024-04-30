import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Character, CharacterAbility, Option, Spoilers } from "../../common/types";
import { characterSpoilerFilter, customSort, getBaseUrl, getCharacterClasses } from "../../common/utils";
import { useSpoilers } from "../../hooks/useSpoilers";
import CardList from "..//CardList";
import Sort from "..//Sort";
import Empty from "../Empty";

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
            <a className={`filter-icon ${characterClass === char.class ? "filter-icon-selected" : ""}`}>
              <img alt="" src={getBaseUrl() + `icons/characters/${game}/${char.class}.png`} />
            </a>
          </Link>
        ))}
    </div>
  );
};

type CharacterDetailsProps = {
  character: Character;
  spoilers: Spoilers;
};

const CharacterDetails = ({ character, spoilers }: CharacterDetailsProps) => {
  if (spoilers.characters.has(character.class) || character.base)
    return (
      <div className="character-details">
        <img alt="" src={getBaseUrl() + character.matImageBack} />
        <img alt="" src={getBaseUrl() + character.matImage} />
        <img alt="" src={getBaseUrl() + character.sheetImage} />
      </div>
    );
  return <Empty />;
};

type PageProps = {
  searchResults: CharacterAbility[];
  game: string;
  character: Character;
};

const CharactersPage = ({ character, game, searchResults }: PageProps) => {
  const { spoilers, updateSpoilers } = useSpoilers();
  const [showCharacterDetails, setShowCharacterDetails] = useState(false);
  const [sortOrder, setsortOrder] = useState("level");
  const [sortDirection, setSortDirection] = useState("asc");

  const updateLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value);
    if (!newLevel || newLevel < 1 || newLevel > 9) return;

    updateSpoilers({ ...spoilers, level: newLevel });
  };

  const handleSortOrderChange = (newValue: string) => {
    setsortOrder(newValue);
  };
  const handleSortDirectionChange = (newValue: string) => {
    setSortDirection(newValue);
  };

  const cardList =
    searchResults
      ?.filter(characterSpoilerFilter(spoilers))
      .sort(customSort(sortOrder || "id", sortDirection || "asc")) || [];

  useEffect(() => {
    if (character) document.documentElement.style.setProperty("--primary", character.colour);
  }, [character]);

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-inner">
          <div>
            <div className="flex">
              <Sort
                sortOrderOptions={sortOrderOptions}
                handleSortOrderChange={handleSortOrderChange}
                handleSortDirectionChange={handleSortDirectionChange}
                sortOrder={sortOrder}
                sortDirection={sortDirection}
              />
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
          <CharacterDetails character={character} spoilers={spoilers} />
        ) : (
          <CardList cardList={cardList} />
        ))}
    </>
  );
};

export default CharactersPage;
