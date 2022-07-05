import { characters } from "./characters";

export const baseUrl =
  "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-viewer/images/";

const baseCharacterClasses = new Set(
  characters.filter((c) => c.base).map((c) => c.class)
);
const hiddenCharacterClasses = new Set(
  characters.filter((c) => c.hidden).map((c) => c.class)
);

export function characterClasses(game) {
  return characters.filter((c) => c.game === (game || "gh"));
}

export function colour(char) {
  const defaultColour = "#432423";

  if (!char) return defaultColour;
  return characters.find((c) => c.class === char)?.colour || defaultColour;
}

export function defaultClass(game) {
  if (game === "jotl") {
    return "DE";
  } else if (game === "cs") {
    return "BK";
  }
  return "BR";
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

export function characterSpoilerFilter(spoilers) {
  return (card) =>
    (baseCharacterClasses.has(card.class) ||
      spoilers.characters?.has(card.class) ||
      hiddenCharacterClasses.has(card.class)) &&
    card.level < spoilers.level + 1;
}

export function itemSpoilerFilter(spoilers) {
  return (card) => {
    switch (card.source) {
      case "prosperity":
        return card.prosperity <= parseInt(spoilers.items.prosperity, 10);
      case "random-design":
        return spoilers.items.recipes;
      case "solo-scenario":
        return spoilers.items.solo;
      case "other":
        return spoilers.items.other;
      case "fc":
        return spoilers.items.fc;
      case "jotl":
        return true;
      case "jotl1":
        return spoilers.items.jotl1;
      case "jotl2":
        return spoilers.items.jotl2;
      case "jotl3":
        return spoilers.items.jotl3;
      case "cs":
        return true;
      default:
        return false;
    }
  };
}
