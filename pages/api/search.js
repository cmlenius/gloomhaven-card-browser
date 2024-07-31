import { characterAbilityCards } from "../../data/character-ability-cards";
import { characterMats } from "../../data/character-mats";
import { itemCards } from "../../data/item-cards";
import { customSort } from "../../data/common";

export async function search(query) {
  let search = query.search?.toLowerCase() || "";

  // Check if character match
  const characterMat = characterMats.find(
    (m) => m.name.toLowerCase() === search
  );
  if (characterMat) return { searchResults: [characterMat], isMat: true };

  // Filter
  let searchResults = [
    ...(!query.type || query.type === "characters"
      ? characterAbilityCards
      : []),
    ...(!query.type || query.type === "items" ? itemCards : []),
  ];

  searchResults = searchResults.map((sr) => ({
    ...sr,
    name: sr.name.toLowerCase(),
  }));

  if (!search || search === "") {
    searchResults = [];
  } else {
    searchResults = searchResults.filter((sr) =>
      sr.name.includes(search.toLowerCase())
    );
  }

  // Sort
  searchResults = searchResults.sort(customSort("name", "asc"));

  return { searchResults: searchResults, isMat: false };
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await search(query);
  res.status(200).json({ searchResults: searchResults });
}
