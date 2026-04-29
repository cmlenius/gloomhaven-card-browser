const helpers = require("../helpers.js");
let fs = require("fs");

let items = helpers.readData("./data/items").map((item) => {
  let id = item.id;
  if (id == null) id = 0;

  if (item.gameType === "gh" || item.gameType === "fh" || item.gameType === "ghss" || item.gameType === "fc") {
    id = id.toString();
    while (id.length < 3) id = "0" + id;
  } else if (item.gameType === "cs") {
    id = id - 164;
    if (id < 10) {
      id = "0" + id.toString();
    }
  } else if (item.gameType === "jotl") {
    if (id < 10) {
      id = "0" + id.toString();
    }
  }

  const imageName = item.name.toLowerCase().replaceAll("'", "").replaceAll(" ", "-");

  let source = item.source;
  if (item.gameType === "jotl") {
    if (item.id >= 1 && item.id <= 13) {
      source = "jotl";
    } else if (item.id >= 14 && item.id <= 20) {
      source = "jotl1";
    } else if (item.id >= 21 && item.id <= 26) {
      source = "jotl2";
    } else if (item.id >= 27 && item.id <= 36) {
      source = "jotl3";
    }
  } else if (item.gameType === "gh") {
    if (item.id >= 1 && item.id <= 70) {
      source = "prosperity";
    } else if (item.id >= 71 && item.id <= 95) {
      source = "random-design";
    } else if (item.id >= 96 && item.id <= 133) {
      source = "other";
    }
  } else if (item.gameType === "ghss") {
    source = "solo-scenario";
  } else if (item.gameType === "fc") {
    source = "fc";
  } else if (item.gameType === "cs") {
    source = "cs";
  } else if (item.gameType === "toa") {
    source = "toa";
  } else if (item.gameType === "fh") {
    source = "fh";
  }

  let expansion = item.gameType;
  if (expansion === "ghss") expansion = "gh";

  let expansionName = "";
  switch (expansion) {
    case "gh":
      expansionName = "gloomhaven";
      break;
    case "fc":
      expansionName = "forgotten-circles";
      break;
    case "jotl":
      expansionName = "jaws-of-the-lion";
      break;
    case "cs":
      expansionName = "crimson-scales";
      break;
    case "toa":
      expansionName = "trail-of-ashes";
      break;
    case "fh":
      expansionName = "frosthaven";
      break;
  }

  let image = `items/${expansionName}/${expansion}-${id}-${imageName}.jpeg`;
  if (typeof item.displayId === "string" || item.displayId instanceof String) {
    image = `items/${expansionName}/${expansion}-${item.displayId}-${imageName}.jpeg`;
  }

  return {
    id: parseInt(id.toString(), 10),
    name: item.name.toLowerCase().replaceAll("'", ""),
    game: expansion === "fc" ? "gh" : expansion,
    source: source || "",
    image: image,
    ...(item.imageBack && { imageBack: image.replace(".jpeg", "-back.jpeg") }),
    cost: item.cost || 0,
    slot: item.slot || "",
    spent: item.spent,
    consumed: item.consumed,
    prosperity: item.unlockProsperity,
  };
});

// Two items sharing an image path become indistinguishable records, which also
// collide as React keys in the card list. Catch it here rather than shipping it.
const seen = new Map();
for (const item of items) {
  seen.set(item.image, (seen.get(item.image) || 0) + 1);
}
const collisions = [...seen].filter(([, count]) => count > 1);
if (collisions.length) {
  throw new Error(
    "duplicate image paths generated (give each variant a distinct displayId):\n" +
      collisions.map(([image, count]) => `  ${image} x${count}`).join("\n"),
  );
}

let groupedItems = helpers.groupBy(items, "game");
fs.writeFile("item-cards.js", JSON.stringify(groupedItems), "utf8", () => console.log("items", items.length));
