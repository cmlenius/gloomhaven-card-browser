export const baseURL =
  "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-viewer/images/images/";
 
export const characterOptions = [
  { id: "BR", color: "#375E78", name: "Brute" },
  { id: "CH", color: "#575B29", name: "Cragheart" },
  { id: "MT", color: "#3C4A5C", name: "Mindthief" },
  { id: "SC", color: "#445326", name: "Scoundrel" },
  { id: "SW", color: "#5B4173", name: "Spellweaver" },
  { id: "TI", color: "#6D5C46", name: "Tinker" },
];

export const sortDirectionOptions = [
  { id: "asc", name: "Asc" },
  { id: "desc", name: "Desc" },
];

export const sortOrderOptions = [
  { id: "level", name: "Level" },
  { id: "initiative", name: "Initiative" },
  { id: "name", name: "Name" },
];

export function optionToLabel(id, options) {
  return options.find((option) => id == option.id)?.name || options[0].name;
}
