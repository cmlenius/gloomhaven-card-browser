import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { CharacterParams } from "../../common/types";
import { getCharacter, getTitle, verifyQueryParam } from "../../common/utils";
import Layout from "../../components/Layout";
import CharactersPage, { CharacterPageProps, characterSearchResults } from "../../components/pages/CharactersPage";
import { games } from "../../data/games";

const Characters = ({ searchResults }: CharacterPageProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const character = getCharacter(game, null);

  return (
    <Layout title={getTitle(game, "Card Browser")}>
      <CharactersPage character={character} game={game} searchResults={searchResults} />
    </Layout>
  );
};

export default Characters;

export const getStaticPaths: GetStaticPaths<CharacterParams> = async () => {
  return {
    fallback: false,
    paths: games.map((game) => ({
      params: {
        game: game.id,
        character: game.defaultClass,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<CharacterPageProps, CharacterParams> = async (context) => {
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
