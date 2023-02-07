import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

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
      setRotation(rotation + 180);
    } else {
      setRotation(rotation + 90);
    }
  };

  useEffect(() => {
    setRotation(isVertical ? 0 : -90);
  }, [images, isVertical]);

  return (
    <div className="monster-stat-card">
      <img
        className="monster-img"
        alt=""
        src={getBaseUrl() + images[index]}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <button className="card-index-btn" onClick={handleIndexChange}>
        {index + 1}
      </button>
      <button className="card-flip-btn" onClick={handleBtnClick}>
        <FontAwesomeIcon
          className="card-flip-svg"
          icon={faRotateRight}
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
  const monster = verifyQueryParam(
    router.query.monster,
    searchResults.monsterList[0]?.name
  );
  const game = verifyQueryParam(router.query.game, "gh");

  const handleIndexChange = () => {
    setIndex((index + 1) % searchResults.monster?.statCards?.length);
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
    searchResults?.monster?.abilityCards?.map((abilityImage) => ({
      name: "",
      image: abilityImage,
    })) || [];

  return (
    <Layout>
      <div className="toolbar">
        <div className="toolbar-inner">
          <Dropdown
            onChange={handleMonsterChange}
            options={searchResults.monsterList || []}
            value={monster}
          />
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
        <MonsterStatCard
          handleIndexChange={handleIndexChange}
          index={index}
          images={searchResults.monster?.statCards || []}
          isVertical={searchResults.monster?.isVertical}
        />
        <CardList cardList={cardList} horizontal />
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
