import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { monsterSearchResults } from "../../../common/search-results";
import { MonsterParams, MonsterSearch } from "../../../common/types";
import { getTitle, verifyQueryParam } from "../../../common/utils";
import Layout from "../../../components/Layout";
import MonstersPage from "../../../components/pages/MonstersPage";
import { monsterRoutes } from "../../../common/routes";

type PageProps = {
  searchResults: MonsterSearch;
};

const Monsters = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const { monster } = searchResults;

  return (
    <Layout title={getTitle(game, monster.name)}>
      <MonstersPage game={game} searchResults={searchResults} />
    </Layout>
  );
};

export default Monsters;

export const getStaticPaths: GetStaticPaths<MonsterParams> = async () => {
  return monsterRoutes;
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
