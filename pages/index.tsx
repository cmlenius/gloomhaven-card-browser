import { GetStaticProps } from "next";
import { useRouter } from "next/router";

import { CharacterParams } from "../common/types";
import { getCharacter, verifyQueryParam } from "../common/utils";
import Layout from "../components/Layout";
import CharactersPage, { CharacterPageProps, characterSearchResults } from "../components/pages/CharactersPage";

const Characters = ({ searchResults }: CharacterPageProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const character = getCharacter(game, null);

  return (
    <Layout title="Gloomhaven Card Browser">
      <CharactersPage character={character} game={game} searchResults={searchResults} />
    </Layout>
  );
};

export default Characters;

export const getStaticProps: GetStaticProps<CharacterPageProps, CharacterParams> = async () => {
  const searchResults = characterSearchResults({
    game: "gh",
    character: "BR",
  });

  return {
    props: {
      searchResults,
    },
  };
};
