import { useEffect } from "react";

import { matsSearchResults } from "./api/mats";
import { useSpoilers } from "../hooks/useSpoilers";
import { baseCharacters, colour } from "../data/common";

import CardList from "../components/CardList";
import Layout from "../components/Layout";
import Toolbar from "../components/Toolbar";

const sortOrderOptions = [
  { id: "name", name: "Name" },
  { id: "health", name: "Health" },
  { id: "cards", name: "Cards" },
];

function Mats({ searchResults }) {
  const { spoilers } = useSpoilers();

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colour(null));
  }, []);

  const cardList = searchResults?.filter(
    (mat) =>
      baseCharacters.includes(mat.class) || spoilers.characters?.has(mat.class)
  );

  return (
    <Layout>
      <Toolbar pathname="/mats" sortOrderOptions={sortOrderOptions} />
      <CardList isSingleColumn cardList={cardList || []} />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const searchResults = await matsSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
}

export default Mats;
