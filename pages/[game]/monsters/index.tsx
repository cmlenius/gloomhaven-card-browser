import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { GameParams, MonsterSearch } from "../../../common/types";
import { getTitle, verifyQueryParam } from "../../../common/utils";
import Layout from "../../../components/Layout";
import MonstersPage, { monsterSearchResults } from "../../../components/pages/MonstersPage";
import { games } from "../../../data/games";

type PageProps = {
  searchResults: MonsterSearch;
};

const Monsters = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");

  return (
    <Layout title={getTitle(game, "Monsters")}>
      <MonstersPage game={game} searchResults={searchResults} />
    </Layout>
  );
};

export default Monsters;

export const getStaticPaths: GetStaticPaths<GameParams> = async () => {
  return {
    fallback: false,
    paths: games
      .filter((game) => game.routes.some((route) => route.id === "monsters"))
      .map((game) => ({
        params: {
          game: game.id,
        },
      })),
  };
};

export const getStaticProps: GetStaticProps<PageProps, GameParams> = async (context) => {
  const { game } = context.params!;
  const searchResults = monsterSearchResults({
    game: game,
  });

  return {
    props: {
      searchResults,
    },
  };
};
