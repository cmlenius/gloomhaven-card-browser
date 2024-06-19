import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Building, GameParams, Option, Spoilers } from "../../common/types";
import { customSort, getPageColor, getTitle, verifyQueryParam } from "../../common/utils";

import { MultiLevelCardList } from "../../components/CardList";
import Layout from "../../components/Layout";
import Sort from "../../components/Sort";
import { buildingCards } from "../../data/building-cards";
import { games } from "../../data/games";
import { useSpoilers } from "../../hooks/useSpoilers";

const sortOrderOptions: Option[] = [
  { id: "id", name: "Building Number" },
  { id: "name", name: "Name" },
];

const buildingSpoilerFilter = (spoilers: Spoilers): ((building: Building) => boolean) => {
  return (building) => spoilers.buildings?.has(building.id.toString());
};

type PageProps = {
  searchResults: Building[];
};

const Buildings = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const query = router.query;
  const game = verifyQueryParam(query.game, "gh");
  const { spoilers } = useSpoilers();
  const [sortOrder, setsortOrder] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSortOrderChange = (newValue: string) => {
    setsortOrder(newValue);
  };
  const handleSortDirectionChange = (newValue: string) => {
    setSortDirection(newValue);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", getPageColor(null));
  }, []);
  const cardList =
    searchResults
      ?.filter(buildingSpoilerFilter(spoilers))
      .sort(customSort(sortOrder || "id", sortDirection || "asc")) || [];

  return (
    <Layout title={getTitle(game, "Buildings")}>
      <div className="toolbar">
        <div className="toolbar-inner">
          <Sort
            sortOrderOptions={sortOrderOptions}
            handleSortOrderChange={handleSortOrderChange}
            handleSortDirectionChange={handleSortDirectionChange}
            sortOrder={sortOrder}
            sortDirection={sortDirection}
          />
        </div>
      </div>
      <MultiLevelCardList cardList={cardList} />
    </Layout>
  );
};

export default Buildings;

export const getStaticPaths: GetStaticPaths<GameParams> = async () => {
  return {
    fallback: false,
    paths: games.map((game) => ({
      params: {
        game: game.id,
      },
    })),
  };
};

const buildingSearchResults = (query: { [key: string]: string | string[] }) => {
  const game = verifyQueryParam(query.game, "gh");
  return buildingCards[game]?.sort(customSort("id", "asc")) || [];
};

export const getStaticProps: GetStaticProps<PageProps, GameParams> = async (context) => {
  const { game } = context.params;
  const searchResults = buildingSearchResults({
    game: game,
  });

  return {
    props: {
      searchResults,
    },
  };
};
