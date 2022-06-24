import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";

import { useSpoilers } from "../hooks/useSpoilers";
import {
  baseCharacters,
  baseUrl,
  cardsPerPage,
  characterClasses,
  colour,
  hiddenCharacters,
} from "../data/common";
import { characterSearchResults } from "./api/characters";

import Empty from "../components/Empty";
import Layout from "../components/Layout";
import Toolbar from "../components/Toolbar";
import SvgCharacterIcon from "../components/Svg";

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
      {characterClasses.map((char, idx) => (
        <div
          key={idx}
          className={`filter-icon ${
            query.class === char ? "filter-icon-selected" : ""
          }`}
          onClick={() => handleClassChange(char)}
        >
          <SvgCharacterIcon character={char} />
        </div>
      ))}
    </div>
  );
}

function Characters({ searchResults }) {
  const { spoilers } = useSpoilers();
  const router = useRouter();
  const query = router.query;

  const [classes, setClasses] = useState(
    searchResults?.slice(0, cardsPerPage) || []
  );

  function loadMore(page) {
    setClasses(searchResults.slice(0, (page + 1) * cardsPerPage));
  }

  useEffect(() => {
    setClasses(searchResults?.slice(0, cardsPerPage) || []);
  }, [searchResults]);

  useEffect(() => {
    if (query.class) {
      document.documentElement.style.setProperty(
        "--primary",
        colour(query.class)
      );
    } else {
      router.push({
        pathname: "/characters",
        query: { ...query, class: "BR" },
      });
    }
  }, [query, router]);

  const cardList =
    classes?.filter(
      (card) =>
        baseCharacters.includes(card.class) ||
        spoilers.characters?.has(card.class) ||
        hiddenCharacters.includes(card.class)
    ) || [];

  return (
    <Layout>
      <Toolbar
        Filters={ClassFilter}
        pathname="/characters"
        sortOrderOptions={sortOrderOptions}
      />
      {cardList.length > 0 ? (
        <InfiniteScroll
          className="card-list"
          hasMore={classes.length < searchResults.length}
          loader={<h4 key={0}>Loading...</h4>}
          loadMore={loadMore}
          pageStart={0}
        >
          {cardList.map((card, idx) => (
            <div key={idx} className="card">
              <img alt="" className="card-img" src={baseUrl + card.image} />
            </div>
          ))}
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="card" />
          ))}
        </InfiniteScroll>
      ) : (
        <Empty />
      )}
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
