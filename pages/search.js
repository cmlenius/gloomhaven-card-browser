import { useEffect } from "react";
import { useRouter } from "next/router";

import { search } from "./api/search";
import { baseCharacters, colour } from "../data/common";
import { useSpoilers } from "../hooks/useSpoilers";

import CardList from "../components/CardList";
import Dropdown from "../components/Dropdown";
import Layout from "../components/Layout";

const searchFiltersOptions = [
  { id: "all", name: "All" },
  { id: "characters", name: "Characters" },
  { id: "items", name: "Items" },
];

function SearchToolbar() {
  const router = useRouter();
  const query = router.query;

  function handleTypeChange(newType) {
    if (query.type === newType || newType === "all") {
      delete query.type;
    } else {
      query.type = newType;
    }
    router.push({
      pathname: "/search",
      query: query,
    });
  }

  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        <Dropdown
          onChange={handleTypeChange}
          options={searchFiltersOptions}
          value={query.type}
        />
      </div>
    </div>
  );
}

function Search({ searchResults }) {
  const { spoilers } = useSpoilers();

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colour(null));
  }, []);

  const spoilerFilterFn = (card) => {
    if (card.class) {
      return (
        baseCharacters.includes(card.class) ||
        spoilers.characters?.has(card.class)
      );
    } else {
      if (card.source === "Prosperity")
        return card.prosperity <= parseInt(spoilers.items.prosperity, 10);
      if (card.source === "Random Item Design") return spoilers.items.recipes;
      if (card.source === "Other") return spoilers.items.other;
    }

    return false;
  };

  return (
    <Layout>
      <SearchToolbar />
      <CardList
        spoilerFilterFn={spoilerFilterFn}
        searchResults={searchResults || []}
      />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { searchResults } = await search(context.query);

  return {
    props: {
      searchResults: searchResults,
    },
  };
}

export default Search;
