import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { CharacterAbility, CharacterParams } from "../../../common/types";
import { getCharacter, getTitle, verifyQueryParam } from "../../../common/utils";
import Layout from "../../../components/Layout";
import CharactersPage, { characterSearchResults } from "../../../components/pages/CharactersPage";
import { games } from "../../../data/games";

type PageProps = {
  searchResults: CharacterAbility[];
};

const Characters = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const character = getCharacter(game, null);

  return (
    <Layout title={getTitle(game, "Characters")}>
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
