import { characterAbilityCards } from "../../data/character-ability-cards";
import { itemCards } from "../../data/item-cards";
import { customSort } from "../../data/common";

const rowsPerPage = 30;

export async function search(query) {
  // Filter
  let searchResults = [
    ...(!query.type || query.type === "items" ? itemCards : []),
    ...(!query.type || query.type === "characters"
      ? characterAbilityCards
      : []),
  ];

  if (!query.search || query.search === "") {
    searchResults = [];
  } else {
    searchResults = searchResults.filter((sr) =>
      sr.name.toLowerCase().includes(query.search.toLowerCase())
    );
  }

  // Sort
  const order = query.order || "name";
  const direction = query.dir || "asc";
  searchResults = searchResults.sort(customSort(order, direction));

  return { searchResults: searchResults, maxPageCount: 1 };
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await search(query);
  res.status(200).json({ searchResults: searchResults });
}
