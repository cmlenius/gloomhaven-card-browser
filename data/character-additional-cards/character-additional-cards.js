const fs = require("fs");

const dir = "./data/character-additional-cards";
let groupedCards = {};
fs.readdirSync(dir).forEach((file) => {
  if (file.endsWith(".json")) {
    data = JSON.parse(fs.readFileSync(`${dir}/${file}`));
    switch (file) {
      case "gloomhaven.json":
        expansion = "gh";
        break;
      case "gloomhaven-2nd-edition.json":
        expansion = "gh2";
        break;
      case "jaws-of-the-lion.json":
        expansion = "jotl";
        break;
      case "crimson-scales.json":
        expansion = "cs";
        break;
      case "frosthaven.json":
        expansion = "fh";
        break;
      case "trail-of-ashes.json":
        expansion = "toa";
        break;
      case "custom-content.json":
        expansion = "cc";
        break;
    }
    groupedCards[expansion] = data;
  }
});

fs.writeFile("character-additional-cards.js", JSON.stringify(groupedCards), "utf8", () =>
  console.log("character-addtional-cards"),
);
