import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { GameParams, Pet } from "../../common/types";
import { customSort, getPageColor, getTitle, verifyQueryParam } from "../../common/utils";

import CardList from "../../components/CardList";
import Layout from "../../components/Layout";
import { games } from "../../data/games";
import { petCards } from "../../data/pet-cards";

type PageProps = {
  searchResults: Pet[];
};

const Pets = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const query = router.query;
  const game = verifyQueryParam(query.game, "gh");

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", getPageColor(null));
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
  return {
    fallback: false,
    paths: games.map((game) => ({
      params: {
        game: game.id,
      },
    })),
  };
};

const petSearchResults = (query: { [key: string]: string | string[] }) => {
  const game = verifyQueryParam(query.game, "gh");
  return petCards[game]?.sort(customSort("id", "asc")) || [];
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
