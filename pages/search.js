import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfiniteScroll from "react-infinite-scroller";
import { faSackDollar, faShield } from "@fortawesome/free-solid-svg-icons";

import { search } from "./api/search";
import { baseUrl, baseCharacters, colour } from "../data/common";
import { useSpoilers } from "../hooks/useSpoilers";
import Layout from "../components/layout";

const rowsPerPage = 20;

const searchFilters = [
  { id: "characters", name: "Characters", icon: faShield },
  { id: "items", name: "Items", icon: faSackDollar },
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
        <div className="filters">
          {searchFilters.map((option, idx) => (
            <div
              key={idx}
              className={`filter-icon ${
                query.type === option.id ? "filter-icon-selected" : ""
              }`}
              onClick={() => handleTypeChange(option.id)}
            >
              <FontAwesomeIcon icon={option.icon} height="18px" width="18px" />
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
  }

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colour(null));
  }, []);

  useEffect(() => {
    setCards(searchResults.slice(0, rowsPerPage));
  }, [searchResults]);

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
            <div className="card-list">
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
