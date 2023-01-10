import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

import { getBaseUrl } from "../common/helpers";

const CARDS_PER_PAGE = 12;

const Empty = () => {
  return (
    <div className="empty">
      <FontAwesomeIcon icon={faBan} height="48px" />
      <div>No Results</div>
      <div>
        Check your spoiler settings or try changing your search & filters
      </div>
    </div>
  );
};

interface Card {
  name: string;
  image: string;
}

type CardListProps = {
  cardList: Card[];
};

const CardList = ({ cardList }: CardListProps) => {
  const [data, setData] = useState(cardList.slice(0, CARDS_PER_PAGE));

  const loadMore = (page: number) => {
    setData(cardList?.slice(0, (page + 1) * CARDS_PER_PAGE));
  };

  useEffect(() => {
    setData(cardList?.slice(0, CARDS_PER_PAGE));
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
            src={getBaseUrl() + card.image}
          />
        </div>
      ))}
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="card" />
      ))}
    </InfiniteScroll>
  );
};

export default CardList;
