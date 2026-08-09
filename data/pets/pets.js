let pets = [
  {
    name: "01 piranha pig",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-01-piranha-pig.jpeg",
  },
  {
    name: "01 piranha pig",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-01-piranha-pig-back.jpeg",
  },
  {
    name: "02 hound",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-02-hound.jpeg",
  },
  {
    name: "02 hound",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-02-hound-back.jpeg",
  },
  {
    name: "03 spitting drake",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-03-spitting-drake.jpeg",
  },
  {
    name: "03 spitting drake",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-03-spitting-drake-back.jpeg",
  },
  {
    name: "04 rending drake",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-04-rending-drake.jpeg",
  },
  {
    name: "04 rending drake",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-04-rending-drake-back.jpeg",
  },
  {
    name: "05 black imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-05-black-imp.jpeg",
  },
  {
    name: "05 black imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-05-black-imp-back.jpeg",
  },
  {
    name: "06 forest imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-06-forest-imp.jpeg",
  },
  {
    name: "06 forest imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-06-forest-imp-back.jpeg",
  },
  {
    name: "07 snow imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-07-snow-imp.jpeg",
  },
  {
    name: "07 snow imp",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-07-snow-imp-back.jpeg",
  },
  {
    name: "08 ooze",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-08-ooze.jpeg",
  },
  {
    name: "08 ooze",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-08-ooze-back.jpeg",
  },
  {
    name: "09 ruined machine",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-09-ruined-machine.jpeg",
  },
  {
    name: "09 ruined machine",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-09-ruined-machine-back.jpeg",
  },
  {
    name: "10 lightning eel",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-10-lightning-eel.jpeg",
  },
  {
    name: "10 lightning eel",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-10-lightning-eel-back.jpeg",
  },
  {
    name: "11 heroics",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-11-heroics.jpeg",
  },
  {
    name: "11 heroics",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-11-heroics-back.jpeg",
  },
  {
    name: "12 brummix",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-12-brummix.jpeg",
  },
  {
    name: "12 brummix",
    expansion: "Frosthaven",
    image: "pets/frosthaven/fh-12-brummix-back.jpeg",
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
  .filter((pets) => !pets.image.endsWith("back.jpeg"))
  .map((pet) => {
    let name = pet.name
      .split(" ")
      .slice(1)
      .map((w, i) => (i !== 0 && (w === "of" || w === "the") ? w : w.charAt(0).toUpperCase() + w.slice(1)));

    return {
      id: parseInt(pet.name.split(" ")[0], 10),
      name: name.join(" "),
      game: "fh",
      image: pet.image,
      imageBack: pet.image.replaceAll(".jpeg", "-back.jpeg"),
    };
  });

fs.writeFile("pet-cards.js", JSON.stringify(groupBy(pets, "game")), "utf8", () => console.log("pets", pets.length));
