import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

import { monsterSearchResults } from "../api/monsters";
import {
  getBaseUrl,
  getCharacterColor,
  verifyQueryParam,
} from "../../common/helpers";
import { Monster, Option } from "../../common/types";
import CardList from "../../components/CardList";
import Layout from "../../components/Layout";
import Dropdown from "../../components/Dropdown";

type MonsterStatCardProps = {
  images: string[];
  index: number;
  isVertical: boolean;
  handleIndexChange: () => void;
};

const MonsterStatCard = ({
  handleIndexChange,
  index,
  images,
  isVertical,
}: MonsterStatCardProps) => {
  const [rotation, setRotation] = useState(isVertical ? 0 : -90);

  const handleBtnClick = () => {
    if (isVertical) {
      setRotation(rotation - 180);
    } else {
      setRotation(rotation - 90);
    }
  };

  useEffect(() => {
    setRotation(isVertical ? 0 : -90);
  }, [images, isVertical]);

  const displayIndex = index * (isVertical ? 2 : 4);

  return (
    <div className="monster-stat-card">
      <div className="monster-img-outer">
        {images.map((img, idx) => (
          <img
            key={idx}
            className={`monster-img ${
              index === idx ? "monster-img-active" : ""
            }`}
            alt=""
            src={getBaseUrl() + img}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        ))}
      </div>
      <button className="card-index-btn" onClick={handleIndexChange}>
        {displayIndex}
      </button>
      <button className="card-flip-btn" onClick={handleBtnClick}>
        <FontAwesomeIcon
          className="card-flip-svg"
          icon={faRotateLeft}
          height="48px"
        />
      </button>
    </div>
  );
};

type MonsterSearch = {
  monster: Monster;
  monsterList: Option[];
};

type PageProps = {
  searchResults: MonsterSearch;
};

const Monsters = ({ searchResults }: PageProps) => {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const monsterSearch = verifyQueryParam(
    router.query.monster,
    searchResults.monsterList?.[0]?.name
  );
  const game = verifyQueryParam(router.query.game, "gh");
  const { monsterList, monster } = searchResults;

  const handleIndexChange = () => {
    setIndex((index + 1) % monster?.statCards?.length);
  };

  const handleMonsterChange = (newMonster: string) => {
    setIndex(0);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, monster: newMonster },
    });
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      getCharacterColor(null)
    );
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [game]);

  const cardList =
    monster?.abilityCards?.map((abilityImage) => ({
      name: "",
      image: abilityImage,
    })) || [];

  const horizontal = ![
    "manifestation-of-corruption",
    "enraged-vanquisher",
  ].includes(monster?.id);

  return (
    <Layout>
      <div className="toolbar">
        <div className="toolbar-inner">
          {monsterList && monsterList.length > 0 && (
            <Dropdown
              onChange={handleMonsterChange}
              options={searchResults.monsterList || []}
              value={monsterSearch}
            />
          )}
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {monster?.statCards && monster.statCards.length > 0 && (
          <MonsterStatCard
            handleIndexChange={handleIndexChange}
            index={index}
            images={monster?.statCards || []}
            isVertical={monster?.isVertical}
          />
        )}
        <CardList cardList={cardList} horizontal={horizontal} />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchResults = await monsterSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
};

export default Monsters;
