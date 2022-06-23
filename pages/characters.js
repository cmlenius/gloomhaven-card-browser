import { useEffect } from "react";
import { useRouter } from "next/router";

import { useSpoilers } from "../hooks/useSpoilers";
import {
  baseCharacters,
  baseUrl,
  characterClasses,
  colour,
  hiddenCharacters,
  optionToLabel,
  sortDirectionOptions,
} from "../data/common";
import { characterSearchResults } from "./api/characters";

import Dropdown from "../components/dropdown";
import Layout from "../components/layout";
import SvgCharacterIcon from "../components/svg";

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
      {characterClasses.map((char, idx) => (
        <div
          key={idx}
          className={`filter-icon ${
            query.class === char ? "filter-icon-selected" : ""
          }`}
          onClick={() => handleClassChange(char)}
        >
          <SvgCharacterIcon character={char} />
        </div>
      ))}
    </div>
  );
}

function CharacterToolbar() {
  const router = useRouter();
  const query = router.query;

  function handleSortOrderChange(newOrder) {
    router.push({
      pathname: "/characters",
      query: { ...query, order: newOrder },
    });
  }

  function handleSortDirectionChange(newDirection) {
    router.push({
      pathname: "/characters",
      query: { ...query, dir: newDirection },
    });
  }

  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        <div className="sort">
          <Dropdown
            onChange={handleSortOrderChange}
            options={sortOrderOptions}
            value={optionToLabel(query.order, sortOrderOptions)}
          />
          <span style={{ margin: "0 8px" }}>:</span>
          <Dropdown
            onChange={handleSortDirectionChange}
            options={sortDirectionOptions}
            value={optionToLabel(query.dir, sortDirectionOptions)}
          />
        </div>
        <ClassFilter />
      </div>
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
      router.push({
        pathname: "/characters",
        query: { ...query, class: "BR" },
      });
    }
  }, [query, router]);

  return (
    <Layout>
      <CharacterToolbar />
      <div className="card-list">
        {searchResults &&
          searchResults
            .filter(
              (card) =>
                baseCharacters.includes(card.class) ||
                spoilers.characters?.has(card.class) ||
                hiddenCharacters.includes(card.class)
            )
            .map((card, idx) => (
              <div key={idx} className="card">
                <img alt="" className="card-img" src={baseUrl + card.image} />
              </div>
            ))}
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="card" />
        ))}
      </div>
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
