import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";

import { matsSearchResults } from "./api/mats";
import { useSpoilers } from "../hooks/useSpoilers";
import {
  baseCharacters,
  baseUrl,
  colour,
  optionToLabel,
  sortDirectionOptions,
} from "../data/common";

import Empty from "../components/empty";
import Dropdown from "../components/dropdown";
import Layout from "../components/layout";

const matsPerPage = 5;

const sortOrderOptions = [
  { id: "name", name: "Name" },
  { id: "health", name: "Health" },
  { id: "cards", name: "Cards" },
];

function MatsToolbar() {
  const router = useRouter();
  const query = router.query;

  function handleSortOrderChange(newOrder) {
    router.push({
      pathname: "/mats",
      query: { ...query, order: newOrder },
    });
  }

  function handleSortDirectionChange(newDirection) {
    router.push({
      pathname: "/mats",
      query: { ...query, dir: newDirection },
    });
  }

  return (
    <div className="toolbar">
      <div className="toolbar-inner">
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
      </div>
    </div>
  );
}

function Mats({ searchResults }) {
  const { spoilers } = useSpoilers();

  const [mats, setMats] = useState(searchResults?.slice(0, matsPerPage) || []);

  function loadMore(page) {
    setMats(searchResults.slice(0, (page + 1) * matsPerPage));
  }

  useEffect(() => {
    setMats(searchResults?.slice(0, matsPerPage) || []);
  }, [searchResults]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colour(null));
  }, []);

  const matList =
    mats?.filter(
      (mat) =>
        baseCharacters.includes(mat.class) ||
        spoilers.characters?.has(mat.class)
    ) || [];

  return (
    <Layout>
      <MatsToolbar />
      {matList.length > 0 ? (
        <InfiniteScroll
          className="mat-list"
          hasMore={mats.length < searchResults.length}
          loader={<h4 key={0}>Loading...</h4>}
          loadMore={loadMore}
          pageStart={0}
        >
          {matList.map((card, idx) => (
            <div key={idx} className="mat">
              <img alt="" className="card-img" src={baseUrl + card.image} />
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        <Empty />
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const searchResults = await matsSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
}

export default Mats;
