import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import {
  getCharacter,
  getDefaultCharacterClass,
  getDescription,
  getTitle,
  verifyQueryParam,
} from "../../../common/helpers";
import { CharacterAbility } from "../../../common/types";
import { characterSearchResults } from "../../api/characters";
import CharactersPage from "../../../components/pages/CharactersPage";
import Layout from "../../../components/Layout";

type PageProps = {
  searchResults: CharacterAbility[];
};

const Characters = ({ searchResults }: PageProps) => {
  const router = useRouter();

  const game = verifyQueryParam(router.query.game, "gh");
  const characterClass = verifyQueryParam(
    router.query.character,
    getDefaultCharacterClass(game)
  );

  const character = getCharacter(game, characterClass.toUpperCase());
  const name = character?.altName || character?.name || "Character";

  return (
    <Layout
      description={getDescription(
        game,
        "Character Ability Cards",
        searchResults
      )}
      title={getTitle(game, name + " Class")}
    >
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
