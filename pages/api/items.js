import { itemCards } from "../../data/item-cards";
import { customSort, nameSearchFilter } from "../../data/utils";

export async function itemSearchResults(query) {
  let searchResults = itemCards;

  // Filter
  const game = query.game || "gh";
  const slot = query.slot;
  searchResults = searchResults.filter((item) => {
    if (item.game !== game) return false;
    if (slot && item.slot !== slot) return false;
    if (query.activations === "consumed" && !item.consumed) return false;
    if (query.activations === "spent" && !item.spent) return false;
    return true;
  });

  const searchFilter = query.searchFilter;
  if (searchFilter) {
    searchResults = searchResults.filter(nameSearchFilter(searchFilter));
  }

  // Sort
  const order = query.order || "id";
  const direction = query.dir || "asc";
  searchResults = searchResults.sort(customSort(order, direction));

  return searchResults;
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await itemSearchResults(query);
  res.status(200).json({ searchResults: searchResults });
}
