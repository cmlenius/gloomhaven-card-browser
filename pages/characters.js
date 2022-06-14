import { useEffect } from "react";
import { useRouter } from "next/router";

import Dropdown from "../components/dropdown";
import Layout from "../components/layout";
import { baseUrl, optionToLabel, sortDirectionOptions } from "../data/utils";
import { characterSearchResults } from "./api/characters";

const characterOptions = [
  { id: "BR", color: "#375E78", name: "Brute" },
  { id: "CH", color: "#575B29", name: "Cragheart" },
  { id: "MT", color: "#3C4A5C", name: "Mindthief" },
  { id: "SC", color: "#445326", name: "Scoundrel" },
  { id: "SW", color: "#5B4173", name: "Spellweaver" },
  { id: "TI", color: "#6D5C46", name: "Tinker" },
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
          <img
            src={`/icons/classes/${char.id}.png`}
            height="24px"
            width="24px"
          />
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
      document.documentElement.style.setProperty("--primary", curClass.color);
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
