import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { CharacterAbility, CharacterParams } from "../../../common/types";
import {
  getCharacter,
  getDefaultCharacterClass,
  getDescription,
  getTitle,
  verifyQueryParam,
} from "../../../common/utils";
import Layout from "../../../components/Layout";
import CharactersPage, { characterSearchResults } from "../../../components/pages/CharactersPage";
import { characters } from "../../../data/characters";

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
  return {
    fallback: false,
    paths: characters.map((character) => ({
      params: {
        game: character.game,
        character: character.class,
      },
    })),
  };
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
