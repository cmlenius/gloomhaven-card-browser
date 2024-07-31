import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

import { getBaseUrl } from "../common/helpers";
import { Card } from "../common/types";
import Empty from "./Empty";

const CARDS_PER_PAGE = 12;

type CardProps = {
  card: Card;
  horizontal?: boolean;
  showId?: boolean;
};

const Card = ({ card, horizontal, showId }: CardProps) => {
  return (
    <div className={horizontal ? "card-horizontal" : "card"}>
      {showId && <div className="card-id">{card.id}</div>}
      <div
        className="card-inner"
        style={{ paddingTop: horizontal ? "66%" : "150%" }}
      >
        <div className="card-img-front">
          <span aria-hidden="true" className="invisible">
            {card.name}
          </span>
          <img
            alt={String(card.name)}
            className="card-img"
            key={card.image}
            src={getBaseUrl() + card.image}
          />
        </div>
      </div>
    </div>
  );
};

const FlipCard = ({ card, horizontal, showId }: CardProps) => {
  const [flipped, setFlipped] = useState(false);

  const handleBtnClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div className={horizontal ? "card-horizontal" : "card"}>
      {showId && <div className="card-id">{card.id}</div>}
      <div
        className={`card-inner ${flipped ? "card-inner-flipped" : ""}`}
        style={{ paddingTop: horizontal ? "66%" : "150%" }}
      >
        <div className="card-img-front">
          <span aria-hidden="true" className="invisible">
            {card.name}
          </span>
          <img
            alt={String(card.name)}
            className="card-img"
            src={getBaseUrl() + card.image}
            key={card.image + "-front"}
          />
        </div>
        <div className="card-img-back">
          <span aria-hidden="true" className="invisible">
            {card.name}
          </span>
          <img
            alt={String(card.name)}
            className="card-img"
            src={getBaseUrl() + card.imageBack}
            key={card.image + "-back"}
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
  showId?: boolean;
};

const CardList = ({ cardList, horizontal, showId }: CardListProps) => {
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
      {data?.map((card) =>
        card.imageBack ? (
          <FlipCard
            key={card.image}
            card={card}
            horizontal={horizontal}
            showId={showId}
          />
        ) : (
          <Card
            key={card.image}
            card={card}
            horizontal={horizontal}
            showId={showId}
          />
        )
      )}
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className={horizontal ? "card-horizontal" : "card"} />
      ))}
    </InfiniteScroll>
  );
};

export default CardList;
