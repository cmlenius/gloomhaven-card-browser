import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";

import { search } from "./api/search";
import { baseUrl, baseCharacters, colour } from "../data/common";
import { useSpoilers } from "../hooks/useSpoilers";
import Layout from "../components/layout";

const rowsPerPage = 20;

const searchFilters = [
  { id: "characters", name: "Characters", icon: "/icons/equipment/head.png" },
  { id: "items", name: "Items", icon: "/icons/equipment/small.png" },
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
      <div className="toolbarInner">
        <div className="filters">
          <div
            className={`filter-icon ${
              !query.type ? "filter-icon-selected" : ""
            }`}
            onClick={() => handleTypeChange("all")}
          >
            <span style={{ lineHeight: "24px" }}>All</span>
          </div>
          {searchFilters.map((option, idx) => (
            <div
              key={idx}
              className={`filter-icon ${
                query.type === option.id ? "filter-icon-selected" : ""
              }`}
              onClick={() => handleTypeChange(option.id)}
            >
              <img src={option.icon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Search({ searchResults }) {
  const { spoilers } = useSpoilers();
  const [cards, setCards] = useState(searchResults.slice(0, rowsPerPage));

  function loadMore(page) {
    setCards(searchResults.slice(0, (page + 1) * rowsPerPage));
  }

  function filterSpoilers(card) {
    if (card.source === "Prosperity")
      return card.prosperity <= parseInt(spoilers.items.prosperity, 10);
    if (card.source === "Random Item Design") return spoilers.items.recipes;
    if (card.source === "Other") return spoilers.items.other;
    return (
      baseCharacters.includes(card.class) ||
      spoilers.characters?.has(card.class)
    );
  }

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colour(null));
  }, []);

  return (
    <Layout>
      <SearchToolbar />
      <div className="cardList">
        {searchResults && (
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={cards.length < searchResults.length}
            loader={<h4 key={0}>Loading...</h4>}
          >
            <div className="cardList">
              {cards.filter(filterSpoilers).map((card, idx) => (
                <div key={idx} className="card">
                  <img className="card-img" src={baseUrl + card.image} />
                </div>
              ))}
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="card" />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
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
