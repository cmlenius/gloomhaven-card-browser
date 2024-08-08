let pets = [
  {
    name: "01 piranha pig",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-01-piranha-pig.png",
  },
  {
    name: "01 piranha pig",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-01-piranha-pig-back.png",
  },
  {
    name: "02 hound",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-02-hound.png",
  },
  {
    name: "02 hound",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-02-hound-back.png",
  },
  {
    name: "03 spitting drake",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-03-spitting-drake.png",
  },
  {
    name: "03 spitting drake",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-03-spitting-drake-back.png",
  },
  {
    name: "04 rending drake",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-04-rending-drake.png",
  },
  {
    name: "04 rending drake",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-04-rending-drake-back.png",
  },
  {
    name: "05 black imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-05-black-imp.png",
  },
  {
    name: "05 black imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-05-black-imp-back.png",
  },
  {
    name: "06 forest imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-06-forest-imp.png",
  },
  {
    name: "06 forest imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-06-forest-imp-back.png",
  },
  {
    name: "07 snow imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-07-snow-imp.png",
  },
  {
    name: "07 snow imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-07-snow-imp-back.png",
  },
  {
    name: "08 ooze",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-08-ooze.png",
  },
  {
    name: "08 ooze",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-08-ooze-back.png",
  },
  {
    name: "09 ruined machine",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-09-ruined-machine.png",
  },
  {
    name: "09 ruined machine",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-09-ruined-machine-back.png",
  },
  {
    name: "10 lightning eel",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-10-lightning-eel.png",
  },
  {
    name: "10 lightning eel",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-10-lightning-eel-back.png",
  },
  {
    name: "11 heroics",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-11-heroics.png",
  },
  {
    name: "11 heroics",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-11-heroics-back.png",
  },
  {
    name: "12 brummix",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-12-brummix.png",
  },
  {
    name: "12 brummix",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-12-brummix-back.png",
  },
];

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {},
  );

let fs = require("fs");

pets = pets
  .filter((pets) => !pets.image.endsWith("back.png"))
  .map((pet) => {
    let name = pet.name
      .split(" ")
      .slice(1)
      .map((w, i) => (i !== 0 && (w === "of" || w === "the") ? w : w.charAt(0).toUpperCase() + w.slice(1)));

    return {
      id: parseInt(pet.name.split(" ")[0], 10),
      name: name.join(" "),
      game: "fh",
      image: pet.image.replaceAll(".png", ".jpeg"),
      imageBack: pet.image.replaceAll(".png", "-back.jpeg"),
    };
  });

fs.writeFile("pet-cards.js", JSON.stringify(groupBy(pets, "game")), "utf8", () => console.log("pets", pets.length));
