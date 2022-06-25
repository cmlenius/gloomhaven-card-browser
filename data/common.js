export const baseUrl =
  "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-viewer/images/";

const ghCharacters = [
  { id: "BR", colour: "#335970", base: true, name: "Brute" },
  { id: "CH", colour: "#656A33", base: true, name: "Cragheart" },
  { id: "MT", colour: "#374458", base: true, name: "Mindthief" },
  { id: "SC", colour: "#415021", base: true, name: "Scoundrel" },
  { id: "SW", colour: "#583D72", base: true, name: "Spellweaver" },
  { id: "TI", colour: "#6C5A45", base: true, name: "Tinker" },
  {
    id: "BE",
    colour: "#71382F",
    name: "Berserker",
    altName: "Lightning Bolts",
  },
  { id: "BT", colour: "#634031", name: "Beast Tyrant", altName: "Two Minis" },
  { id: "DS", colour: "#3D7584", name: "Doomstalker", altName: "Angry Face" },
  { id: "EL", colour: "#474747", name: "Elementalist", altName: "Triangles" },
  { id: "NS", colour: "#49475F", name: "Nightshroud", altName: "Eclipse" },
  { id: "PH", colour: "#31514E", name: "Plagueherald", altName: "Cthulhu" },
  {
    id: "QM",
    colour: "#815527",
    name: "Quartermaster",
    altName: "Three Spears",
  },
  { id: "SB", colour: "#3E3E3E", name: "Sawbones", altName: "Saw" },
  { id: "SK", colour: "#7E6C34", name: "Sunkeeper", altName: "Sun" },
  { id: "SS", colour: "#75524E", name: "Soothsinger", altName: "Music Note" },
  { id: "SU", colour: "#713B5C", name: "Summoner", altName: "Circles" },
  {
    id: "BS",
    colour: "#403129",
    hidden: true,
    name: "Bladeswarm",
    altName: "???",
  },

  // Forgotten Circles
  { id: "DR", colour: "#555683", name: "Diviner", altName: "Diviner" },
];

const joltCharacters = [
  { id: "DE", colour: "#8A431D", base: true, name: "Demolitionist" },
  { id: "HA", colour: "#224564", base: true, name: "Hachet" },
  { id: "RG", colour: "#7B201B", base: true, name: "Red Guard" },
  { id: "VW", colour: "#5F5D5E", base: true, name: "Void Warden" },
];

const csCharacters = [
  { id: "AA", colour: "#A77037", name: "Amber Aegis" },
  { id: "BK", colour: "#AF8F42", name: "Brightspark" },
  { id: "BM", colour: "#725C3F", name: "Bombard" },
  { id: "CG", colour: "#1C1919", name: "Chainguard" },
  { id: "CT", colour: "#5F8A87", name: "Chieftain" },
  { id: "FK", colour: "#97452B", name: "Fire Knight" },
  { id: "HO", colour: "#8B5E90", name: "Hollowpact" },
  { id: "HP", colour: "#8C8A79", name: "Hierophant" },
  { id: "LU", colour: "#53378B", name: "Luminary" },
  { id: "MF", colour: "#334123", name: "Mirefoot" },
  { id: "QA", colour: "#739097", name: "Artificier" },
  { id: "RM", colour: "#8D2B27", name: "Ruinmaw" },
  { id: "SP", colour: "#4F7F45", name: "Spirit Caller" },
  { id: "ST", colour: "#384070", name: "Starslinger" },
];

export const allChars = [...ghCharacters, ...joltCharacters, ...csCharacters];

export function characterClasses(game) {
  switch (game) {
    case "jotl":
      return joltCharacters;
    case "cs":
      return csCharacters;
    default:
      return ghCharacters;
  }
}

export const baseCharacters = allChars.filter((c) => c.base).map((c) => c.id);
export const hiddenCharacters = allChars
  .filter((c) => c.hidden)
  .map((c) => c.id);

export function colour(char) {
  const defaultColour = "#432423";

  if (!char) return defaultColour;
  return allChars.find((c) => c.id === char)?.colour || defaultColour;
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
