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

  const cardList = searchResults?.filter((card) => {
    if (card.class) {
      return (
        baseCharacters.includes(card.class) ||
        spoilers.characters?.has(card.class)
      );
    } else {
      switch (card.source) {
        case "prosperity":
          return card.prosperity <= parseInt(spoilers.items.prosperity, 10);
        case "random-design":
          return spoilers.items.recipes;
        case "solo-scenario":
          return spoilers.items.solo;
        case "other":
          return spoilers.items.other;
        case "jotl":
          return true;
        case "jotl1":
          return spoilers.items.jotl1;
        case "jotl2":
          return spoilers.items.jotl2;
        case "jotl3":
          return spoilers.items.jotl3;
        case "cs":
          return true;
        default:
          return false;
      }
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
