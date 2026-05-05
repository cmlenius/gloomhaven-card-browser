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
  link?: string;
  linkLabel?: string;
};

export interface Card {
  id?: number;
  name: string;
  image: string;
  imageBack?: string;
  overlay?: CardOverlay[];
}

export interface CardOverlay {
  image: string;
  x: number;
  y: number;
}

export interface MultiLevelCard {
  id?: number;
  name: string;
  image: string[];
  imageBack?: string[];
}

export type CharacterAbility = {
  id?: number;
  name: string;
  class: string;
  game: string;
  image: string;
  initiative: number;
  level: number;
  imageBack?: string;
  milestone?: boolean;
  top?: CharacterAbilityAction;
  bottom?: CharacterAbilityAction;
};

export type CharacterAbilityAction = {
  loss?: boolean;
  persistent?: boolean;
  dots: CharacterAbilityEnhancement[];
};

export type CharacterAbilityEnhancementCoords = {
  multitarget: boolean;
  persistent: boolean;
  x: number;
  y: number;
};

export type CharacterAbilityEnhancementPlus1 = {
  dot:
    | "square"
    | "circle"
    | "diamond"
    | "diamond-plus";
  plus1:
    | "move"
    | "attack"
    | "range"
    | "target"
    | "shield"
    | "retaliate"
    | "pierce"
    | "heal"
    | "push"
    | "pull"
    | "teleport"
    | "summon-hp"
    | "summon-move"
    | "summon-attack"
    | "summon-range"
    | "other-move";
} & CharacterAbilityEnhancementCoords;

export type CharacterAbilityEnhancementHex = {
  dot: "hex"
  hexes: number;
} & CharacterAbilityEnhancementCoords;

export type CharacterAbilityEnhancementOther = {
  dot:
    | "circle"
    | "diamond"
    | "diamond-plus";
} & CharacterAbilityEnhancementCoords;

export type CharacterAbilityEnhancement = 
  | CharacterAbilityEnhancementPlus1
  | CharacterAbilityEnhancementHex
  | CharacterAbilityEnhancementOther;

export type CharacterAdditionalCardsSection = {
  label: string;
  cards: CharacterAdditionalCard[];
  horizontal?: boolean;
};

export type CharacterAdditionalCard = {
  name: string;
  image: string;
  imageBack?: string;
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
