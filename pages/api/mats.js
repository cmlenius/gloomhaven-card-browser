import { characterMats } from "../../data/character-mats";
import { customSort } from "../../data/common";

export async function matsSearchResults(query) {
  let searchResults = characterMats;

  // Filter
  searchResults = searchResults.filter(
    (m) => m.expansion === "gh" || m.expansion === "fc"
  );

  // Sort
  const order = query.order || "name";
  const direction = query.dir || "asc";
  searchResults = searchResults.sort(customSort(order, direction));

  return searchResults;
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await matsSearchResults(query);
  res.status(200).json({ searchResults: searchResults });
}
