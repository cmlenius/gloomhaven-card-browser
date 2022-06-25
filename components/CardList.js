import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { baseUrl } from "../data/common";
import Empty from "../components/Empty";

function CardList({ isSingleColumn, searchResults, spoilerFilterFn }) {
  const cardsPerPage = isSingleColumn ? 4 : 12;

  const [data, setData] = useState(searchResults.slice(0, cardsPerPage));

  function loadMore(page) {
    setData(searchResults.slice(0, (page + 1) * cardsPerPage));
  }

  useEffect(() => {
    setData(searchResults.slice(0, cardsPerPage));
  }, [cardsPerPage, searchResults]);

  const cardList = data.filter(spoilerFilterFn);

  if (cardList.length === 0) return <Empty />;

  return (
    <InfiniteScroll
      className={isSingleColumn ? "mat-list" : "card-list"}
      hasMore={data.length < searchResults.length}
      loader={<h4 key={0}>Loading...</h4>}
      loadMore={loadMore}
      pageStart={0}
    >
      {cardList.map((card, idx) => (
        <div key={idx} className={isSingleColumn ? "mat" : "card"}>
          <img alt="" className="card-img" src={baseUrl + card.image} />
        </div>
      ))}
      {!isSingleColumn &&
        [...Array(4)].map((_, idx) => <div key={idx} className="card" />)}
    </InfiniteScroll>
  );
}

export default CardList;
