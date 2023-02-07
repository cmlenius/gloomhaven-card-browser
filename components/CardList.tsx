import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

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
  name: number | string;
  image: string;
  imageBack?: string;
}

type CardProps = {
  card: Card;
  horizontal?: boolean;
};

const Card = ({ card, horizontal }: CardProps) => {
  return (
    <div className={horizontal ? "card-horizontal" : "card"}>
      <div
        className="card-inner"
        style={{ paddingTop: horizontal ? "66%" : "150%" }}
      >
        <div className="card-img-front">
          <img
            alt={String(card.name)}
            className="card-img"
            src={getBaseUrl() + card.image}
          />
        </div>
      </div>
    </div>
  );
};

const FlipCard = ({ card, horizontal }: CardProps) => {
  const [flipped, setFlipped] = useState(false);

  const handleBtnClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div className={horizontal ? "card-horizontal" : "card"}>
      <div
        className={`card-inner ${flipped ? "card-inner-flipped" : ""}`}
        style={{ paddingTop: horizontal ? "66%" : "150%" }}
      >
        <div className="card-img-front">
          <img
            alt={String(card.name)}
            className="card-img"
            src={getBaseUrl() + card.image}
          />
        </div>
        <div className="card-img-back">
          <img
            alt={String(card.name)}
            className="card-img"
            src={getBaseUrl() + card.imageBack}
          />
        </div>
      </div>
      <button
        className={`${flipped ? "card-flip-btn-back" : "card-flip-btn"}`}
        onClick={handleBtnClick}
      >
        <FontAwesomeIcon
          className={`${flipped ? "card-flip-svg-back" : "card-flip-svg"}`}
          icon={faArrowsRotate}
          height="48px"
        />
      </button>
    </div>
  );
};

type CardListProps = {
  cardList: Card[];
  horizontal?: boolean;
};

const CardList = ({ cardList, horizontal }: CardListProps) => {
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
      {data?.map((card, idx) =>
        card.imageBack ? (
          <FlipCard key={idx} card={card} horizontal={horizontal} />
        ) : (
          <Card key={idx} card={card} horizontal={horizontal} />
        )
      )}
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className={horizontal ? "card-horizontal" : "card"} />
      ))}
    </InfiniteScroll>
  );
};

export default CardList;
