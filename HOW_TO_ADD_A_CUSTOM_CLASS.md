# How to add a custom class

This is a guide for uploading new classes under the `custom` game. It requires making 2 Pull Requests, the 1st one to merge the new image/icon files to the `image` branch, the 2nd one to merge the new JSON data to the `main` branch.

### Adding images

1. Fork a branch from the `images` branch
2. Add the new character icon to `/images/icons/characters/custom-content/CLASS_CODE.png`
3. Add the new character ability card images to `/images/character-ability-cards/custom-content/CLASS_CODE/`
4. (Optional) Add the new character mat front & back to `/images/character-mats/custom-content/cc-NAME{-back}.jepg``
5. (Optional) Add the new character perk sheet to `/images/character-mats/custom-content/cc-NAME-perks.jpeg`
6. Commit changes and open a Pull Request to merge into the `images` branch

To avoid long load times, images should be compressed before uploading, there are free online image compression sites which will reduce the file size with little to no visible quality loss. Images will also be dynamically resized by CSS so having very large files will not increase the quality. Ability Card images should aim to be around 50KB - 200KB, though there is no hard limit. Look at other similar files to understand the existing naming conventions.

### Adding JSON data

1. Fork a branch from the `main` branch
2. Append the character ability card data to `data/character-ability-cards/custom-content.json`
3. Append the character data to `data/scripts/characters.js`
4. Run `npm run format` to make sure all changes are formatted correctly
5. Run `npm run data` to generate changes to the `.ts` files
6. Test changes locally and ensure all images are loading properly
7. Commit changes and open a Pull Request to merge into the `main` branch

Ability card data should be in the following format. For level you can also put a character such as `"X"`. Introduction of unique card levels such as `"M"` used by Sawbones will require updating `/data/scripts/abilites.js` to define the sort order.

```json
  {
    "name": ability name",
    "expansion": "custom-content",
    "image": "character-ability-cards/custom-content/XX/cc-ability-name.jpeg",
    "level": "1",
    "initiative": "72"
  }
```

Character data should be in the following format.

```json
{ "id": "XX", "game": "cc", "colour": "#16395A", "base": true, "name": "Brute" }
```

### Testing locally

After cloning the repo, run the following command `npm run dev` and navitage to [localhost:3000](localhost:3000) in your browser. All local changes should immediately be reflected. When adding JSON data, if the Pull Request to update the images has not merged yet, the images will fail to show up locally.
