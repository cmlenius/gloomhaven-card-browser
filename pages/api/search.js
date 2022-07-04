import { characterAbilityCards } from "../../data/character-ability-cards";
import { itemCards } from "../../data/item-cards";
import { customSort } from "../../data/utils";

export async function search(query) {
  const search = query.search?.toLowerCase() || "";
  const game = query.game || "gh";

  if (search === "") return { searchResults: [] };

  // Filter
  let searchResults = [
    ...(!query.type || query.type === "characters"
      ? characterAbilityCards
      : []),
    ...(!query.type || query.type === "items" ? itemCards : []),
  ];
  searchResults = searchResults.filter(
    (card) => card.game === game && card.name.includes(search)
  );

  // Sort
  searchResults = searchResults.sort(customSort("name", "asc"));

  return searchResults;
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await search(query);
  res.status(200).json(searchResults);
}
