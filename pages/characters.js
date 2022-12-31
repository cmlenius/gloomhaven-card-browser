import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useSpoilers } from "../hooks/useSpoilers";
import {
  baseUrl,
  characterClasses,
  characterSpoilerFilter,
  defaultClass,
} from "../data/utils";
import { characterSearchResults } from "./api/characters";

import CardList from "../components/CardList";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Toolbar from "../components/Toolbar";
import SvgCharacterIcon from "../components/Svg";

const sortOrderOptions = [
  { id: "level", name: "Level" },
  { id: "initiative", name: "Initiative" },
  { id: "name", name: "Name" },
];

function ClassFilter() {
  const router = useRouter();
  const query = router.query;
  const game = query.game || "gh";

  function handleClassChange(newClass) {
    router.push({
      pathname: "/characters",
      query: { ...query, class: newClass },
    });
  }

  return (
    <div className="filters">
      {characterClasses(game)
        .filter((c) => !c.hidden)
        .map((char, idx) => (
          <div
            key={idx}
            className={`filter-icon ${
              query.class === char.class ? "filter-icon-selected" : ""
            }`}
            onClick={() => handleClassChange(char.class)}
          >
            <SvgCharacterIcon character={char.class} />
          </div>
        ))}
    </div>
  );
}

function Characters({ searchResults }) {
  const { spoilers, updateSpoilers } = useSpoilers();
  const router = useRouter();
  const query = router.query;
  const game = query.game || "gh";

  const [character, setCharacter] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const closeModal = useCallback(
    () => setModalContent(null),
    [setModalContent]
  );

  function updateLevel(event) {
    const newLevel = parseInt(event.target.value);
    if (!newLevel || newLevel < 1 || newLevel > 9) return;

    updateSpoilers({ ...spoilers, level: newLevel });
  }

  useEffect(() => {
    let char = characterClasses(game).find((c) => c.class == query.class);

    if (!char) {
      char = defaultClass(game);
      router.push({
        pathname: "/characters",
        query: { ...query, class: char },
      });
    }

    document.documentElement.style.setProperty("--primary", char.colour);
    setCharacter(char);
  }, [query, router, game]);

  const cardList = searchResults?.filter(characterSpoilerFilter(spoilers));

  return (
    <Layout>
      <Toolbar pathname="/characters" sortOrderOptions={sortOrderOptions}>
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
      <ClassFilter />
      {!spoilers.loading && <CardList cardList={cardList} />}
      {modalContent && (
        <Modal
          content={<img alt="" src={baseUrl + modalContent} />}
          open={!!modalContent}
          onClose={closeModal}
        />
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const searchResults = await characterSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
}

export default Characters;
