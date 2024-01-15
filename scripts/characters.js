/* eslint-disable*/
let characters = [

  // Gloomhaven
  { id: "BR", game: "gh", colour: "#335970", base: true, name: "Brute" },
  { id: "CH", game: "gh", colour: "#656A33", base: true, name: "Cragheart" },
  { id: "MT", game: "gh", colour: "#374458", base: true, name: "Mindthief" },
  { id: "SC", game: "gh", colour: "#415021", base: true, name: "Scoundrel" },
  { id: "SW", game: "gh", colour: "#583D72", base: true, name: "Spellweaver" },
  { id: "TI", game: "gh", colour: "#6C5A45", base: true, name: "Tinkerer" },
  { id: "BE", game: "gh", colour: "#71382F", name: "Berserker", altName: "Lightning Bolts", },
  { id: "BT", game: "gh", colour: "#634031", name: "Beast Tyrant", altName: "Two Minis", },
  { id: "DS", game: "gh", colour: "#3D7584", name: "Doomstalker", altName: "Angry Face", },
  { id: "EL", game: "gh", colour: "#474747", name: "Elementalist", altName: "Triangles", },
  { id: "NS", game: "gh", colour: "#49475F", name: "Nightshroud", altName: "Eclipse", },
  { id: "PH", game: "gh", colour: "#31514E", name: "Plagueherald", altName: "Cthulhu", },
  { id: "QM", game: "gh", colour: "#815527", name: "Quartermaster", altName: "Three Spears", },
  { id: "SB", game: "gh", colour: "#3E3E3E", name: "Sawbones", altName: "Saw" },
  { id: "SK", game: "gh", colour: "#7E6C34", name: "Sunkeeper", altName: "Sun", },
  { id: "SS", game: "gh", colour: "#75524E", name: "Soothsinger", altName: "Music Note", },
  { id: "SU", game: "gh", colour: "#713B5C", name: "Summoner", altName: "Circles", },
  { id: "BS", game: "gh", colour: "#403129", hidden: false, name: "Bladeswarm", altName: "Crossed Swords", },

  // Forgotten Circles
  { id: "DR", game: "fc", colour: "#555683", name: "Diviner", altName: "Diviner", },

  // Jaws of the Lion
  { id: "DE", game: "jotl", colour: "#8A431D", base: true, name: "Demolitionist", },
  { id: "HA", game: "jotl", colour: "#224564", base: true, name: "Hatchet" },
  { id: "RG", game: "jotl", colour: "#7B201B", base: true, name: "Red Guard" },
  { id: "VW", game: "jotl", colour: "#5F5D5E", base: true, name: "Voidwarden", },

  // Crimson Scales
  { id: "BK", game: "cs", colour: "#AF8F42", name: "Brightspark", altName: "Flask", },
  { id: "BM", game: "cs", colour: "#725C3F", name: "Bombard", altName: "Target", },
  { id: "CG", game: "cs", colour: "#1C1919", name: "Chainguard", altName: "Chained Helmet", },
  { id: "CT", game: "cs", colour: "#5F8A87", name: "Chieftain", altName: "Tusks", },
  { id: "FK", game: "cs", colour: "#97452B", name: "Fire Knight", altName: "Ladder Axe", },
  { id: "HO", game: "cs", colour: "#8B5E90", name: "Hollowpact", altName: "Vortex", }, 
  { id: "HP", game: "cs", colour: "#8C8A79", name: "Hierophant", altName: "Leaf", },
  { id: "LU", game: "cs", colour: "#53378B", name: "Luminary", altName: "Crescent Sun", },
  { id: "MF", game: "cs", colour: "#334123", name: "Mirefoot", altName: "Sprig", },
  { id: "SP", game: "cs", colour: "#4F7F45", name: "Spirit Caller", altName: "Skull", },
  { id: "ST", game: "cs", colour: "#384070", name: "Starslinger", altName: "Galaxy", },
  { id: "AA", game: "cs", colour: "#A77037", name: "Amber Aegis", altName: "Beetle", },
  { id: "QA", game: "cs", colour: "#739097", name: "Artificer", altName: "Tools", }, 
  { id: "RM", game: "cs", colour: "#8D2B27", name: "Ruinmaw", altName: "Bleeding Claw", },

  // Trail of Ashes
  { id: "IN", game: "toa", colour: "#7B2D40", name: "Incarnate", altName: "Three Eyes" },
  { id: "RH", game: "toa", colour: "#364A6D", name: "Rimehearth", altName: "Ice Meteor" },
  { id: "SR", game: "toa", colour: "#79552C", name: "Shardrender", altName: "Gemstone" },
  { id: "TP", game: "toa", colour: "#265372", name: "Tempest", altName: "Lightning Ball" },
  { id: "TR", game: "toa", colour: "#6B693B", name: "Thornreaper", altName: "Spiked Ring" },
  { id: "VQ", game: "toa", colour: "#AD4F3F", hidden: true, name: "Vanquisher", altName: "Vanquisher" },

  // Frosthaven
  { id: "BB", game: "fh", colour: "#3E7D9B", base: true, name: "Blinkblade" },
  { id: "BN", game: "fh", colour: "#B29243", base: true, name: "Banner Spear" },
  { id: "BO", game: "fh", colour: "#347132", base: true, name: "Boneshaper" },
  { id: "DF", game: "fh", colour: "#8C7566", base: true, name: "Drifter" },
  { id: "DW", game: "fh", colour: "#747A8B", base: true, name: "Deathwalker" },
  { id: "GE", game: "fh", colour: "#94274E", base: true, name: "Geminate" },
  { id: "CR", game: "fh", colour: "#814B6B", name: "Crashing Tide", altName: "Coral" },
  { id: "DT", game: "fh", colour: "#624278", name: "Deepwraith", altName: "Kelp" },
  { id: "FF", game: "fh", colour: "#6790AE", name: "Frozen Fist", altName: "Fist" },
  { id: "HV", game: "fh", colour: "#BC9847", name: "Hive", altName: "Prism" },
  { id: "IF", game: "fh", colour: "#6B9E47", name: "Infuser", altName: "Astral" },
  { id: "ME", game: "fh", colour: "#A38B69", name: "Metal Mosaic", altName: "Drill" },
  { id: "PC", game: "fh", colour: "#4D5186", name: "Pain Conduit", altName: "Shackles" },
  { id: "PY", game: "fh", colour: "#BE462F", name: "Pyroclast", altName: "Meteor" },
  { id: "SD", game: "fh", colour: "#5995A2", name: "Snowdancer", altName: "Snowflake" },
  { id: "SH", game: "fh", colour: "#807681", name: "Shattersong", altName: "Shards" },
  { id: "TA", game: "fh", colour: "#714A2E", name: "Trapper", altName: "Trap" },
];

let fs = require("fs");

characters = characters.filter(
  (character) => !character.name.endsWith("-back")
);
characters = characters.map((character) => {
  let expansion = "";
  switch (character.game) {
    case "gh":
      expansion = "gloomhaven";
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
    default:
      expansion = "";
  }

  const path = `${expansion}/${character.game}-${character.name
    .toLowerCase()
    .replaceAll(" ", "-")}`;

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
  console.log("characters", characters.length)
);
