import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { MonsterParams, MonsterSearch } from "../../../common/types";
import { getTitle, verifyQueryParam } from "../../../common/utils";
import Layout from "../../../components/Layout";
import MonstersPage, { monsterSearchResults } from "../../../components/pages/MonstersPage";
import { monsterCards } from "../../../data/monster-cards";

type PageProps = {
  searchResults: MonsterSearch;
};

const Monsters = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const { monster } = searchResults;

  return (
    <Layout title={getTitle(game, monster?.name)}>
      <MonstersPage game={game} searchResults={searchResults} />
    </Layout>
  );
};

export default Monsters;

export const getStaticPaths: GetStaticPaths<MonsterParams> = async () => {
  return {
    fallback: false,
    paths: Object.values(monsterCards)
      .flat()
      .map((monster) => ({
        params: {
          game: monster?.game,
          monster: monster?.id,
        },
      })),
  };
};

export const getStaticProps: GetStaticProps<PageProps, MonsterParams> = async (context) => {
  const { game, monster } = context.params;
  const searchResults = monsterSearchResults({
    game: game,
    monster: monster,
  });

  return {
    props: {
      searchResults,
    },
  };
};
