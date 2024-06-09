import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { buildingSearchResults } from "../../common/search-results";
import { buildingSpoilerFilter, customSort, getCharacterColor, getTitle, verifyQueryParam } from "../../common/utils";
import { GameParams, Building, Option } from "../../common/types";

import { MultiLevelCardList } from "../../components/CardList";
import Layout from "../../components/Layout";
import { buildingRoutes } from "../../common/routes";
import { useSpoilers } from "../../hooks/useSpoilers";
import Sort from "../../components/Sort";

const sortOrderOptions: Option[] = [
  { id: "id", name: "Building Number" },
  { id: "name", name: "Name" },
];

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
    document.documentElement.style.setProperty("--primary", getCharacterColor(null));
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
  return buildingRoutes;
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
