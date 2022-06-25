export const baseUrl =
  "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-viewer/images/images/";

export const characters = [
  { id: "BR", colour: "#335970", base: true, name: "Brute" },
  { id: "CH", colour: "#656A33", base: true, name: "Cragheart" },
  { id: "MT", colour: "#374458", base: true, name: "Mindthief" },
  { id: "SC", colour: "#415021", base: true, name: "Scoundrel" },
  { id: "SW", colour: "#583D72", base: true, name: "Spellweaver" },
  { id: "TI", colour: "#6C5A45", base: true, name: "Tinker" },
  { id: "BE", colour: "#71382F", name: "Berserker", altName: "Lightning Bolts" },
  { id: "BT", colour: "#634031", name: "Beast Tyrant", altName: "Two Minis" },
  { id: "DS", colour: "#3D7584", name: "Doomstalker", altName: "Angry Face" },
  { id: "EL", colour: "#474747", name: "Elementalist", altName: "Triangles" },
  { id: "NS", colour: "#49475F", name: "Nightshroud", altName: "Eclipse" },
  { id: "PH", colour: "#31514E", name: "Plagueherald", altName: "Cthulhu" },
  { id: "QM", colour: "#815527", name: "Quartermaster", altName: "Three Spears" },
  { id: "SB", colour: "#3E3E3E", name: "Sawbones", altName: "Saw" },
  { id: "SK", colour: "#7E6C34", name: "Sunkeeper", altName: "Sun" },
  { id: "SS", colour: "#75524E", name: "Soothsinger", altName: "Music Note" },
  { id: "SU", colour: "#713B5C", name: "Summoner", altName: "Circles" },
  { id: "BS", colour: "#403129", hidden: true, name: "Bladeswarm", altName: "???" },

  // Forgotten Circles
  { id: "DR", colour: "#555683", name: "Diviner", altName: "Diviner" },
];

export const characterClasses = characters
  .filter((c) => !c.hidden)
  .map((c) => c.id);
export const baseCharacters = characters.filter((c) => c.base).map((c) => c.id);
export const hiddenCharacters = characters
  .filter((c) => c.hidden)
  .map((c) => c.id);

export function colour(char) {
  const defaultColour = "#432423";

  if (!char) return defaultColour;
  return characters.find((c) => c.id === char)?.colour || defaultColour;
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
