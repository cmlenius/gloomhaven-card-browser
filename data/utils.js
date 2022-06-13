export const baseUrl =
  "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-viewer/images/images/items/gloomhaven/";

export const sortDirectionOptions = [
  { id: "asc", name: "Asc" },
  { id: "desc", name: "Desc" },
];

export function optionToLabel(id, options) {
  return options.find((option) => id == option.id)?.name || options[0].name;
}
