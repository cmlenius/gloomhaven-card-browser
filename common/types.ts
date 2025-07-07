import { ParsedUrlQuery } from "querystring";

export type Game = {
  id: string;
  name: string;
  defaultClass: string;
  defaultMonster: string;
  routes: Option[];
};

export type Character = {
  class: string;
  colour: string;
  name: string;
  altName?: string;
  game: string;
  matImage: string;
  matImageBack: string;
  source?: string;
  sheetImage: string;
  base?: boolean;
  hidden?: boolean;
};

export interface Card {
  id?: number;
  name: string;
  image: string;
  imageBack?: string;
}

export interface MultiLevelCard {
  id?: number;
  name: string;
  image: string[];
  imageBack?: string[];
}

export type CharacterAbility = {
  name: string;
  class: string;
  game: string;
  image: string;
  initiative: number;
  level: number;
  imageBack?: string;
  milestone?: boolean;
};

export type Item = {
  id: number;
  name: string;
  game: string;
  source: string;
  image: string;
  cost: number;
  slot: string;
  imageBack?: string;
  consumed?: boolean;
  spent?: boolean;
  prosperity?: number;
};

export type Event = {
  id: number;
  name: string;
  game: string;
  eventType: string;
  image: string;
  imageBack?: string;
  season?: string;
};

export type Monster = {
  id: string;
  name: string;
  game: string;
  statCards: string[];
  abilityCards: string[];
  isVertical: boolean;
};

export type Building = {
  id: number;
  name: string;
  base: boolean;
  game: string;
  image: string[];
  imageBack?: string[];
};

export type Pet = {
  id: number;
  name: string;
  game: string;
  image: string;
  imageBack?: string;
};

export type Option = {
  id: string;
  name: string;
};

export type MonsterSearch = {
  monster: Monster;
  monsterList: Option[];
};

export interface Spoilers {
  buildings: Set<string>;
  characters: Set<string>;
  items: Record<string, string | boolean>;
  level: number;
  loading: boolean;
}

export interface CharacterParams extends ParsedUrlQuery {
  game: string;
  character: string;
}

export interface MonsterParams extends ParsedUrlQuery {
  game: string;
  monster: string;
}

export interface GameParams extends ParsedUrlQuery {
  game: string;
}

export interface SearchResult {
  name: number | string;
}
