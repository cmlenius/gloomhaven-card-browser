import { useCallback, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";

import { useSpoilers } from "../../../hooks/useSpoilers";
import {
  characterSpoilerFilter,
  getBaseUrl,
  getCharacter,
  getCharacterClasses,
  getDefaultCharacterClass,
  getTitle,
  verifyQueryParam,
} from "../../../common/helpers";
import { CharacterAbility, Option } from "../../../common/types";
import { characterSearchResults } from "../../api/characters";
import CardList from "../../../components/CardList";
import Layout from "../../../components/Layout";
import Modal from "../../../components/Modal";
import Sort from "../../../components/Sort";

const sortOrderOptions: Option[] = [
  { id: "level", name: "Level" },
  { id: "initiative", name: "Initiative" },
  { id: "name", name: "Name" },
];

type MilestoneFilterProps = {
  handleMilestoneChange: () => void;
  showMilestone: boolean;
};

const MilestoneFilter = ({
  handleMilestoneChange,
  showMilestone,
}: MilestoneFilterProps) => {
  return (
    <div className="milestone-filter" onClick={handleMilestoneChange}>
      <input checked={showMilestone} readOnly type="checkbox" />
      <span>Milestone</span>
    </div>
  );
};

type ClassFilterProps = {
  characterClass: string;
  game: string;
};

const ClassFilter = ({ characterClass, game }: ClassFilterProps) => {
  return (
    <div className="filters">
      {getCharacterClasses(game)
        .filter((c) => !c.hidden)
        .map((char) => (
          <Link key={char.class} href={`/${game}/characters/${char.class}`}>
            <a
              className={`filter-icon ${
                characterClass === char.class ? "filter-icon-selected" : ""
              }`}
            >
              <img
                alt=""
                src={
                  getBaseUrl() + `icons/characters/${game}/${char.class}.png`
                }
              />
            </a>
          </Link>
        ))}
    </div>
  );
};

type PageProps = {
  searchResults: CharacterAbility[];
};

const Characters = ({ searchResults }: PageProps) => {
  const { spoilers, updateSpoilers } = useSpoilers();
  const [modalContent, setModalContent] = useState(null);
  const [showMilestone, setShowMilestone] = useState(false);
  const router = useRouter();

  const game = verifyQueryParam(router.query.game, "gh");
  const characterClass = verifyQueryParam(
    router.query.character,
    getDefaultCharacterClass(game)
  );

  const closeModal = useCallback(
    () => setModalContent(null),
    [setModalContent]
  );

  const updateLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value);
    if (!newLevel || newLevel < 1 || newLevel > 9) return;

    updateSpoilers({ ...spoilers, level: newLevel });
  };

  const handleMilestoneChange = () => {
    setShowMilestone(!showMilestone);
  };

  const character = getCharacter(characterClass);
  let cardList = searchResults?.filter(characterSpoilerFilter(spoilers));
  if (!showMilestone) cardList = cardList.filter((c) => !c.milestone);

  useEffect(() => {
    if (character)
      document.documentElement.style.setProperty("--primary", character.colour);
  }, [character]);

  return (
    <Layout title={getTitle(game, character.altName || character.name)}>
      <div className="toolbar">
        <div className="toolbar-inner">
          <div>
            <div className="flex">
              <Sort sortOrderOptions={sortOrderOptions} />
              {["cs", "toa"].includes(game) && (
                <span className="milestone-filter-desktop">
                  <MilestoneFilter
                    handleMilestoneChange={handleMilestoneChange}
                    showMilestone={showMilestone}
                  />
                </span>
              )}
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
          {["cs", "toa"].includes(game) && (
            <div className="milestone-filter-mobile">
              <MilestoneFilter
                handleMilestoneChange={handleMilestoneChange}
                showMilestone={showMilestone}
              />
            </div>
          )}
          <div>
            <div className="button-group">
              <button onClick={() => setModalContent(character.matImage)}>
                Character Mat
              </button>
              <button onClick={() => setModalContent(character.sheetImage)}>
                Character Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
      <ClassFilter game={game} characterClass={characterClass} />
      {!spoilers.loading && <CardList cardList={cardList} />}
      {modalContent && (
        <Modal
          content={<img alt="" src={getBaseUrl() + modalContent} />}
          open={!!modalContent}
          onClose={closeModal}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchResults = await characterSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
};

export default Characters;
