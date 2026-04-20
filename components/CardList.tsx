import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import { Card, MultiLevelCard } from "../common/types";
import { getBaseUrl } from "../common/utils";
import Empty from "./Empty";

const CARDS_PER_PAGE = 12;

type CardProps = {
  card: Card;
  horizontal?: boolean;
  showId?: boolean;
  defaultBack?: boolean;
  isSelected?: boolean;
  isCraftingMode?: boolean;
  characterColour?: string;
  onToggle?: () => void;
};

const Card = ({ card, horizontal, showId, isSelected, isCraftingMode, characterColour, onToggle }: CardProps) => {
  return (
    <div
      className={`${horizontal ? "card-horizontal" : "card"} ${isSelected ? "card-selected" : ""}`}
      onClick={() => isCraftingMode && onToggle && onToggle()}
      style={{ cursor: isCraftingMode ? "pointer" : "default", border: isSelected ? `4px solid ${characterColour || "gold"}` : "none", borderRadius: "10px" }}
    >
      {showId && <div className="card-id">{card.id}</div>}
      <div className="card-inner">
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
  isSelected?: boolean;
  isCraftingMode?: boolean;
  characterColour?: string;
  onToggle?: () => void;
};

const FlipCard = ({ card, flipped, handleBtnClick, horizontal, showId, isSelected, isCraftingMode, characterColour, onToggle }: FlipCardProps) => {
  return (
    <div
      className={`${horizontal ? "card-horizontal" : "card"} ${isSelected ? "card-selected" : ""}`}
      onClick={() => isCraftingMode && onToggle && onToggle()}
      style={{ cursor: isCraftingMode ? "pointer" : "default", border: isSelected ? `4px solid ${characterColour || "gold"}` : "none", borderRadius: "10px" }}
    >
      {showId && <div className="card-id">{card.id}</div>}
      <div
        className={`card-inner ${flipped ? "card-inner-flipped" : ""}`}
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
        <button className={` ${flipped ? "card-flip-btn-back" : "card-flip-btn"}`} onClick={(e) => { e.stopPropagation(); handleBtnClick(); }}>
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

const FlipCardWrapper = ({ card, horizontal, showId, defaultBack, isSelected, isCraftingMode, characterColour, onToggle }: CardProps) => {
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
      isSelected={isSelected}
      isCraftingMode={isCraftingMode}
      characterColour={characterColour}
      onToggle={onToggle}
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
  isCraftingMode?: boolean;
  activeDeck?: string[];
  characterColour?: string;
  onCardToggle?: (image: string) => void;
};

const CardList = ({ cardList, horizontal, showId, defaultBack, isCraftingMode, activeDeck, characterColour, onCardToggle }: CardListProps) => {
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
      {data?.map((card) => {
        const charAbilCard = card as Card & { level?: number };
        const isBackCard = charAbilCard.level === 0 || charAbilCard.level === 0.5 || charAbilCard.level === 0.25 || card.image.endsWith("-back.jpeg");
        const isSelected = isCraftingMode ? activeDeck?.includes(card.image) : false;
        const toggle = () => {
          if (!isBackCard && onCardToggle) onCardToggle(card.image);
        };
        const clickable = isCraftingMode && !isBackCard;

        return card.imageBack ? (
          <FlipCardWrapper
            key={card.image}
            card={card}
            horizontal={horizontal}
            showId={showId}
            defaultBack={defaultBack}
            isSelected={isSelected}
            isCraftingMode={clickable}
            characterColour={characterColour}
            onToggle={toggle}
          />
        ) : (
          <Card
            key={card.image}
            card={card}
            horizontal={horizontal}
            showId={showId}
            isSelected={isSelected}
            isCraftingMode={clickable}
            characterColour={characterColour}
            onToggle={toggle}
          />
        );
      })}
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className={horizontal ? "card-horizontal" : "card"} />
      ))}
    </InfiniteScroll>
  );
};

export default CardList;
