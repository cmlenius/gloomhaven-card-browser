import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { petSearchResults } from "../../common/search-results";
import { getCharacterColor, getTitle, verifyQueryParam } from "../../common/utils";
import { GameParams, Pet } from "../../common/types";

import CardList from "../../components/CardList";
import Layout from "../../components/Layout";
import { petRoutes } from "../../data/routes";

type PageProps = {
  searchResults: Pet[];
};

const Pets = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const query = router.query;
  const game = verifyQueryParam(query.game, "gh");

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", getCharacterColor(null));
  }, []);
  const cardList = searchResults || [];

  return (
    <Layout title={getTitle(game, "Pets")}>
      <div className="toolbar"></div>
      <CardList cardList={cardList} defaultBack={true} />
    </Layout>
  );
};

export default Pets;

export const getStaticPaths: GetStaticPaths<GameParams> = async () => {
  return petRoutes;
};

export const getStaticProps: GetStaticProps<PageProps, GameParams> = async (context) => {
  const { game } = context.params;
  const searchResults = petSearchResults({
    game: game,
  });

  return {
    props: {
      searchResults,
    },
  };
};
