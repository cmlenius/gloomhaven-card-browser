let helpers = require("../helpers.js");
let fs = require("fs");

let characters = helpers.readData("./data/characters").map((character) => {
  let expansion = "";
  switch (character.game) {
    case "gh":
      expansion = "gloomhaven";
      break;
    case "gh2":
      expansion = "gloomhaven-2nd-edition";
      break;
    case "fc":
      expansion = "forgotten-circles";
      break;
    case "jotl":
      expansion = "jaws-of-the-lion";
      break;
    case "cs":
      expansion = "crimson-scales";
      break;
    case "fh":
      expansion = "frosthaven";
      break;
    case "toa":
      expansion = "trail-of-ashes";
      break;
    case "cc":
      expansion = "custom-content";
      break;
    default:
      expansion = "";
  }

  const path = `${expansion}/${character.game}-${character.name.toLowerCase().replaceAll(" ", "-")}`;

  return {
    class: character.id,
    colour: character.colour,
    name: character.name,
    altName: character.altName,
    game: character.game === "fc" ? "gh" : character.game,
    matImage: `character-mats/${path}.jpeg`,
    matImageBack: `character-mats/${path}-back.jpeg`,
    sheetImage: `character-perks/${path}-perks.jpeg`,
    base: character.base,
    hidden: character.hidden,
  };
});

fs.writeFile("character-stats.js", JSON.stringify(characters), "utf8", () =>
  console.log("characters", characters.length),
);
