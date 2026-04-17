import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Character, CharacterAbility, Option, Spoilers } from "../../common/types";
import {
  customSort,
  getBaseUrl,
  getCharacter,
  getCharacterClasses,
  getDefaultCharacterClass,
  verifyQueryParam,
} from "../../common/utils";
import { useSpoilers } from "../../hooks/useSpoilers";
import CardList from "..//CardList";
import Sort from "..//Sort";
import Empty from "../Empty";
import { characters } from "../../data/characters";
import { characterAbilityCards } from "../../data/character-ability-cards";
import { useCraftingStore } from "../../store/useCraftingStore";
import { serializeBuild, deserializeBuild } from "../../common/shareUtils";

const sortOrderOptions: Option[] = [
  { id: "level", name: "Level" },
  { id: "initiative", name: "Initiative" },
  { id: "name", name: "Name" },
];

const characterSpoilerFilter = (spoilers: Spoilers): ((card: CharacterAbility) => boolean) => {
  const baseCharacterClasses = new Set(characters.filter((c) => c.base).map((c) => c.class));
  const hiddenCharacterClasses = new Set(characters.filter((c) => c.hidden).map((c) => c.class));

  return (card) =>
    (baseCharacterClasses.has(card.class) ||
      spoilers.characters?.has(card.class) ||
      hiddenCharacterClasses.has(card.class)) &&
    card.level < 1 + (spoilers.level || 1);
};

type ClassFilterProps = {
  characterClass: string;
  game: string;
};

const ClassFilter = ({ characterClass, game }: ClassFilterProps) => {
  const router = useRouter();
  const query = router.query;

  return (
    <div className="filters">
      {getCharacterClasses(game)
        .filter((c) => !c.hidden)
        .map((char) => (
          <Link
            key={char.class}
            href={{
              pathname: `/${game}/characters/${char.class}`,
              query: {
                ...(query.dir && { dir: query.dir }),
                ...(query.order && { order: query.order }),
              },
            }}
            className={`filter-icon ${characterClass === char.class ? "filter-icon-selected" : ""}`}
          >
            <img alt="" src={getBaseUrl() + `icons/characters/${game}/${char.class}.png`} />
          </Link>
        ))}
    </div>
  );
};

type CharacterDetailsProps = {
  character: Character;
  spoilers: Spoilers;
};

const CharacterDetails = ({ character, spoilers }: CharacterDetailsProps) => {
  if (spoilers.characters.has(character.class) || character.base)
    return (
      <div className="character-details">
        <img alt="" src={getBaseUrl() + character.matImageBack} />
        <img alt="" src={getBaseUrl() + character.matImage} />
        <img alt="" src={getBaseUrl() + character.sheetImage} />
      </div>
    );
  return <Empty />;
};

type PageProps = {
  searchResults: CharacterAbility[];
  game: string;
  character: Character;
};

const CharactersPage = ({ character, game, searchResults }: PageProps) => {
  const { spoilers, updateSpoilers } = useSpoilers();
  const [showCharacterDetails, setShowCharacterDetails] = useState(false);
  const [sortOrder, setsortOrder] = useState("level");
  const [sortDirection, setSortDirection] = useState("asc");

  const {
    isCraftingMode,
    toggleCraftingMode,
    activeDeck,
    activeDeckClass,
    clearDeck,
    setDeck,
    toggleCard,
    viewActiveHand,
    toggleViewActiveHand,
    loadState,
    toastMessage,
    setToastMessage,
  } = useCraftingStore();

  const maxHandSize =
    searchResults?.filter((c) => c.level <= 1.5 && c.level > 0.5).length - 3 || 9;

  const updateLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value);
    if (!newLevel || newLevel < 1 || newLevel > 9) return;

    updateSpoilers({ ...spoilers, level: newLevel });

    if (isCraftingMode) {
      const validImages = new Set(
        searchResults?.filter((c) => c.level < 1 + newLevel).map((c) => c.image) || []
      );
      const filteredDeck = activeDeck.filter((img) => validImages.has(img));
      if (filteredDeck.length !== activeDeck.length) {
        setDeck(filteredDeck);
      }
    }
  };

  const handleSortOrderChange = (newValue: string) => {
    setsortOrder(newValue);
  };
  const handleSortDirectionChange = (newValue: string) => {
    setSortDirection(newValue);
  };

  let cardList =
    searchResults
      ?.filter(characterSpoilerFilter(spoilers))
      .sort(customSort(sortOrder || "id", sortDirection || "asc")) || [];

  if (isCraftingMode && viewActiveHand) {
    cardList = cardList.filter((card) => activeDeck.includes(card.image));
  }

  useEffect(() => {
    if (character) document.documentElement.style.setProperty("--primary", character.colour);
  }, [character]);

  useEffect(() => {
    if (isCraftingMode && activeDeckClass && character?.class && activeDeckClass !== character.class) {
      clearDeck();
    }
  }, [character?.class, activeDeckClass, isCraftingMode, clearDeck]);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.query.build) {
      const decodedDeck = deserializeBuild(router.query.build as string);
      if (decodedDeck && character?.class) {
        // Map names back to images where possible
        const images = decodedDeck.map(name => 
          searchResults?.find(c => c.name === name)?.image
        ).filter(Boolean) as string[];
        
        if (images.length > 0) {
          loadState(character.class, images);
        }
        
        // Remove the query param from the URL visually
        const url = new URL(window.location.href);
        url.searchParams.delete("build");
        router.replace(url.pathname + url.search, undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query.build, character?.class, loadState]);

  const handleShare = () => {
    // reduce to just name parts to save URL space
    const cardNames = searchResults
      ?.filter(c => activeDeck.includes(c.image))
      .map(c => c.name) || [];

    const code = serializeBuild(cardNames);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("build", code);
    navigator.clipboard.writeText(newUrl.toString());
    setToastMessage("Build link copied to clipboard!");
  };

  return (
    <>
      {toastMessage && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#1e1e1e",
          color: "white",
          padding: "12px 24px",
          border: `2px solid ${character?.colour || "gold"}`,
          borderRadius: "8px",
          zIndex: 9999,
          boxShadow: "0px 4px 6px rgba(0,0,0,0.5)",
          fontWeight: "bold",
          transition: "opacity 0.3s ease-in-out"
        }}>
          {toastMessage}
        </div>
      )}
      <div className="toolbar">
        <div className="toolbar-inner">
          <div>
            <div className="flex">
              <Sort
                sortOrderOptions={sortOrderOptions}
                handleSortOrderChange={handleSortOrderChange}
                handleSortDirectionChange={handleSortDirectionChange}
                sortOrder={sortOrder}
                sortDirection={sortDirection}
              />
            </div>
          </div>
          {!spoilers.loading && (
            <div className="slider">
              <span>{"Level: " + (spoilers.level || "1")}</span>
              <input
                type="range"
                name="level"
                id="level"
                min="1"
                max="9"
                onInput={updateLevel}
                value={spoilers.level || 1}
              />
            </div>
          )}
          <div>
            <div className="button-group">
              <button
                className={!showCharacterDetails ? "btn-selected" : ""}
                onClick={() => setShowCharacterDetails(false)}
              >
                Ability Cards
              </button>
              <button
                className={showCharacterDetails ? "btn-selected" : ""}
                onClick={() => setShowCharacterDetails(true)}
              >
                Character Details
              </button>
              {!showCharacterDetails && (
                <button
                  className={isCraftingMode ? "btn-selected" : ""}
                  onClick={toggleCraftingMode}
                >
                  Build Mode
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ClassFilter game={game} characterClass={character?.class} />
      {!spoilers.loading &&
        (showCharacterDetails ? (
          <CharacterDetails character={character} spoilers={spoilers} />
        ) : (
          <CardList
            cardList={cardList}
            isCraftingMode={isCraftingMode}
            activeDeck={activeDeck}
            characterColour={character?.colour}
            onCardToggle={(image) => toggleCard(image, character?.class, maxHandSize)}
          />
        ))}

      {isCraftingMode && !showCharacterDetails && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          backgroundColor: "#1e1e1e",
          borderTop: `4px solid ${character?.colour || "#555"}`,
          zIndex: 1000
        }}>
          <span style={{ fontWeight: "bold", color: "white" }}>
            Cards Selected: {activeDeck.length} / {maxHandSize}
          </span>
          <div className="button-group" style={{ margin: 0, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className={!viewActiveHand ? "btn-selected" : ""}
              onClick={() => viewActiveHand && toggleViewActiveHand()}
            >
              All Cards
            </button>
            <button
              className={viewActiveHand ? "btn-selected" : ""}
              onClick={() => !viewActiveHand && toggleViewActiveHand()}
            >
              Active Hand
            </button>
            <button onClick={handleShare}>Share</button>
            <button onClick={clearDeck}>Clear</button>
          </div>
        </div>
      )}
    </>
  );
};

export const characterSearchResults = (query: { [key: string]: string | string[] }) => {
  const game = verifyQueryParam(query.game, "gh");
  const className = verifyQueryParam(query.character, getDefaultCharacterClass(game));

  const character = getCharacter(game, className?.toUpperCase());
  if (character == null) {
    return [];
  }

  return (
    characterAbilityCards[game]?.[character?.class.toUpperCase()]
      ?.map((card) => (card.name.endsWith("-back") ? { ...card, name: character?.name } : card))
      .sort(customSort("level", "asc")) || []
  );
};

export default CharactersPage;
