import { characterAbilityCards } from "../../data/character-ability-cards";
import { itemCards } from "../../data/item-cards";
import { customSort } from "../../data/common";

const rowsPerPage = 30;

export async function search(query) {
  let searchResults = [
    ...(!query.type || query.type === "items" ? itemCards : []),
    ...(!query.type || query.type === "characters"
      ? characterAbilityCards
      : []),
  ];

  // Filter
  if (!query.search || query.search === "") {
    searchResults = [];
  } else {
    searchResults = searchResults.filter((sr) =>
      sr.name.includes(query.search)
    );
  }

  // Sort
  const order = query.order || "name";
  const direction = query.dir || "asc";
  searchResults = searchResults.sort(customSort(order, direction));

  // Pagination
  const maxPageCount = Math.ceil(searchResults.length / rowsPerPage);
  const page = parseInt(query.page) || 1;
  searchResults = searchResults.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return { searchResults: searchResults, maxPageCount: maxPageCount };
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await search(query);
  res.status(200).json({ searchResults: searchResults });
}
