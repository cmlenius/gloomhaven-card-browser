//export const baseUrl =
//  "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-viewer/images/images/";
export const baseUrl = "http://localhost:8000/"

export const defaultColour = "#432423";
export const cardsPerPage = 8;

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

export const characters = [
  { id: "BR", colour: "#335970", base: true, name: "Brute" },
  { id: "CH", colour: "#656A33", base: true, name: "Cragheart" },
  { id: "MT", colour: "#374458", base: true, name: "Mindthief" },
  { id: "SC", colour: "#415021", base: true, name: "Scoundrel" },
  { id: "SW", colour: "#583D72", base: true, name: "Spellweaver" },
  { id: "TI", colour: "#6C5A45", base: true, name: "Tinker" },
  { id: "BE", colour: "#71382F", name: "Lightning Bolts" },
  { id: "BT", colour: "#634031", name: "Two Minis" },
  { id: "DS", colour: "#3D7584", name: "Angry Face" },
  { id: "EL", colour: "#474747", name: "Triangles" },
  { id: "NS", colour: "#49475F", name: "Eclipse" },
  { id: "PH", colour: "#31514E", name: "Cthulhu" },
  { id: "QM", colour: "#815527", name: "Three Spears" },
  { id: "SB", colour: "#3E3E3E", name: "Saw" },
  { id: "SK", colour: "#7E6C34", name: "Sun" },
  { id: "SS", colour: "#75524E", name: "Music Note" },
  { id: "SU", colour: "#713B5C", name: "Circles" },
  { id: "BS", colour: "#403129", hidden: true, name: "???" },
];

export const characterClasses = characters
  .filter((c) => !c.hidden)
  .map((c) => c.id);
export const baseCharacters = characters.filter((c) => c.base).map((c) => c.id);
export const hiddenCharacters = characters.filter((c) => c.hidden).map((c) => c.id);


export function colour(char) {
  if (!char) return defaultColour;
  return characters.find((c) => c.id === char)?.colour || defaultColour;
}
