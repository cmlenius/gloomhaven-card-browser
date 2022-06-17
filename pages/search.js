import { useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../components/layout";
import Pagination from "../components/pagination";
import { search } from "./api/search";
import { baseUrl } from "../data/utils";

function SearchToolbar({ maxPageCount }) {
  const router = useRouter();
  const query = router.query;

  function handlePageChange(newPage) {
    router.push({
      pathname: "/items",
      query: { ...query, page: newPage },
    });
  }

  return (
    <div className="toolbar">
      <div className="toolbarInner"></div>
    </div>
  );
}

function Search({ searchResults, maxPageCount }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", "#473123");
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
