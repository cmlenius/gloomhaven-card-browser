import { itemCards } from "../../data/item-cards";

export async function itemSearchResults(query) {
  let searchResults = itemCards;

  // Filter
  const slots = new Set(query.slots || []);
  if (slots.size > 0) {
    searchResults = searchResults.filter((i) => slots.has(i.slot));
  }
  if (query.activations === "consumed") {
    searchResults = searchResults.filter((i) => i.consumed);
  } else if (query.activations === "spent") {
    searchResults = searchResults.filter((i) => i.spent);
  }

  // Sort
  const order = query.order || "id";
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

  // Pagination
  searchResults = searchResults.slice(query.page * 30, (1 + query.page) * 30);

  return searchResults;
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await itemSearchResults(query);
  res.status(200).json({ searchResults: searchResults });
}
