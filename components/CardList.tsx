import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

import { Card, MultiLevelCard } from "../common/types";
import { getBaseUrl } from "../common/utils";
import Empty from "./Empty";

const CARDS_PER_PAGE = 12;

const useInfiniteSlice = <T,>(items: T[]) => {
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
  const [prevItems, setPrevItems] = useState(items);
  const sentinelRef = useRef<HTMLDivElement>(null);

  if (items !== prevItems) {
    setPrevItems(items);
    setVisibleCount(CARDS_PER_PAGE);
  }

  const effectiveVisibleCount = items !== prevItems ? CARDS_PER_PAGE : visibleCount;
  const hasMore = effectiveVisibleCount < (items?.length || 0);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + CARDS_PER_PAGE, items.length));
        }
      },
      { rootMargin: "250px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, items?.length, effectiveVisibleCount]);

  return {
    data: items?.slice(0, effectiveVisibleCount) || [],
    hasMore,
    sentinelRef,
  };
};

// Some edge case cards like FH245 (Ancient Coin) can trigger React map key
// collisions, leading to leaks.  Dedupe with a suffix for these edge cases.
const makeKeyDeduper = () => {
  const seen = new Map<string, number>();
  return (base: string) => {
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}#${count}`;
  };
};

type CardProps = {
  card: Card;
  horizontal?: boolean;
  showId?: boolean;
  defaultBack?: boolean;
  isSelected?: boolean;
  isCraftingMode?: boolean;
  onToggle?: () => void;
};

const CardComponent = ({ card, horizontal, showId, isSelected, isCraftingMode, onToggle }: CardProps) => {
  return (
    <div
      className={`${horizontal ? "card-horizontal" : "card"} ${isCraftingMode ? "card-crafting-mode" : ""}`}
      style={{ opacity: isCraftingMode && !isSelected ? "0.75" : "1" }}
      onClick={() => isCraftingMode && onToggle && onToggle()}
    >
      {showId && <div className="card-id">{card.id}</div>}
      <div className="card-inner">
        <div className="card-img-front">
          <span aria-hidden="true" className="invisible">
            {card.name}
          </span>
          <img
            alt={String(card.name)}
            className="card-img"
            decoding="async"
            key={card.image}
            loading="lazy"
            src={getBaseUrl() + card.image}
          />
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
  onToggle?: () => void;
};

const FlipCard = ({
  card,
  flipped,
  handleBtnClick,
  horizontal,
  showId,
  isSelected,
  isCraftingMode,
  onToggle,
}: FlipCardProps) => {
  return (
    <div
      className={`${horizontal ? "card-horizontal" : "card"} ${isSelected ? "card-selected" : ""}`}
      onClick={() => isCraftingMode && onToggle && onToggle()}
      style={{ opacity: isCraftingMode && !isSelected ? "0.75" : "1" }}
    >
      {showId && <div className="card-id">{card.id}</div>}
      <div className={`card-inner ${flipped ? "card-inner-flipped" : ""}`}>
        <div className="card-img-front">
          <span aria-hidden="true" className="invisible">
            {card.name}
          </span>
          <img
            alt={String(card.name)}
            className="card-img"
            decoding="async"
            loading="lazy"
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
            decoding="async"
            loading="lazy"
            src={getBaseUrl() + card.imageBack}
            key={card.image + "-back"}
          />
        </div>
      </div>
      {handleBtnClick && (
        <button
          className={` ${flipped ? "card-flip-btn-back" : "card-flip-btn"}`}
          onClick={(e) => {
            e.stopPropagation();
            handleBtnClick();
          }}
        >
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

const FlipCardWrapper = ({
  card,
  horizontal,
  showId,
  defaultBack,
  isSelected,
  isCraftingMode,
  onToggle,
}: CardProps) => {
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
      onToggle={onToggle}
    />
  );
};

type MultiLevelCardProps = {
  multiLevelCard: MultiLevelCard;
};

const MultiLevelCardComponent = ({ multiLevelCard }: MultiLevelCardProps) => {
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
  const { data, hasMore, sentinelRef } = useInfiniteSlice(cardList);

  if (data.length === 0) return <Empty />;

  const dedupeKey = makeKeyDeduper();

  return (
    <div className="card-list">
      {data.map((multiLevelCard) => (
        <MultiLevelCardComponent key={dedupeKey(String(multiLevelCard.id))} multiLevelCard={multiLevelCard} />
      ))}
      {[...Array(4)].map((_, idx) => (
        <div key={idx}>
          <div className="multi-level-card-controller">
            <div className="slider"> </div>
          </div>
          <div className={"card"} />
        </div>
      ))}
      {hasMore && (
        <div ref={sentinelRef} style={{ width: "100%", textAlign: "center" }}>
          <h4>Loading...</h4>
        </div>
      )}
    </div>
  );
};

type CardListProps = {
  cardList: Card[];
  horizontal?: boolean;
  showId?: boolean;
  defaultBack?: boolean;
  isCraftingMode?: boolean;
  activeDeck?: string[];
  onCardToggle?: (image: string) => void;
};

const CardList = ({
  cardList,
  horizontal,
  showId,
  defaultBack,
  isCraftingMode,
  activeDeck,
  onCardToggle,
}: CardListProps) => {
  const { data, hasMore, sentinelRef } = useInfiniteSlice(cardList);

  if (data.length === 0) return <Empty />;

  const dedupeKey = makeKeyDeduper();

  return (
    <div className="card-list">
      {data.map((card) => {
        const charAbilCard = card as Card & { level?: number };
        const isBackCard =
          charAbilCard.level === 0 ||
          charAbilCard.level === 0.5 ||
          charAbilCard.level === 0.25 ||
          card.image.endsWith("-back.jpeg");
        const isSelected = isCraftingMode ? activeDeck?.includes(card.image) : false;
        const toggle = () => {
          if (!isBackCard && onCardToggle) onCardToggle(card.image);
        };
        const clickable = isCraftingMode && !isBackCard;
        const key = dedupeKey(card.imageBack ? card.name + "-" + card.image : card.image);

        return card.imageBack ? (
          <FlipCardWrapper
            key={key}
            card={card}
            horizontal={horizontal}
            showId={showId}
            defaultBack={defaultBack}
            isSelected={isSelected}
            isCraftingMode={clickable}
            onToggle={toggle}
          />
        ) : (
          <CardComponent
            key={key}
            card={card}
            horizontal={horizontal}
            showId={showId}
            isSelected={isSelected}
            isCraftingMode={clickable}
            onToggle={toggle}
          />
        );
      })}
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className={horizontal ? "card-horizontal" : "card"} />
      ))}
      {hasMore && (
        <div ref={sentinelRef} style={{ width: "100%", textAlign: "center" }}>
          <h4>Loading...</h4>
        </div>
      )}
    </div>
  );
};

export default CardList;
