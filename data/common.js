export const baseUrl =
  "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-viewer/images/images/";
//export const baseUrl = "http://localhost:8000/";
const defaultColour = "#432423";

export const sortDirectionOptions = [
  { id: "asc", name: "Asc" },
  { id: "desc", name: "Desc" },
];

export function optionToLabel(id, options) {
  return options.find((option) => id == option.id)?.name || options[0].name;
}

export function customSort(order, direction) {
  return (a, b) => {
    let sort = 1;
    if (a[order] > b[order]) {
      sort = 1;
    } else if (a[order] < b[order]) {
      sort = -1;
    } else {
      return a.name > b.name ? 1 : -1;
    }
    return direction === "asc" ? sort : -1 * sort;
  };
}

export const characterOptions = [
  { id: "BR", colour: "#375E78", name: "Brute" },
  { id: "CH", colour: "#575B29", name: "Cragheart" },
  { id: "MT", colour: "#3C4A5C", name: "Mindthief" },
  { id: "SC", colour: "#445326", name: "Scoundrel" },
  { id: "SW", colour: "#5B4173", name: "Spellweaver" },
  { id: "TI", colour: "#6D5C46", name: "Tinker" },
];

export const characters = characterOptions.map((c) => c.id);

export function colour(char) {
  if (!char) return defaultColour;
  return characterOptions.find((c) => c.id === char)?.colour || defaultColour;
}
