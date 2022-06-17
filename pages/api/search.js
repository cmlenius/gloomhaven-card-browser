import { characterAbilityCards } from "../../data/character-ability-cards";
import { itemCards } from "../../data/item-cards";
 
const rowsPerPage = 30;

export async function search(query) {
  let searchResults = [...characterAbilityCards, ...itemCards];

  // Filter
  searchResults = searchResults.filter((sr) => sr.name.includes(query.search));

  // Sort
  const order = query.order || "name";
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
  const maxPageCount = Math.ceil(searchResults.length / rowsPerPage);
  const page = parseInt(query.page) || 1;
  searchResults = searchResults.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return { searchResults: searchResults, maxPageCount: maxPageCount };
}

export default async function handler(req, res) {
  const { query } = req;
  const searchResults = await search(query);
  res.status(200).json({ searchResults: searchResults });
}
