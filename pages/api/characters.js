import { characterAbilityCards } from "../../data/character-ability-cards";

export async function characterSearchResults(query) {
  let searchResults = characterAbilityCards;

  // Filter
  const className = query.class || "BR";
  searchResults = searchResults.filter((c) => c.class === className);

  // Sort
  const order = query.order || "level";
  const direction = query.dir || "asc";
  searchResults = searchResults.sort((a, b) => {
    let sort = 1;
    if (a[order] > b[order]) {
      sort = 1;
    } else if (a[order] < b[order]) {
      sort = -1;
    } else {
      return a.name > b.name ? 1 : -1;
    }
    return direction === "asc" ? sort : -1 * sort;
  });

  return searchResults;
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await characterSearchResults(query);
  res.status(200).json({ searchResults: searchResults });
}
