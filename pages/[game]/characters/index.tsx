import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { characterSearchResults } from "../../api/characters";
import {
  getCharacter,
  getDefaultCharacterClass,
  getTitle,
  verifyQueryParam,
} from "../../../common/helpers";
import { CharacterAbility } from "../../../common/types";
import CharactersPage from "../../../components/pages/CharactersPage";
import Layout from "../../../components/Layout";

type PageProps = {
  searchResults: CharacterAbility[];
};

const Characters = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const character = getCharacter(getDefaultCharacterClass(game));

  return (
    <Layout title={getTitle(game, "Characters")}>
      <CharactersPage
        character={character}
        game={game}
        searchResults={searchResults}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchResults = await characterSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
};

export default Characters;
