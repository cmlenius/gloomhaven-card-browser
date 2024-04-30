import { GetStaticProps } from "next";
import { useRouter } from "next/router";

import { CharacterAbility, CharacterParams } from "../common/types";
import { getCharacter, getDefaultCharacterClass, verifyQueryParam } from "../common/utils";
import Layout from "../components/Layout";
import CharactersPage from "../components/pages/CharactersPage";
import { characterSearchResults } from "../common/search-results";

type PageProps = {
  searchResults: CharacterAbility[];
};

const Characters = ({ searchResults }: PageProps) => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const character = getCharacter(game, getDefaultCharacterClass(game));

  return (
    <Layout title="Gloomhaven Card Browser">
      <CharactersPage character={character} game={game} searchResults={searchResults} />
    </Layout>
  );
};

export default Characters;

export const getStaticProps: GetStaticProps<PageProps, CharacterParams> = async () => {
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
