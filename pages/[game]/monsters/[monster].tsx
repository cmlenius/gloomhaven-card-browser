import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { monsterSearchResults } from "../../api/monsters";
import { getTitle, verifyQueryParam } from "../../../common/helpers";
import { Monster, Option } from "../../../common/types";
import Layout from "../../../components/Layout";
import MonstersPage from "../../../components/pages/MonstersPage";

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
  const { monster } = searchResults;

  return (
    <Layout title={getTitle(game, monster.name)}>
      <MonstersPage game={game} searchResults={searchResults} />
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
