import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { GameParams } from "../../../common/types";
import { getCharacter, getTitle, verifyQueryParam } from "../../../common/utils";
import Layout from "../../../components/Layout";
import CharactersPage, { CharacterPageProps, characterSearchResults } from "../../../components/pages/CharactersPage";
import { games } from "../../../data/games";

const Characters = ({ searchResults }: CharacterPageProps) => {
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

export const getStaticPaths: GetStaticPaths<GameParams> = async () => {
  return {
    fallback: false,
    paths: games
      .filter((game) => game.routes.some((route) => route.id === "characters"))
      .map((game) => ({
        params: {
          game: game.id,
        },
      })),
  };
};

export const getStaticProps: GetStaticProps<CharacterPageProps, GameParams> = async (context) => {
  const { game } = context.params!;
  const searchResults = characterSearchResults({
    game: game,
  });

  return {
    props: {
      searchResults,
    },
  };
};
