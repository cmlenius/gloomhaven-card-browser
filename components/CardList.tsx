import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

import { getBaseUrl } from "../common/utils";
import { Card, MultiLevelCard } from "../common/types";
import Empty from "./Empty";

const CARDS_PER_PAGE = 12;

type CardProps = {
  card: Card;
  horizontal?: boolean;
  showId?: boolean;
  defaultBack?: boolean;
};

const Card = ({ card, horizontal, showId }: CardProps) => {
  return (
    <div className={horizontal ? "card-horizontal" : "card"}>
      {showId && <div className="card-id">{card.id}</div>}
      <div className="card-inner" style={{ paddingTop: horizontal ? "66%" : "150%" }}>
        <div className="card-img-front">
          <span aria-hidden="true" className="invisible">
            {card.name}
          </span>
          <img alt={String(card.name)} className="card-img" key={card.image} src={getBaseUrl() + card.image} />
        </div>
      </div>
    </div>
  );
};

type FlipCardProps = {
  card: Card;
  flipped: boolean;
  handleBtnClick?: () => void;
  horizontal?: boolean;
  showId?: boolean;
};

const FlipCard = ({ card, flipped, handleBtnClick, horizontal, showId }: FlipCardProps) => {
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
      {handleBtnClick && (
        <button className={` ${flipped ? "card-flip-btn-back" : "card-flip-btn"}`} onClick={handleBtnClick}>
          <FontAwesomeIcon
            className={` ${flipped ? "card-flip-svg-back" : "card-flip-svg"}`}
            icon={faArrowsRotate}
            height="48px"
          />
        </button>
      )}
    </div>
  );
};

const FlipCardWrapper = ({ card, horizontal, showId, defaultBack }: CardProps) => {
  const [flipped, setFlipped] = useState(defaultBack ? true : false);

  const handleBtnClick = () => {
    setFlipped(!flipped);
  };

  return (
    <FlipCard
      key={card.image}
      card={card}
      flipped={flipped}
      handleBtnClick={handleBtnClick}
      horizontal={horizontal}
      showId={showId}
    />
  );
};

type MultiLevelCardProps = {
  multiLevelCard: MultiLevelCard;
};

const MultiLevelCard = ({ multiLevelCard }: MultiLevelCardProps) => {
  const [level, setLevel] = useState(1);
  const [flipped, setFlipped] = useState(false);
  const maxLevel = multiLevelCard.image.length;

  const handleBtnClick = () => {
    setFlipped(!flipped);
  };

  const updateLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value);
    if (!newLevel || newLevel < 1 || newLevel > 9) return;
    setLevel(newLevel);
  };

  const card = {
    id: multiLevelCard.id,
    name: multiLevelCard.name,
    image: multiLevelCard.image[level - 1],
    imageBack: multiLevelCard.imageBack?.[level - 1],
  };

  return (
    <div>
      <div className="multi-level-card-controller">
        <div className="slider">
          <span>{"Level: " + (level || "1")}</span>
          <input
            type="range"
            name="level"
            id="level"
            min="1"
            max={maxLevel.toString()}
            onInput={updateLevel}
            value={level || 1}
          />
        </div>
      </div>
      <FlipCard key={card.image} card={card} flipped={flipped} handleBtnClick={handleBtnClick} />
    </div>
  );
};

type MultiLevelCardListProp = {
  cardList: MultiLevelCard[];
};

export const MultiLevelCardList = ({ cardList }: MultiLevelCardListProp) => {
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
      {data?.map((multiLevelCard) => <MultiLevelCard key={multiLevelCard.id} multiLevelCard={multiLevelCard} />)}
      {[...Array(4)].map((_, idx) => (
        <div key={idx}>
          <div className="multi-level-card-controller">
            <div className="slider"> </div>
          </div>
          <div className={"card"} />
        </div>
      ))}
    </InfiniteScroll>
  );
};

type CardListProps = {
  cardList: Card[];
  horizontal?: boolean;
  showId?: boolean;
  defaultBack?: boolean;
};

const CardList = ({ cardList, horizontal, showId, defaultBack }: CardListProps) => {
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
          <FlipCardWrapper
            key={card.image}
            card={card}
            horizontal={horizontal}
            showId={showId}
            defaultBack={defaultBack}
          />
        ) : (
          <Card key={card.image} card={card} horizontal={horizontal} showId={showId} />
        ),
      )}
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className={horizontal ? "card-horizontal" : "card"} />
      ))}
    </InfiniteScroll>
  );
};

export default CardList;
