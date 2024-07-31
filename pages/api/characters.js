import { characterAbilityCards } from "../../data/character-ability-cards";
import { customSort } from "../../data/common";

export async function characterSearchResults(query) {
  let searchResults = characterAbilityCards;

  // Filter
  const className = query.class;
  searchResults = searchResults.filter((c) => c.class === className);

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
