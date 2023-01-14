import { useCallback, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { useSpoilers } from "../../hooks/useSpoilers";
import {
  characterSpoilerFilter,
  getBaseUrl,
  getCharacter,
  getCharacterClasses,
  getDefaultCharacterClass,
  verifyQueryParam,
} from "../../common/helpers";
import { CharacterAbilityCard, SortOption } from "../../common/types";
import { characterSearchResults } from "../api/characters";
import CardList from "../../components/CardList";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import Toolbar from "../../components/Toolbar";
import SvgCharacterIcon from "../../components/Svg";

const sortOrderOptions: SortOption[] = [
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

  const handleClassChange = (newClass: string) => {
    router.push({
      pathname: "characters",
      query: { ...query, class: newClass },
    });
  };

  return (
    <div className="filters">
      {getCharacterClasses(game)
        .filter((c) => !c.hidden)
        .map((char, idx) => (
          <div
            key={idx}
            className={`filter-icon ${
              characterClass === char.class ? "filter-icon-selected" : ""
            }`}
            onClick={() => handleClassChange(char.class)}
          >
            <SvgCharacterIcon character={char.class} />
          </div>
        ))}
    </div>
  );
};

type PageProps = {
  searchResults: CharacterAbilityCard[];
};

const Characters = ({ searchResults }: PageProps) => {
  const { spoilers, updateSpoilers } = useSpoilers();
  const router = useRouter();
  const [modalContent, setModalContent] = useState(null);

  const game = verifyQueryParam(router.query.game, "gh");
  const characterClass = verifyQueryParam(
    router.query.class,
    getDefaultCharacterClass(game)
  );
  const character = getCharacter(characterClass);

  const closeModal = useCallback(
    () => setModalContent(null),
    [setModalContent]
  );

  const updateLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value);
    if (!newLevel || newLevel < 1 || newLevel > 9) return;

    updateSpoilers({ ...spoilers, level: newLevel });
  };

  useEffect(() => {
    if (character)
      document.documentElement.style.setProperty("--primary", character.colour);
  }, [character]);

  const cardList = searchResults?.filter(characterSpoilerFilter(spoilers));

  return (
    <Layout>
      <Toolbar pathname="characters" sortOrderOptions={sortOrderOptions}>
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
        <div className="button-group">
          <button onClick={() => setModalContent(character.matImage)}>
            Character Mat
          </button>
          <button onClick={() => setModalContent(character.sheetImage)}>
            Character Sheet
          </button>
        </div>
      </Toolbar>
      <ClassFilter game={game} characterClass={characterClass} />
      {!spoilers.loading && <CardList cardList={cardList} />}
      {modalContent && (
        <Modal
          content={<img alt="" src={getBaseUrl() + modalContent} />}
          open={!!modalContent}
          onClose={closeModal}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchResults = await characterSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
};

export default Characters;
