import { characters } from "../data/characters";
import { games } from "../data/games";
import { Card, Character, CharacterAbility, Item, Spoilers } from "./types";

export const defaultDescription =
  "Gloomhaven Card Browser is a tool for viewing Ability, Item, Monster, and Event cards from the games Gloomhaven, Frosthaven, Forgotten Circles, Jaws of the Lion, Crimson Circles, and Trail of Ashes";
export const defaultTitle = "Gloomhaven Card Browser";

export function getBaseUrl(): string {
  return "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-browser/images/images/";
}

const nameToClassKeyMapping = characters.reduce((map, character) => {
  map[character.name.toLowerCase().replace(/\s/g, "")] = character.class;
  if (character.altName) {
    map[character.altName.toLowerCase().replace(/\s/g, "")] = character.class;
  }
  return map;
}, {});

const articles = new Set(["a", "an", "and", "of", "the"]);
const toTitleCase = (phrase: string | number) => {
  return phrase
    .toString()
    .toLowerCase()
    .split(" ")
    .map((word, i) =>
      i !== 0 && articles.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

export function verifyQueryParam(
  param: string | string[] | null,
  defaultValue?: string
): string | null {
  if (!param) return defaultValue;
  if (param instanceof Array) return param[0];
  return param;
}

export function getDescription(
  game: string,
  subject: string,
  cards: Card[]
): string {
  const gameName = games.find((g) => g.id === game)?.name;
  const description =
    gameName +
    " " +
    subject +
    "; " +
    cards.map((c) => toTitleCase(c.name)).join(", ");

  if (
    !gameName ||
    !subject ||
    !cards ||
    cards.length == 0 ||
    description.trim() == ""
  )
    return defaultDescription;

  return description.trim();
}

export function getTitle(game: string, subject: string): string {
  const gameName = games.find((g) => g.id === game)?.name;
  const title = gameName + " " + subject;

  if (!gameName || !subject || title.trim() == "") return defaultTitle;

  return title.trim();
}

export function getCharacterClasses(game: string): Character[] {
  return characters.filter((c) => c.game === game);
}

export function getCharacterColor(char: string): string {
  const defaultColour = "#432423";

  if (!char) return defaultColour;
  return characters.find((c) => c.class === char)?.colour || defaultColour;
}

export function getCharacter(
  game: string,
  characterClass: string
): Character | null {
  const chars = game ? characters.filter((c) => c.game === game) : characters;
  let character = chars.find((c) => c.class === characterClass);
  if (character == null) {
    const characterClassName = characterClass.toLowerCase().replace(/\s/g, "");
    character = chars.find(
      (c) => c.class === nameToClassKeyMapping[characterClassName]
    );
  }

  return character;
}

export function getDefaultCharacterClass(gameId: string): string | null {
  const game = games.find((g) => g.id === gameId);
  if (game) return game.defaultClass;

  return null;
}

export function getDefaultMonster(gameId: string): string | null {
  const game = games.find((g) => g.id === gameId);
  if (game) return game.defaultMonster;

  return null;
}

interface SearchResult {
  name: number | string;
}

export function customSort(
  order: string,
  direction: string
): (a: SearchResult, b: SearchResult) => number {
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

export function characterSpoilerFilter(
  spoilers: Spoilers
): (card: CharacterAbility) => boolean {
  const baseCharacterClasses = new Set(
    characters.filter((c) => c.base).map((c) => c.class)
  );
  const hiddenCharacterClasses = new Set(
    characters.filter((c) => c.hidden).map((c) => c.class)
  );

  return (card) =>
    (baseCharacterClasses.has(card.class) ||
      spoilers.characters?.has(card.class) ||
      hiddenCharacterClasses.has(card.class)) &&
    card.level < 1 + (spoilers.level || 1);
}

export function itemSpoilerFilter(spoilers: Spoilers): (item: Item) => boolean {
  return (card) => {
    switch (card.source) {
      case "prosperity":
        return (
          card.prosperity <= parseInt(String(spoilers.items.prosperity), 10)
        );
      case "random-design":
        return !!spoilers.items.recipes;
      case "solo-scenario":
        return !!spoilers.items.solo;
      case "other":
        return !!spoilers.items.other;
      case "fc":
        return !!spoilers.items.fc;
      case "jotl":
        return true;
      case "jotl1":
        return !!spoilers.items.jotl1;
      case "jotl2":
        return !!spoilers.items.jotl2;
      case "jotl3":
        return !!spoilers.items.jotl3;
      case "cs":
      case "toa":
      case "fh":
        return true;
      default:
        return false;
    }
  };
}

type Ranges = { start: number; end: number }[];

/**
 * Parses a string of "ranges" into an array of range objects.
 * EG: "1-10,92" => [{ start: 1, end : 10 }, { start: 92, end: 92 }].
 * @param str The string to parse into ranges.
 * @returns The range objects, or null if empty input string or error.
 */
export function parseRanges(str: string): Ranges | null {
  if (str === "") {
    return null;
  }
  const result: Ranges = [];

  for (const segment of str.split(",")) {
    const parts = segment.split("-");
    if (parts.length === 2) {
      const [start, end] = parts;
      result.push({ start: parseInt(start), end: parseInt(end) });
    } else if (parts.length === 1) {
      const val = parseInt(parts[0]);
      result.push({ start: val, end: val });
    } else {
      return null;
    }
  }

  return result;
}

/**
 * Determines whether the supplied number is contained within any of the
 * supplied ranges (inclusive of endpoints). EG:
 *
 * `isInRanges(10, [{ start: 1, end : 10 }, { start: 92, end: 92 }]) => true`
 *
 * `isInRanges(14, [{ start: 1, end : 10 }, { start: 92, end: 92 }]) => false`
 * @param n The number to check if in any range
 * @param ranges The ranges to check
 * @returns `true` if n is in any range, `false` otherwise
 */
export function isInRanges(n: number, ranges: Ranges): boolean {
  return ranges.some((range) => range.start <= n && n <= range.end);
}
