import { itemCards } from "../../data/item-cards";
import { customSort } from "../../data/common";

const rowsPerPage = 30;

export async function itemSearchResults(query) {
  let searchResults = itemCards;

  // Filter
  const slot = query.slot;
  if (slot) {
    searchResults = searchResults.filter((i) => i.slot === slot);
  }
  if (query.activations === "consumed") {
    searchResults = searchResults.filter((i) => i.consumed);
  } else if (query.activations === "spent") {
    searchResults = searchResults.filter((i) => i.spent);
  }

  // Sort
  const order = query.order || "id";
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
  const searchResults = await itemSearchResults(query);
  res.status(200).json({ searchResults: searchResults });
}