import { useEffect } from "react";
import { useRouter } from "next/router";

import Dropdown from "../components/dropdown";
import Layout from "../components/layout";
import {
  baseURL,
  characterOptions,
  sortDirectionOptions,
  sortOrderOptions,
  optionToLabel,
} from "../data/characters";
import { characterSearchResults } from "./api/characters";

function CharacterToolbar() {
  const router = useRouter();
  const query = router.query;

  function handleClassChange(newClass) {
    router.push({
      pathname: "/characters",
      query: { ...query, class: newClass },
    });
  }

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
        <div>
          <Dropdown
            onChange={handleClassChange}
            options={characterOptions}
            value={optionToLabel(query.class, characterOptions)}
          />
          <span style={{ margin: "0 12px" }}>sorted by</span>
          <Dropdown
            onChange={handleSortOrderChange}
            options={sortOrderOptions}
            value={optionToLabel(query.order, sortOrderOptions)}
          />
          <span style={{ margin: "0 12px" }}>:</span>
          <Dropdown
            onChange={handleSortDirectionChange}
            options={sortDirectionOptions}
            value={optionToLabel(query.dir, sortDirectionOptions)}
          />
        </div>
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
              <img className="card-img" src={baseURL + card.image} />
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
