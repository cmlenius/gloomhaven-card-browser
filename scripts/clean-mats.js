let mats = [
  {
    class: "BE",
    name: "Berserker",
    image: "character-mats/gloomhaven/gh-berserker.png",
    expansion: "gloomhaven",
    cards: 10,
    health: 10,
  },
  {
    class: "BR",
    name: "Brute",
    image: "character-mats/gloomhaven/gh-brute.png",
    expansion: "gloomhaven",
    cards: 10,
    health: 10,
  },
  {
    class: "BT",
    name: "Beast Tyrant",
    image: "character-mats/gloomhaven/gh-beast-tyrant.png",
    expansion: "gloomhaven",
    cards: 10,
    health: 6,
  },
  {
    class: "CH",
    name: "Cragheart",
    image: "character-mats/gloomhaven/gh-cragheart.png",
    expansion: "gloomhaven",
    cards: 11,
    health: 10,
  },
  {
    class: "DS",
    name: "Doomstalker",
    image: "character-mats/gloomhaven/gh-doomstalker.png",
    expansion: "gloomhaven",
    cards: 12,
    health: 8,
  },
  {
    class: "EL",
    name: "Elementalist",
    image: "character-mats/gloomhaven/gh-elementalist.png",
    expansion: "gloomhaven",
    cards: 10,
    health: 6,
  },
  {
    class: "MT",
    name: "Mindthief",
    image: "character-mats/gloomhaven/gh-mindthief.png",
    expansion: "gloomhaven",
    cards: 10,
    health: 6,
  },
  {
    class: "NS",
    name: "Nightshroud",
    image: "character-mats/gloomhaven/gh-nightshroud.png",
    expansion: "gloomhaven",
    cards: 9,
    health: 8,
  },
  {
    class: "PH",
    name: "Plagueherald",
    image: "character-mats/gloomhaven/gh-plagueherald.png",
    expansion: "gloomhaven",
    cards: 11,
    health: 6,
  },
  {
    class: "QM",
    name: "Quartermaster",
    image: "character-mats/gloomhaven/gh-quartermaster.png",
    expansion: "gloomhaven",
    cards: 9,
    health: 10,
  },
  {
    class: "SB",
    name: "Sawbones",
    image: "character-mats/gloomhaven/gh-sawbones.png",
    expansion: "gloomhaven",
    cards: 10,
    health: 8,
  },
  {
    class: "SC",
    name: "Scoundrel",
    image: "character-mats/gloomhaven/gh-scoundrel.png",
    expansion: "gloomhaven",
    cards: 9,
    health: 8,
  },
  {
    class: "SK",
    name: "Sunkeeper",
    image: "character-mats/gloomhaven/gh-sunkeeper.png",
    expansion: "gloomhaven",
    cards: 11,
    health: 10,
  },
  {
    class: "SS",
    name: "Soothsinger",
    image: "character-mats/gloomhaven/gh-soothsinger.png",
    expansion: "gloomhaven",
    cards: 9,
    health: 6,
  },
  {
    class: "SU",
    name: "Summoner",
    image: "character-mats/gloomhaven/gh-summoner.png",
    expansion: "gloomhaven",
    cards: 9,
    health: 8,
  },
  {
    class: "SW",
    name: "Spellweaver",
    image: "character-mats/gloomhaven/gh-spellweaver.png",
    expansion: "gloomhaven",
    cards: 8,
    health: 6,
  },
  {
    class: "TI",
    name: "Tinkerer",
    image: "character-mats/gloomhaven/gh-tinkerer.png",
    expansion: "gloomhaven",
    cards: 12,
    health: 8,
  },
  {
    class: "DR",
    name: "Diviner",
    image: "character-mats/forgotten-circles/fc-diviner.png",
    expansion: "forgotten circles",
    cards: 9,
    health: 6,
  },
  {
    class: "DE",
    name: "Demolitionist",
    image: "character-mats/jaws-of-the-lion/jl-demolitionist-front.png",
    expansion: "jaws of the lion",
    cards: 9,
    health: 8,
  },
  {
    class: "HA",
    name: "Hatchet",
    image: "character-mats/jaws-of-the-lion/jl-hatchet-front.png",
    expansion: "jaws of the lion",
    cards: 10,
    health: 8,
  },
  {
    class: "RG",
    name: "Red Guard",
    image: "character-mats/jaws-of-the-lion/jl-red-guard-front.png",
    expansion: "jaws of the lion",
    cards: 10,
    health: 10,
  },
  {
    class: "VW",
    name: "Void Warden",
    image: "character-mats/jaws-of-the-lion/jl-voidwarden-front.png",
    expansion: "jaws of the lion",
    cards: 11,
    health: 6,
  },
  {
    class: "AA",
    name: "Amber Aegis",
    image: "character-mats/crimson-scales/cs-amber-aegis.png",
    expansion: "crimson scales",
    cards: 11,
    health: 12,
  },
  {
    class: "BK",
    name: "Brightspark",
    image: "character-mats/crimson-scales/cs-brightspark.png",
    expansion: "crimson scales",
    cards: 9,
    health: 10,
  },
  {
    class: "BM",
    name: "Bombard",
    image: "character-mats/crimson-scales/cs-bombard.png",
    expansion: "crimson scales",
    cards: 11,
    health: 8,
  },
  {
    class: "CG",
    name: "Chainguard",
    image: "character-mats/crimson-scales/cs-chainguard.png",
    expansion: "crimson scales",
    cards: 10,
    health: 10,
  },
  {
    class: "CT",
    name: "Chieftain",
    image: "character-mats/crimson-scales/cs-chieftain.png",
    expansion: "crimson scales",
    cards: 10,
    health: 8,
  },
  {
    class: "FK",
    name: "Fire Knight",
    image: "character-mats/crimson-scales/cs-fire-knight.png",
    expansion: "crimson scales",
    cards: 10,
    health: 9,
  },
  {
    class: "HO",
    name: "Hollowpact",
    image: "character-mats/crimson-scales/cs-hollowpact.png",
    expansion: "crimson scales",
    cards: 10,
    health: 7,
  },
  {
    class: "HP",
    name: "Hierophant",
    image: "character-mats/crimson-scales/cs-hierophant.png",
    expansion: "crimson scales",
    cards: 11,
    health: 6,
  },
  {
    class: "LU",
    name: "Luminary",
    image: "character-mats/crimson-scales/cs-luminary.png",
    expansion: "crimson scales",
    cards: 11,
    health: 10,
  },
  {
    class: "MF",
    name: "Mirefoot",
    image: "character-mats/crimson-scales/cs-mirefoot.png",
    expansion: "crimson scales",
    cards: 10,
    health: 6,
  },
  {
    class: "QA",
    name: "Artificier",
    image: "character-mats/crimson-scales/cs-artificer.png",
    expansion: "crimson scales",
    cards: 9,
    health: 7,
  },
  {
    class: "RM",
    name: "Ruinmaw",
    image: "character-mats/crimson-scales/cs-ruinmaw.png",
    expansion: "crimson scales",
    cards: 11,
    health: 8,
  },
  {
    class: "SP",
    name: "Spirit Caller",
    image: "character-mats/crimson-scales/cs-spirit-caller.png",
    expansion: "crimson scales",
    cards: 10,
    health: 6,
  },
  {
    class: "ST",
    name: "Starslinger",
    image: "character-mats/crimson-scales/cs-starslinger.png",
    expansion: "crimson scales",
    cards: 10,
    health: 6,
  },
];
let fs = require("fs");

mats = mats.filter((mat) => !mat.image.includes("-back"));
mats = mats.map((mat) => {
  let expansion = mat.expansion;
  switch (mat.expansion) {
    case "gloomhaven":
      expansion = "gh";
      break;
    case "forgotten circles":
      expansion = "gh";
      break;
    case "jaws of the lion":
      expansion = "jotl";
      break;
    case "crimson scales":
      expansion = "cs";
      break;
    default:
      expansion = "";
  }
   
  return {
    class: mat.class,
    name: mat.name.toLowerCase(),
    game: expansion,
    image: mat.image.replace(".png", ".jpg"),
    cards: mat.cards,
    health: mat.health,
  };
});

fs.writeFile("character-mats.js", JSON.stringify(mats), "utf8", () =>
  console.log("mats:", mats.length)
);
