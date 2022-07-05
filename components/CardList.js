import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { baseUrl } from "../data/utils";
import Empty from "../components/Empty";

const cardsPerPage = 12;

function CardList({ cardList }) {
  const [data, setData] = useState(cardList.slice(0, cardsPerPage));

  function loadMore(page) {
    setData(cardList?.slice(0, (page + 1) * cardsPerPage));
  }

  useEffect(() => {
    setData(cardList?.slice(0, cardsPerPage));
  }, [cardList]);

  if (data?.length === 0) return <Empty />;

  return (
    <InfiniteScroll
      className="card-list"
      hasMore={data?.length < cardList.length}
      loader={<h4 key={0}>Loading...</h4>}
      loadMore={loadMore}
      pageStart={0}
    >
      {data?.map((card, idx) => (
        <div key={idx} className="card">
          <img
            alt={card.name}
            className="card-img"
            src={baseUrl + card.image}
          />
        </div>
      ))}
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="card" />
      ))}
    </InfiniteScroll>
  );
}

export default CardList;
