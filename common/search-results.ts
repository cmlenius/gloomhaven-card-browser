import { MonsterSearch } from "../common/types";
import { customSort, getCharacter, getDefaultCharacterClass, verifyQueryParam } from "../common/utils";
import { buildingCards } from "../data/building-cards";
import { characterAbilityCards } from "../data/character-ability-cards";
import { eventCards } from "../data/event-cards";
import { itemCards } from "../data/item-cards";
import { monsterCards } from "../data/monster-cards";
import { petCards } from "../data/pet-cards";

export const characterSearchResults = (query: { [key: string]: string | string[] }) => {
  const game = verifyQueryParam(query.game, "gh");
  const className = verifyQueryParam(query.character, getDefaultCharacterClass(game));

  const character = getCharacter(game, className?.toUpperCase());
  if (character == null) {
    return [];
  }

  return (
    characterAbilityCards[game]?.[character?.class.toUpperCase()]
      ?.map((card) => (card.name.endsWith("-back") ? { ...card, name: character?.name } : card))
      .sort(customSort("level", "asc")) || []
  );
};

export const eventSearchResults = (query: { [key: string]: string | string[] }) => {
  const game = verifyQueryParam(query.game, "gh");
  const season = verifyQueryParam(query.season);
  let eventType = verifyQueryParam(query.eventType, "city");

  if (game === "fh" && eventType === "city") eventType = "outpost";

  return eventCards[game]?.sort(customSort("id", "asc")) || [];
};

export const itemSearchResults = (query: { [key: string]: string | string[] }) => {
  const game = verifyQueryParam(query.game, "gh");
  return itemCards[game]?.sort(customSort("id", "asc")) || [];
};

export const monsterSearchResults = (query: { [key: string]: string | string[] }): MonsterSearch => {
  const game = verifyQueryParam(query.game, "gh");
  const monster = verifyQueryParam(query.monster, monsterCards[game]?.[0].id);

  return {
    monsterList: monsterCards[game]?.map((m) => ({ id: m.id, name: m.name })) || [],
    monster: monsterCards[game]?.find((m) => m.id === monster),
  };
};

export const buildingSearchResults = (query: { [key: string]: string | string[] }) => {
  const game = verifyQueryParam(query.game, "gh");
  return buildingCards[game]?.sort(customSort("id", "asc")) || [];
};

export const petSearchResults = (query: { [key: string]: string | string[] }) => {
  const game = verifyQueryParam(query.game, "gh");
  return petCards[game]?.sort(customSort("id", "asc")) || [];
};