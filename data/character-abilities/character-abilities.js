const helpers = require("../helpers.js");
const fs = require("fs");

let abilities = helpers.readData("./data/character-abilities").map((ability) => {
  let characterClass = ability.milestone ? ability.imageBack.split("/")[2] : ability.image.split("/")[2];

  let expansion = ability.expansion;
  switch (ability.expansion) {
    case "Gloomhaven":
      expansion = "gh";
      break;
    case "Gloomhaven 2nd Edition":
      expansion = "gh2";
      break;
    case "Forgotten Circles":
      expansion = "gh";
      break;
    case "Jaws Of The Lion":
      expansion = "jotl";
      break;
    case "Crimson Scales":
      expansion = "cs";
      break;
    case "Frosthaven":
      expansion = "fh";
      break;
    case "Trail of Ashes":
      expansion = "toa";
      break;
    case "custom-content":
      expansion = "cc";
      break;
  }
  let level = ability.level;
  if (level === "X") {
    level = 1.5;
  } else if (level == "M") {
    level = 0.25;
  } else if (level == "I") {
    level = 10;
  } else if (level.toLowerCase() != level.toUpperCase()) {
    level = 0.5;
  } else {
    level = parseInt(level) || 0;
  }

  return {
    name: ability.name.toLowerCase(),
    class: characterClass,
    game: expansion,
    image: ability.image.replaceAll(".png", ".jpeg"),
    initiative: parseFloat(ability.initiative) || 0,
    level: level,
    ...(ability.imageBack && {
      imageBack: ability.imageBack.replaceAll(".png", ".jpeg"),
    }),
    ...(ability.milestone && { milestone: ability.milestone }),
  };
});

let groupedAbilities = helpers.groupBy(abilities, "game");
Object.keys(groupedAbilities).forEach((k) => (groupedAbilities[k] = helpers.groupBy(groupedAbilities[k], "class")));

fs.writeFile("character-ability-cards.js", JSON.stringify(groupedAbilities), "utf8", () =>
  console.log("abilities", abilities.length),
);
