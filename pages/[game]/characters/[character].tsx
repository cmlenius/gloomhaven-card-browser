import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { characterSearchResults } from "../../../common/search-results";
import { CharacterAbility, CharacterParams } from "../../../common/types";
import {
  getCharacter,
  getDefaultCharacterClass,
  getDescription,
  getTitle,
  verifyQueryParam,
} from "../../../common/utils";
import Layout from "../../../components/Layout";
import CharactersPage from "../../../components/pages/CharactersPage";
import { characterRoutes } from "../../../data/routes";

type PageProps = {
  searchResults: CharacterAbility[];
};

const Characters = ({ searchResults }: PageProps) => {
  const router = useRouter();

  const game = verifyQueryParam(router.query.game, "gh");
  const characterClass = verifyQueryParam(router.query.character, getDefaultCharacterClass(game));

  const character = getCharacter(game, characterClass.toUpperCase());
  const name = character?.altName || character?.name || "Character";

  return (
    <Layout
      description={getDescription(game, "Character Ability Cards", searchResults)}
      title={getTitle(game, name + " Class")}
    >
      <CharactersPage character={character} game={game} searchResults={searchResults} />
    </Layout>
  );
};
export default Characters;

export const getStaticPaths: GetStaticPaths<CharacterParams> = async () => {
  return characterRoutes;
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
