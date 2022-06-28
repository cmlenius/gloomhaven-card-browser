import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { baseUrl } from "../data/utils";
import Empty from "../components/Empty";

function CardList({ cardList, isSingleColumn }) {
  const cardsPerPage = isSingleColumn ? 4 : 12;

  const [data, setData] = useState(cardList.slice(0, cardsPerPage));

  function loadMore(page) {
    setData(cardList?.slice(0, (page + 1) * cardsPerPage));
  }

  useEffect(() => {
    setData(cardList?.slice(0, cardsPerPage));
  }, [cardsPerPage, cardList]);
   
  if (data?.length === 0) return <Empty />;

  return (
    <InfiniteScroll
      className={isSingleColumn ? "mat-list" : "card-list"}
      hasMore={data?.length < cardList.length}
      loader={<h4 key={0}>Loading...</h4>}
      loadMore={loadMore}
      pageStart={0}
    >
      {data?.map((card, idx) => (
        <div key={idx} className={isSingleColumn ? "mat" : "card"}>
          <img
            alt={card.name}
            className="card-img"
            src={baseUrl + card.image}
          />
        </div>
      ))}
      {!isSingleColumn &&
        [...Array(4)].map((_, idx) => <div key={idx} className="card" />)}
    </InfiniteScroll>
  );
}

export default CardList;
