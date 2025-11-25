dataDir='./data'

node ${dataDir}/character-abilities/character-abilities.js
echo "$(echo 'import { CharacterAbility} from "../common/types"; export const characterAbilityCards: Record<string, Record<string, CharacterAbility[]>> = '; cat character-ability-cards.js)" > character-ability-cards.js
mv character-ability-cards.js ${dataDir}/character-ability-cards.ts
prettier --write ${dataDir}/character-ability-cards.ts
 
node ${dataDir}/items/items.js
echo "$(echo 'import { Item } from "../common/types"; export const itemCards: Record<string, Item[]> = '; cat item-cards.js)" > item-cards.js
mv item-cards.js ${dataDir}/item-cards.ts
prettier --write ${dataDir}/item-cards.ts
 
node ${dataDir}/characters/characters.js
echo "$(echo 'import { Character } from "../common/types"; export const characters: Character[] = '; cat character-stats.js)" > character-stats.js
mv character-stats.js ${dataDir}/characters.ts
prettier --write ${dataDir}/characters.ts

node ${dataDir}/monsters/monsters.js
echo "$(echo 'import { Monster } from "../common/types"; export const monsterCards: Record<string, Monster[]> = '; cat monster-cards.js)" > monster-cards.js
mv monster-cards.js ${dataDir}/monster-cards.ts
prettier --write ${dataDir}/monster-cards.ts
 
node ${dataDir}/events/events.js
echo "$(echo 'import { Event } from "../common/types"; export const eventCards: Record<string, Event[]> = '; cat event-cards.js)" > event-cards.js
mv event-cards.js ${dataDir}/event-cards.ts
prettier --write ${dataDir}/event-cards.ts
 
node ${dataDir}/buildings/buildings.js
echo "$(echo 'import { Building } from "../common/types"; export const buildingCards: Record<string, Building[]> = '; cat building-cards.js)" > building-cards.js
mv building-cards.js ${dataDir}/building-cards.ts
prettier --write ${dataDir}/building-cards.ts

node ${dataDir}/pets/pets.js
echo "$(echo 'import { Pet } from "../common/types"; export const petCards: Record<string, Pet[]> = '; cat pet-cards.js)" > pet-cards.js
mv pet-cards.js ${dataDir}/pet-cards.ts
prettier --write ${dataDir}/pet-cards.ts
