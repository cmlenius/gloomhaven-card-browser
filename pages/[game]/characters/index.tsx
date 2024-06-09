import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { characterSearchResults } from "../../../common/search-results";
import { CharacterAbility, CharacterParams } from "../../../common/types";
import { getCharacter, getDefaultCharacterClass, getTitle, verifyQueryParam } from "../../../common/utils";
import Layout from "../../../components/Layout";
import CharactersPage from "../../../components/pages/CharactersPage";
import { characterGameRoutes } from "../../../common/routes";

type PageProps = {
  searchResults: CharacterAbility[];
};

const Characters = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const character = getCharacter(game, getDefaultCharacterClass(game));

  return (
    <Layout title={getTitle(game, "Characters")}>
      <CharactersPage character={character} game={game} searchResults={searchResults} />
    </Layout>
  );
};

export default Characters;

export const getStaticPaths: GetStaticPaths<CharacterParams> = async () => {
  return characterGameRoutes;
};

export const getStaticProps: GetStaticProps<PageProps, CharacterParams> = async (context) => {
  const { game, character } = context.params;
  const searchResults = characterSearchResults({
    game: game,
    character: character,
  });

  return {
    props: {
      searchResults,
    },
  };
};
