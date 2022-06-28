import { useEffect } from "react";
import { useRouter } from "next/router";

import { useSpoilers } from "../hooks/useSpoilers";
import {
  baseCharacterIds,
  characterClasses,
  characterSpoilerFilter,
  colour,
  defaultClass,
  hiddenCharacterIds,
} from "../data/utils";
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
      let char = defaultClass(query.game);
      router.push({
        pathname: "/characters",
        query: { ...query, class: char },
      });
    }
  }, [query, router]);

  const cardList = searchResults?.filter(characterSpoilerFilter(spoilers));

  return (
    <Layout>
      <Toolbar
        Filters={ClassFilter}
        pathname="/characters"
        sortOrderOptions={sortOrderOptions}
      />
      {!spoilers.loading && <CardList cardList={cardList} />}
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
