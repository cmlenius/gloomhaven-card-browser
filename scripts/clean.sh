if [ "$1" = "abilities" ]; then
  node clean-abilities.js
  prettier --write character-ability-cards.js
  echo "$(echo -n 'export const characterAbilityCards = '; cat character-ability-cards.js)" > character-ability-cards.js
  cp character-ability-cards.js ../data/character-ability-cards.js
fi
 
if [ "$1" = "items" ]; then
  node clean-items.js
  prettier --write item-cards.js
  echo "$(echo -n 'export const itemCards = '; cat item-cards.js)" > item-cards.js
  cp item-cards.js ../data/item-cards.js
fi
 
if [ "$1" = "mats" ]; then
  node clean-mats.js
  prettier --write character-mats.js
  echo "$(echo -n 'export const characterMats = '; cat character-mats.js)" > character-mats.js
  cp character-mats.js ../data/character-mats.js
fi
 
if [ "$1" = "characters" ]; then
  node clean-characters.js
  prettier --write characters.js
  echo "$(echo -n 'export const characters = '; cat characters.js)" > characters.js
  cp characters.js ../data/characters.js
fi
