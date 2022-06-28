import { useEffect } from "react";
import { useRouter } from "next/router";

import { search } from "./api/search";
import {
  baseCharacterIds,
  characterSpoilerFilter,
  colour,
  itemSpoilerFilter,
} from "../data/utils";
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
    if (newType === "all") {
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

function Search({ isMat, searchResults }) {
  const { spoilers } = useSpoilers();

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colour(null));
  }, []);

  const charactersFilter = characterSpoilerFilter(spoilers);
  const itemsFilter = itemSpoilerFilter(spoilers);
  const cardList = searchResults?.filter((card) => {
    if (card.class) {
      return charactersFilter(card);
    } else {
      return itemsFilter(card);
    }
  });

  return (
    <Layout>
      <SearchToolbar />
      <CardList isSingleColumn={isMat} cardList={cardList || []} />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { isMat, searchResults } = await search(context.query);

  return {
    props: {
      searchResults,
      isMat,
    },
  };
}

export default Search;
