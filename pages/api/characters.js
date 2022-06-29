import { characterAbilityCards } from "../../data/character-ability-cards";
import { customSort, defaultClass } from "../../data/utils";

export async function characterSearchResults(query) {
  let searchResults = characterAbilityCards;

  // Filter
  const game = query.game || "gh";
  searchResults = searchResults.filter((char) => char.game === game);

  const className = query.class || defaultClass(game);
  searchResults = searchResults.filter((char) => char.class === className);

  // Sort
  const order = query.order || "level";
  const direction = query.dir || "asc";
  searchResults = searchResults.sort(customSort(order, direction));

  return searchResults;
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await characterSearchResults(query);
  res.status(200).json({ searchResults: searchResults });
}
