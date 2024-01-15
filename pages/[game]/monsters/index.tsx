import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { monsterSearchResults } from "../../../common/search-results";
import { Monster, MonsterParams, Option } from "../../../common/types";
import { getTitle, verifyQueryParam } from "../../../common/utils";
import Layout from "../../../components/Layout";
import MonstersPage from "../../../components/pages/MonstersPage";
import { monsterGameRoutes } from "../../../data/routes";

type MonsterSearch = {
  monster: Monster;
  monsterList: Option[];
};

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

export const getStaticPaths: GetStaticPaths<MonsterParams> = async () => {
  return monsterGameRoutes;
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
