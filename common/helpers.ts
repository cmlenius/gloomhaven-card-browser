import { characters } from "../data/characters";
import { games } from "../data/games";
import { Character, CharacterAbility, Item, Spoilers } from "./types";

export function getBaseUrl(): string {
  return "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-browser/images/images/";
}

export function getTitle(game: string, subject: string): string {
  const defaultTitle = "Gloomhaven Card Browser";

  const gameName = games.find((g) => g.id === game)?.name;
  const title = gameName + " " + subject;

  if (!gameName || !subject || title.trim() == "") return defaultTitle;

  return title.trim();
}

export function verifyQueryParam(
  param: string | string[] | null,
  defaultValue?: string
): string | null {
  if (!param) return defaultValue;
  if (param instanceof Array) return param[0];
  return param;
}

export function getCharacterClasses(game: string): Character[] {
  return characters.filter((c) => c.game === game);
}

export function getCharacterColor(char: string): string {
  const defaultColour = "#432423";

  if (!char) return defaultColour;
  return characters.find((c) => c.class === char)?.colour || defaultColour;
}

export function getCharacter(characterClass: string): Character | null {
  return characters.find((c) => c.class === characterClass);
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
