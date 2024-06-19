import { characters } from "../data/characters";
import { games } from "../data/games";
import { Card, Character, Game, SearchResult } from "./types";

export const defaultColour = "#432423";
export const defaultDescription =
  "Gloomhaven Card Browser is a tool for viewing Ability, Item, Monster, Event, Building, and Pet cards from the games Gloomhaven, Frosthaven, Forgotten Circles, Jaws of the Lion, Crimson Circles, and Trail of Ashes";
export const defaultTitle = "Gloomhaven Card Browser";

export function getBaseUrl(): string {
  return "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-browser/images/images/";
}

const articles = new Set(["a", "an", "and", "of", "the"]);
const toTitleCase = (phrase: string | number) => {
  return phrase
    .toString()
    .toLowerCase()
    .split(" ")
    .map((word, i) => (i !== 0 && articles.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
};

/**
 * Null checks param using default value if null. If array returns first element
 * @param param a nullable param that can be either a string or array of strings
 * @param defaultValue default value if param is not valid
 * @returns Nonnull string representing param or default value
 */
export const verifyQueryParam = (param: string | string[] | null, defaultValue?: string): string => {
  if (!param) return defaultValue;
  if (param instanceof Array) return param[0];
  return param;
};

/**
 * Generates a html page description based on the game and subject with list of card names
 * @param gameId The id of the game (i.e. "gh")
 * @param subject The subject of the page (i.e. "Items")
 * @param cards List of Cards
 * @returns Description as string text
 */
export const getDescription = (gameId: string, subject: string, cards: Card[]): string => {
  const gameName = games.find((g) => g.id === gameId)?.name;
  const description = gameName + " " + subject + "; " + cards.map((c) => toTitleCase(c.name)).join(", ");

  if (!gameName || !subject || !cards || cards.length == 0 || description.trim() == "") return defaultDescription;

  return description.trim();
};

/**
 * Generates a html page title based on the game and subject
 * @param gameId The id of the game (i.e. "gh")
 * @param subject The subject of the page (i.e. "Items")
 * @returns Title as string text
 */
export const getTitle = (gameId: string, subject: string): string => {
  const gameName = games.find((g) => g.id === gameId)?.name;
  const title = gameName + " " + subject;

  if (!gameName || !subject || title.trim() == "") return defaultTitle;

  return title.trim();
};

/**
 * Returns all characters for the specified game
 * @param gameId The id of the game (i.e. "gh")
 * @returns List of Characters
 */
export const getCharacterClasses = (gameId: string): Character[] => {
  return characters.filter((c) => c.game === gameId);
};

/**
 * Returns color of a character class or the default color if class not provided
 * @param characterClass The class name (i.e. "BR")
 * @returns css color code string
 */
export const getPageColor = (characterClass: string): string => {
  if (!characterClass) return defaultColour;
  return characters.find((c) => c.class === characterClass)?.colour || defaultColour;
};

/**
 * Returns character details for a the default character of a game
 * @param gameId The id of the game (i.e. "gh")
 * @returns Character details or null
 */
export const getDefaultCharacterClass = (gameId: string): string | null => {
  const game = games.find((g) => g.id === gameId);
  if (game) return game.defaultClass;

  return null;
};

/**
 * Returns character details for a specific character, if characterClass is not provided returns the default character for its game.
 * @param gameId The id of the game (i.e. "gh")
 * @param characterClass The class name (i.e. "BR")
 * @returns Character details or null
 */
export const getCharacter = (gameId: string, characterClass: string): Character | null => {
  if (!characterClass) {
    const game = games.find((g) => g.id === gameId);
    if (game) characterClass = game.defaultClass;
  }

  let character = characters.find((c) => c.class === characterClass);
  if (character) return character;

  return null;
};

/**
 * Returns game details for a specific game id
 * @param gameId The id of the game (i.e. "gh")
 * @returns Game details or null
 */
export const getGame = (gameId: string): Game | null => {
  return games.find((g) => g.id === gameId);
};

/**
 * Parses a string of "ranges" into an array of range objects.
 * EG: "1-10,92" => [{ start: 1, end : 10 }, { start: 92, end: 92 }].
 * @param str The string to parse into ranges.
 * @returns The range objects, or null if empty input string or error.
 */
export function customSort(order: string, direction: string): (a: SearchResult, b: SearchResult) => number {
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
