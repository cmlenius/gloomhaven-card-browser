import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { deserializeBuild, serializeBuild } from "../../common/shareUtils";
import { Character, CharacterAbility, CharacterAdditionalCardsSection, Option, Spoilers } from "../../common/types";
import {
  assignCardIds,
  customSort,
  getBaseUrl,
  getCharacter,
  getCharacterClasses,
  getDefaultCharacterClass,
  getGame,
  verifyQueryParam,
} from "../../common/utils";
import { characterAbilityCards } from "../../data/character-ability-cards";
import { characterAdditionalCards } from "../../data/character-additional-cards";
import { useCraftingStore } from "../../hooks/useCraftingStore";
import { useSpoilers } from "../../hooks/useSpoilers";
import CardList from "..//CardList";
import Sort from "..//Sort";
import Empty from "../Empty";
import ToastMessage from "../ToastMessage";

const sortOrderOptions: Option[] = [
  { id: "level", name: "Level" },
  { id: "initiative", name: "Initiative" },
  { id: "name", name: "Name" },
];

const characterSpoilerFilter = (spoilers: Spoilers): ((card: CharacterAbility) => boolean) => {
  return (card) => card.level < 1 + (spoilers.level || 1);
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

type SpoilerGateProps = {
  character: Character;
  game: string;
  maxHandSize: number;
  totalCards: number;
  onUnlock: () => void;
};

const SpoilerGate = ({ character, game, maxHandSize, totalCards, onUnlock }: SpoilerGateProps) => {
  const displayName = character.altName || character.name;
  const gameName = getGame(game)?.name || "Gloomhaven";

  return (
    <div className="spoiler-gate">
      <img
        alt={displayName}
        className="spoiler-gate-icon"
        src={getBaseUrl() + `icons/characters/${game}/${character.class}.png`}
      />
      <h2 className="spoiler-gate-title">{displayName} Class — Spoiler Protected</h2>
      <p className="spoiler-gate-description">
        This unlockable {gameName} class ({totalCards} ability cards, hand size {maxHandSize}) is hidden to prevent
        spoilers.
      </p>
      <button className="spoiler-gate-btn" onClick={onUnlock}>
        Reveal {displayName} Spoilers
      </button>
    </div>
  );
};

type CharacterDetailsProps = {
  character: Character | null;
  isCharacterUnlocked: boolean;
};

const CharacterDetails = ({ character, isCharacterUnlocked }: CharacterDetailsProps) => {
  if (isCharacterUnlocked && character)
    return (
      <div className="character-details">
        {character.matImageBack && (
          <img alt="" decoding="async" loading="lazy" src={getBaseUrl() + character.matImageBack} />
        )}
        {character.matImage && <img alt="" decoding="async" loading="lazy" src={getBaseUrl() + character.matImage} />}
        {character.sheetImage && (
          <img alt="" decoding="async" loading="lazy" src={getBaseUrl() + character.sheetImage} />
        )}
      </div>
    );
  return <Empty />;
};

type AdditionalCardsProps = {
  sections: CharacterAdditionalCardsSection[];
};

const AdditionalCards = ({ sections }: AdditionalCardsProps) => {
  return (
    <>
      {sections.map((section) => (
        <div key={section.label} className="additional-cards-section">
          <CardList cardList={section.cards} horizontal={section.horizontal} />
        </div>
      ))}
    </>
  );
};

type PageProps = {
  searchResults: SearchResult;
  game: string;
  character: Character | null;
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

  const { abilityCards, additionalCards } = searchResults;
  const maxHandSize = abilityCards?.filter((c) => c.level === 1).length || 9;
  const totalAbilityCards = abilityCards?.filter((c) => c.level >= 1).length || 0;
  const isCharacterUnlocked = Boolean(
    character && (spoilers.characters.has(character.class) || character.base || character.hidden),
  );
  const showAdditionalCards = additionalCards && isCharacterUnlocked && !isCraftingMode && !showCharacterDetails;

  const handleUnlockCharacter = () => {
    if (!character) return;
    const newCharacters = new Set(spoilers.characters);
    newCharacters.add(character.class);
    updateSpoilers({ ...spoilers, characters: newCharacters });
  };

  const updateLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value);
    if (!newLevel || newLevel < 1 || newLevel > 9) return;

    updateSpoilers({ ...spoilers, level: newLevel });

    if (isCraftingMode) {
      const validImages = new Set(abilityCards?.filter((c) => c.level < 1 + newLevel).map((c) => c.image) || []);
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

  const filteredSortedCards = useMemo(
    () =>
      abilityCards
        ?.filter(characterSpoilerFilter(spoilers))
        .sort(customSort(sortOrder || "id", sortDirection || "asc")) || [],
    [abilityCards, spoilers, sortOrder, sortDirection],
  );

  const cardList = useMemo(
    () =>
      isCraftingMode && viewActiveHand
        ? filteredSortedCards.filter((card) => activeDeck.includes(card.image))
        : filteredSortedCards,
    [filteredSortedCards, isCraftingMode, viewActiveHand, activeDeck],
  );

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
      const decodedBuild = deserializeBuild(router.query.build as string);

      if (decodedBuild && character?.class) {
        if (decodedBuild.characterClass !== character.class) {
          setToastMessage(`Build is for a different class (${decodedBuild.characterClass})`);
        } else {
          const idSet = new Set(decodedBuild.cardIds);
          const images = abilityCards?.filter((c) => c.id != null && idSet.has(c.id)).map((c) => c.image) || [];

          if (images.length > 0) {
            loadState(character.class, images);
          }
        }

        const url = new URL(window.location.href);
        url.searchParams.delete("build");
        router.replace(url.pathname + url.search, undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query.build, character?.class, abilityCards, loadState, setToastMessage, router]);

  const handleShare = () => {
    if (!character) return;
    const cardIds =
      abilityCards
        ?.filter((c) => activeDeck.includes(c.image))
        .map((c) => c.id)
        .filter((id): id is number => id != null) || [];

    const code = serializeBuild(character.class, cardIds);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("build", code);
    navigator.clipboard.writeText(newUrl.toString());
    setToastMessage("Build link copied to clipboard!");
  };

  return (
    <>
      <ToastMessage message={toastMessage} colour={character?.colour} />
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
                className={!showCharacterDetails && !isCraftingMode ? "btn-selected" : ""}
                onClick={() => {
                  setShowCharacterDetails(false);
                  if (isCraftingMode) toggleCraftingMode();
                }}
              >
                Ability Cards
              </button>
              <button
                className={!showCharacterDetails && isCraftingMode ? "btn-selected" : ""}
                disabled={!isCharacterUnlocked}
                onClick={() => {
                  if (showCharacterDetails) setShowCharacterDetails(false);
                  if (!isCraftingMode) toggleCraftingMode();
                }}
              >
                Build Mode
              </button>
              <button
                className={showCharacterDetails ? "btn-selected" : ""}
                disabled={!isCharacterUnlocked}
                onClick={() => setShowCharacterDetails(true)}
              >
                Character Details
              </button>
            </div>
          </div>
        </div>
      </div>
      <ClassFilter game={game} characterClass={character?.class || ""} />
      {character?.link && (
        <a href={character.link} className="character-link" target="_blank" rel="noreferrer">
          {character.linkLabel || character.link}
        </a>
      )}
      {!isCharacterUnlocked && character ? (
        <div className="spoiler-card-container">
          <SpoilerGate
            character={character}
            game={game}
            maxHandSize={maxHandSize}
            totalCards={totalAbilityCards}
            onUnlock={handleUnlockCharacter}
          />
          <div className="spoiler-blurred-cards">
            <CardList cardList={cardList} />
          </div>
        </div>
      ) : showCharacterDetails ? (
        <CharacterDetails character={character} isCharacterUnlocked={isCharacterUnlocked} />
      ) : (
        <>
          <CardList
            cardList={cardList}
            isCraftingMode={isCraftingMode}
            activeDeck={activeDeck}
            onCardToggle={(image) => character && toggleCard(image, character.class, maxHandSize)}
          />
          {isCraftingMode && <div style={{ padding: "36px" }} />}
        </>
      )}
      {showAdditionalCards && <AdditionalCards sections={additionalCards} />}

      {isCraftingMode && !showCharacterDetails && (
        <div className="build-toolbar" style={{ borderTopColor: character?.colour || "#555" }}>
          <span className="build-toolbar-label">
            Cards Selected: {activeDeck.length} / {maxHandSize}
          </span>
          <div className="build-toolbar-buttons">
            <button onClick={toggleViewActiveHand}>{viewActiveHand ? "View All Cards" : "View Active Hand"}</button>
            <button onClick={handleShare}>Share</button>
            <button
              onClick={() => {
                clearDeck();
                setToastMessage("Active Hand Cleared!");
                if (viewActiveHand) {
                  toggleViewActiveHand();
                }
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export type CharacterPageProps = {
  searchResults: SearchResult;
};

export type SearchResult = {
  abilityCards: CharacterAbility[];
  additionalCards: CharacterAdditionalCardsSection[] | null;
};

export const characterSearchResults = (query: { [key: string]: string | string[] }): SearchResult => {
  const game = verifyQueryParam(query.game, "gh");
  const className = verifyQueryParam(query.character, getDefaultCharacterClass(game));

  const character = getCharacter(game, className?.toUpperCase());
  if (character == null) {
    return {
      abilityCards: [],
      additionalCards: null,
    };
  }

  const sorted =
    characterAbilityCards[game]?.[character?.class.toUpperCase()]
      ?.map((card) => (card.name.endsWith("-back") ? { ...card, name: character?.name } : card))
      .sort(customSort("level", "asc")) || [];

  const additionalCards = characterAdditionalCards[game]?.[character?.class.toUpperCase()];

  return {
    abilityCards: assignCardIds(sorted),
    additionalCards: additionalCards || null,
  };
};

export default CharactersPage;
