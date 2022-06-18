import { useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../components/layout";
import Pagination from "../components/pagination";
import { search } from "./api/search";
import { baseUrl, colour } from "../data/common";

const searchFilters = [
  { id: "characters", name: "Characters", icon: "/icons/equipment/head.png" },
  { id: "items", name: "Items", icon: "/icons/equipment/small.png" },
];

function SearchToolbar({ maxPageCount }) {
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

  function handlePageChange(newPage) {
    router.push({
      pathname: "/search",
      query: { ...query, page: newPage },
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
        <Pagination
          maxPageCount={maxPageCount}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

function Search({ searchResults, maxPageCount }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colour(null));
  }, []);

  return (
    <Layout>
      <SearchToolbar maxPageCount={maxPageCount} />
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
  const { searchResults, maxPageCount } = await search(context.query);

  return {
    props: {
      searchResults: searchResults,
      maxPageCount: maxPageCount,
    },
  };
}

export default Search;
