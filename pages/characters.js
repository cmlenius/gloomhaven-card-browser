import { useEffect } from "react";
import { useRouter } from "next/router";

import Dropdown from "../components/dropdown";
import Layout from "../components/layout";
import {
  baseUrl,
  colours,
  optionToLabel,
  sortDirectionOptions,
} from "../data/utils";
import { characterSearchResults } from "./api/characters";
import SvgCharacterIcon from "../components/svg";

const characterOptions = [
  { id: "BR", name: "Brute" },
  { id: "CH", name: "Cragheart" },
  { id: "MT", name: "Mindthief" },
  { id: "SC", name: "Scoundrel" },
  { id: "SW", name: "Spellweaver" },
  { id: "TI", name: "Tinker" },
];

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
      {characterOptions.map((char, idx) => (
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
      <div className="toolbarInner">
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
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    const curClass = characterOptions.find((c) => c.id === query.class);
    if (curClass) {
      document.documentElement.style.setProperty(
        "--primary",
        colours[curClass.id]
      );
    }
  }, [query.class]);

  return (
    <Layout>
      <CharacterToolbar />
      <div className="cardList">
        {searchResults &&
          searchResults.map((card, idx) => (
            <div key={idx} className="card">
              <img className="card-img" src={baseUrl + card.image} />
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
