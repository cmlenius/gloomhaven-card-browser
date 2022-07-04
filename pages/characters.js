import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useSpoilers } from "../hooks/useSpoilers";
import {
  baseUrl,
  characterClasses,
  characterSpoilerFilter,
  colour,
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

  function handleClassChange(newClass) {
    router.push({
      pathname: "/characters",
      query: { ...query, class: newClass },
    });
  }

  return (
    <div className="filters">
      {characterClasses(query.game || "gh").map((char, idx) => (
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
  const { spoilers } = useSpoilers();
  const router = useRouter();
  const query = router.query;

  const [character, setCharacter] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    if (query.class) {
      document.documentElement.style.setProperty(
        "--primary",
        colour(query.class)
      );
    } else {
      let char = defaultClass(query.game);
      router.push({
        pathname: "/characters",
        query: { ...query, class: char },
      });
    }
  }, [query, router]);

  useEffect(() => {
    const char = characterClasses(query.game).find(
      (c) => c.class == query.class
    );
    if (!char) return;

    setCharacter(char);
  }, [query.class]);

  const cardList = searchResults?.filter(characterSpoilerFilter(spoilers));

  return (
    <Layout>
      <Toolbar pathname="/characters" sortOrderOptions={sortOrderOptions}>
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
          content={<img src={baseUrl + modalContent} />}
          open={!!modalContent}
          onClose={() => setModalContent(null)}
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
