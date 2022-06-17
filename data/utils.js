export const baseUrl =
  "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-viewer/images/images/";

export const sortDirectionOptions = [
  { id: "asc", name: "Asc" },
  { id: "desc", name: "Desc" },
];

export function optionToLabel(id, options) {
  return options.find((option) => id == option.id)?.name || options[0].name;
}

export const colours = {
  BR: "#375E78",
  CH: "#575B29",
  MT: "#3C4A5C",
  SC: "#445326",
  SW: "#5B4173",
  TI: "#6D5C46",
};
