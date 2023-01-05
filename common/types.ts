export type SearchResult = CharacterAbilityCard | Item;

export type CharacterAbilityCard = {
  name: string;
  class: string;
  game: string;
  image: string;
  initiative: number;
  level: number;
};

export type Item = {
  id: number;
  name: string;
  game: string;
  source: string;
  image: string;
  cost: number;
  slot: string;
  consumed?: boolean;
  spent?: boolean;
  prosperity?: number;
};

export type Character = {
  class: string;
  colour: string;
  name: string;
  altName?: string;
  game: string;
  matImage: string;
  source?: string;
  sheetImage: string;
  base?: boolean;
  hidden?: boolean;
};

export type Game = {
  id: string;
  name: string;
  defaultClass: string;
};

export type FilterOption = {
  id: string;
  name: string;
  icon: string;
};

export type SortOption = {
  id: string;
  name: string;
};

export interface Spoilers {
  characters: Set<string>;
  items: Record<string, string | boolean>;
  level: number;
  loading: boolean;
}
