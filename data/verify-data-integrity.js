const fs = require("fs");
const vm = require("vm");

function loadTsData(filePath) {
  const code = fs
    .readFileSync(filePath, "utf8")
    .replace(/^import\s+.*$/gm, "")
    .replace(/export\s+const\s+(\w+)\s*:[^=]+=/g, "exports.$1 =")
    .replace(/const\s+(\w+)\s*:[^=]+=/g, "const $1 =");
  const sandbox = { exports: {} };
  vm.runInNewContext(code, sandbox, { filename: filePath });
  return sandbox.exports;
}

const { games } = loadTsData("./data/games.ts");
const { characters } = loadTsData("./data/characters.ts");
const { characterAbilityCards } = loadTsData("./data/character-ability-cards.ts");
const { characterAdditionalCards } = loadTsData("./data/character-additional-cards.ts");
const { itemCards } = loadTsData("./data/item-cards.ts");
const { eventCards } = loadTsData("./data/event-cards.ts");
const { monsterCards } = loadTsData("./data/monster-cards.ts");
const { buildingCards } = loadTsData("./data/building-cards.ts");
const { petCards } = loadTsData("./data/pet-cards.ts");

const errors = [];

// 1. Games & Routes
const gameIds = new Set();
const validRoutes = new Set(["characters", "items", "events", "monsters", "buildings", "pets"]);

for (const game of games) {
  if (!game.id || !game.name) {
    errors.push(`Game entry is missing id or name: ${JSON.stringify(game)}`);
  }
  if (gameIds.has(game.id)) {
    errors.push(`Duplicate game id '${game.id}' in data/games.ts`);
  }
  gameIds.add(game.id);

  for (const route of game.routes || []) {
    if (!validRoutes.has(route.id)) {
      errors.push(`Game '${game.id}' has unknown route '${route.id}'`);
    }
    if (route.id === "items" && !itemCards[game.id]?.length) {
      errors.push(`Game '${game.id}' declares 'items' route but has no item cards`);
    }
    if (route.id === "events" && !eventCards[game.id]?.length) {
      errors.push(`Game '${game.id}' declares 'events' route but has no event cards`);
    }
    if (route.id === "monsters" && !monsterCards[game.id]?.length) {
      errors.push(`Game '${game.id}' declares 'monsters' route but has no monster cards`);
    }
    if (route.id === "buildings" && !buildingCards[game.id]?.length) {
      errors.push(`Game '${game.id}' declares 'buildings' route but has no building cards`);
    }
    if (route.id === "pets" && !petCards[game.id]?.length) {
      errors.push(`Game '${game.id}' declares 'pets' route but has no pet cards`);
    }
  }
}

// 2. Characters
const charKeys = new Set();
for (const char of characters) {
  if (!gameIds.has(char.game)) {
    errors.push(`Character '${char.class}' references unknown game '${char.game}'`);
  }
  const key = `${char.game}:${char.class}`;
  if (charKeys.has(key)) {
    errors.push(`Duplicate character '${key}' in data/characters.ts`);
  }
  charKeys.add(key);

  if (!char.name) {
    errors.push(`Character '${key}' is missing a name`);
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(char.colour)) {
    errors.push(`Character '${key}' has invalid hex colour '${char.colour}'`);
  }
  if (!characterAbilityCards[char.game]?.[char.class]?.length) {
    errors.push(`Character '${key}' has no ability cards in data/character-ability-cards.ts`);
  }
}

// Verify game defaultClass and defaultMonster
for (const game of games) {
  const routeIds = new Set((game.routes || []).map((r) => r.id));
  if (routeIds.has("characters") && !charKeys.has(`${game.id}:${game.defaultClass}`)) {
    errors.push(`Game '${game.id}' defaultClass '${game.defaultClass}' does not exist in data/characters.ts`);
  }
  if (routeIds.has("monsters")) {
    const monsters = monsterCards[game.id] || [];
    if (!monsters.some((m) => m.id === game.defaultMonster)) {
      errors.push(`Game '${game.id}' defaultMonster '${game.defaultMonster}' does not exist in data/monster-cards.ts`);
    }
  }
}

// 3. Character Ability Cards
for (const [game, byClass] of Object.entries(characterAbilityCards)) {
  if (!gameIds.has(game)) {
    errors.push(`characterAbilityCards references unknown game '${game}'`);
  }
  for (const [cls, cards] of Object.entries(byClass)) {
    const charKey = `${game}:${cls}`;
    if (!charKeys.has(charKey)) {
      errors.push(`characterAbilityCards has cards for '${charKey}', which is missing from data/characters.ts`);
    }
    const cardNames = new Set();
    const cardImages = new Set();
    for (const card of cards) {
      if (card.game !== game || card.class !== cls) {
        errors.push(
          `Ability card '${card.name}' in '${charKey}' has mismatched game/class (${card.game}:${card.class})`,
        );
      }
      if (cardNames.has(card.name)) {
        errors.push(`Duplicate ability card name '${card.name}' in '${charKey}'`);
      }
      cardNames.add(card.name);

      if (cardImages.has(card.image)) {
        errors.push(`Duplicate ability card image '${card.image}' in '${charKey}'`);
      }
      cardImages.add(card.image);

      if (typeof card.level !== "number" || card.level < 0 || card.level > 9) {
        errors.push(`Ability card '${card.name}' in '${charKey}' has invalid level '${card.level}'`);
      }
      if (typeof card.initiative !== "number" || card.initiative < 0 || card.initiative > 99) {
        errors.push(`Ability card '${card.name}' in '${charKey}' has invalid initiative '${card.initiative}'`);
      }
    }
  }
}

// 4. Character Additional Cards
for (const [game, byClass] of Object.entries(characterAdditionalCards)) {
  for (const [cls, sections] of Object.entries(byClass)) {
    const charKey = `${game}:${cls}`;
    if (!charKeys.has(charKey)) {
      errors.push(`characterAdditionalCards has entries for '${charKey}', which is missing from data/characters.ts`);
    }
    for (const section of sections) {
      if (!section.label || !Array.isArray(section.cards) || section.cards.length === 0) {
        errors.push(`Invalid additional cards section in '${charKey}': ${JSON.stringify(section)}`);
      }
    }
  }
}

// 5. Items
const validItemSlots = new Set(["head", "body", "1h", "2h", "legs", "small"]);
const validItemSources = new Set([
  "prosperity",
  "random-design",
  "solo-scenario",
  "other",
  "fc",
  "jotl",
  "jotl1",
  "jotl2",
  "jotl3",
  "cs",
  "toa",
  "fh",
]);

for (const [game, items] of Object.entries(itemCards)) {
  if (!gameIds.has(game)) {
    errors.push(`itemCards references unknown game '${game}'`);
  }
  const seenItems = new Set();
  for (const item of items) {
    if (item.game !== game) {
      errors.push(`Item '${item.id}' in '${game}' has mismatched game '${item.game}'`);
    }
    const itemKey = `${item.id}:${item.image}`;
    if (seenItems.has(itemKey)) {
      errors.push(`Duplicate item entry '${itemKey}' in '${game}'`);
    }
    seenItems.add(itemKey);

    if (item.slot && !validItemSlots.has(item.slot)) {
      errors.push(`Item '${item.id}' (${item.name}) in '${game}' has invalid slot '${item.slot}'`);
    }
    if (!validItemSources.has(item.source)) {
      errors.push(`Item '${item.id}' (${item.name}) in '${game}' has invalid source '${item.source}'`);
    }
    if (
      item.source === "prosperity" &&
      (typeof item.prosperity !== "number" || item.prosperity < 1 || item.prosperity > 9)
    ) {
      errors.push(`Prosperity item '${item.id}' in '${game}' has invalid prosperity level '${item.prosperity}'`);
    }
  }
}

// 6. Events, Monsters, Buildings, Pets
for (const [game, events] of Object.entries(eventCards)) {
  if (!gameIds.has(game)) {
    errors.push(`eventCards references unknown game '${game}'`);
  }
  const seenEvents = new Set();
  for (const ev of events) {
    if (ev.game !== game) {
      errors.push(`Event '${ev.id}' in '${game}' has mismatched game '${ev.game}'`);
    }
    const key = `${ev.eventType}:${ev.season || ""}:${ev.id}:${ev.image}`;
    if (seenEvents.has(key)) {
      errors.push(`Duplicate event '${key}' in '${game}'`);
    }
    seenEvents.add(key);
  }
}

for (const [game, monsters] of Object.entries(monsterCards)) {
  if (!gameIds.has(game)) {
    errors.push(`monsterCards references unknown game '${game}'`);
  }
  const seenMonsters = new Set();
  for (const monster of monsters) {
    if (monster.game !== game) {
      errors.push(`Monster '${monster.id}' in '${game}' has mismatched game '${monster.game}'`);
    }
    if (seenMonsters.has(monster.id)) {
      errors.push(`Duplicate monster id '${monster.id}' in '${game}'`);
    }
    seenMonsters.add(monster.id);
    if (!monster.statCards?.length || !monster.abilityCards?.length) {
      errors.push(`Monster '${monster.id}' in '${game}' is missing statCards or abilityCards`);
    }
  }
}

for (const [game, buildings] of Object.entries(buildingCards)) {
  if (!gameIds.has(game)) {
    errors.push(`buildingCards references unknown game '${game}'`);
  }
  const seenBuildings = new Set();
  for (const building of buildings) {
    if (building.game !== game) {
      errors.push(`Building '${building.id}' in '${game}' has mismatched game '${building.game}'`);
    }
    if (seenBuildings.has(building.id)) {
      errors.push(`Duplicate building id '${building.id}' in '${game}'`);
    }
    seenBuildings.add(building.id);
    if (!building.image?.length) {
      errors.push(`Building '${building.id}' in '${game}' has no images`);
    }
  }
}

for (const [game, pets] of Object.entries(petCards)) {
  if (!gameIds.has(game)) {
    errors.push(`petCards references unknown game '${game}'`);
  }
  const seenPets = new Set();
  for (const pet of pets) {
    if (pet.game !== game) {
      errors.push(`Pet '${pet.id}' in '${game}' has mismatched game '${pet.game}'`);
    }
    if (seenPets.has(pet.id)) {
      errors.push(`Duplicate pet id '${pet.id}' in '${game}'`);
    }
    seenPets.add(pet.id);
  }
}

if (errors.length > 0) {
  console.error(`\nError: Found ${errors.length} data integrity issue(s):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log("Verified referential and schema integrity across all data/*.ts files.");
