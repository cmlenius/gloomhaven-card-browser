node abilities.js
echo "$(echo -n 'import { CharacterAbility} from "../common/types"; export const characterAbilityCards: Record<string, Record<string, CharacterAbility[]>> = '; cat character-ability-cards.js)" > character-ability-cards.js
prettier --write character-ability-cards.js
mv character-ability-cards.js ../data/character-ability-cards.ts
 
node items.js
echo "$(echo -n 'import { Item } from "../common/types"; export const itemCards: Record<string, Item[]> = '; cat item-cards.js)" > item-cards.js
prettier --write item-cards.js
mv item-cards.js ../data/item-cards.ts
 
node events.js
echo "$(echo -n 'import { Event } from "../common/types"; export const eventCards: Record<string, Event[]> = '; cat event-cards.js)" > event-cards.js
prettier --write event-cards.js
mv event-cards.js ../data/event-cards.ts
 
node characters.js
echo "$(echo -n 'import { Character } from "../common/types"; export const characters: Character[] = '; cat character-stats.js)" > character-stats.js
prettier --write character-stats.js
mv character-stats.js ../data/characters.ts

