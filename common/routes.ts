import { characters } from "../data/characters";
import { games } from "../data/games";
import { monsterCards } from "../data/monster-cards";

export const characterRoutes = {
  fallback: false,
  paths: characters.map((character) => ({
    params: {
      game: character.game,
      character: character.class,
    },
  })),
};

export const characterGameRoutes = {
  fallback: false,
  paths: games.map((game) => ({
    params: {
      game: game.id,
      character: game.defaultClass,
    },
  })),
};

export const eventRoutes = {
  fallback: false,
  paths: games.map((game) => ({
    params: {
      game: game.id,
    },
  })),
};

export const itemRoutes = {
  fallback: false,
  paths: games.map((game) => ({
    params: {
      game: game.id,
    },
  })),
};

export const monsterGameRoutes = {
  fallback: false,
  paths: games.map((game) => ({
    params: {
      game: game.id,
      monster: game.defaultMonster,
    },
  })),
};

export const monsterRoutes = {
  fallback: false,
  paths: Object.values(monsterCards)
    .flat()
    .map((monster) => ({
      params: {
        game: monster.game,
        monster: monster.id,
      },
    })),
};

export const buildingRoutes = {
  fallback: false,
  paths: games.map((game) => ({
    params: {
      game: game.id,
    },
  })),
};

export const petRoutes = {
  fallback: false,
  paths: games.map((game) => ({
    params: {
      game: game.id,
    },
  })),
};