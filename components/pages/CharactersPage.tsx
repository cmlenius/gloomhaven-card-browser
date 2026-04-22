import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Character, CharacterAbility, CharacterAdditionalCardsSection, Option, Spoilers } from "../../common/types";
import {
  assignCardIds,
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
import ToastMessage from "../ToastMessage";
import { characters } from "../../data/characters";
import { characterAbilityCards } from "../../data/character-ability-cards";
import { characterAdditionalCards } from "../../data/character-additional-cards";
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

type AdditionalCardsProps = {
  sections: CharacterAdditionalCardsSection[];
};

const AdditionalCards = ({ sections }: AdditionalCardsProps) => {
  return (
    <>
      {sections.map((section) => (
        <div className="additional-cards-section">
          <CardList cardList={section.cards} horizontal={section.horizontal} />
        </div>
      ))}
    </>
  );
};

type PageProps = {
  searchResults: SearchResult;
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

  const { abilityCards, additionalCards } = searchResults;
  const maxHandSize = abilityCards?.filter((c) => c.level === 1).length || 9;

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

  let cardList =
    abilityCards
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
      const decodedBuild = deserializeBuild(router.query.build as string);

      if (decodedBuild && character?.class) {
        if (decodedBuild.characterClass !== character.class) {
          setToastMessage(`Build is for a different class (${decodedBuild.characterClass})`);
        } else {
          const idSet = new Set(decodedBuild.cardIds);
          const images = abilityCards?.filter((c) => idSet.has(c.id)).map((c) => c.image) || [];

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
    const cardIds = abilityCards?.filter((c) => activeDeck.includes(c.image)).map((c) => c.id) || [];

    const code = serializeBuild(character?.class, cardIds);
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
                onClick={() => {
                  if (showCharacterDetails) setShowCharacterDetails(false);
                  if (!isCraftingMode) toggleCraftingMode();
                }}
              >
                Build Mode
              </button>
              <button
                className={showCharacterDetails ? "btn-selected" : ""}
                onClick={() => setShowCharacterDetails(true)}
              >
                Character Details
              </button>
            </div>
          </div>
        </div>
      </div>
      <ClassFilter game={game} characterClass={character?.class} />
      {!spoilers.loading &&
        (showCharacterDetails ? (
          <CharacterDetails character={character} spoilers={spoilers} />
        ) : (
          <div style={{ paddingBottom: isCraftingMode ? "80px" : "0" }}>
            <CardList
              cardList={cardList}
              isCraftingMode={isCraftingMode}
              activeDeck={activeDeck}
              characterColour={character?.colour}
              onCardToggle={(image) => toggleCard(image, character?.class, maxHandSize)}
            />
          </div>
        ))}
      {additionalCards && !isCraftingMode && <AdditionalCards sections={additionalCards} />}

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
