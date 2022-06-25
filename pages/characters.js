import { useEffect } from "react";
import { useRouter } from "next/router";

import { useSpoilers } from "../hooks/useSpoilers";
import {
  baseCharacters,
  characterClasses,
  colour,
  hiddenCharacters,
} from "../data/common";
import { characterSearchResults } from "./api/characters";

import CardList from "../components/CardList";
import Layout from "../components/Layout";
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
      {characterClasses(query.game).map((char, idx) => (
        <div
          key={idx}
          className={`filter-icon ${
            query.class === char.id ? "filter-icon-selected" : ""
          }`}
          onClick={() => handleClassChange(char.id)}
        >
          <SvgCharacterIcon character={char.id} />
        </div>
      ))}
    </div>
  );
}

function Characters({ searchResults }) {
  const { spoilers } = useSpoilers();
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (query.class) {
      document.documentElement.style.setProperty(
        "--primary",
        colour(query.class)
      );
    } else {
      let defaultClass = "BR";
      if (query.game === "jotl") {
        defaultClass = "DE";
      } else if (query.game === "cs") {
        defaultClass = "AA";
      }
      router.push({
        pathname: "/characters",
        query: { ...query, class: defaultClass },
      });
    }
  }, [query, router]);

  const cardList = searchResults?.filter(
    (card) =>
      baseCharacters.includes(card.class) ||
      spoilers.characters?.has(card.class) ||
      hiddenCharacters.includes(card.class)
  );

  return (
    <Layout>
      <Toolbar
        Filters={ClassFilter}
        pathname="/characters"
        sortOrderOptions={sortOrderOptions}
      />
      <CardList cardList={cardList || []} />
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
