import { Game, Option } from "../common/types";

const baseRoutes: Option[] = [
  { id: "characters", name: "Characters" },
  { id: "items", name: "Items" },
  { id: "events", name: "Events" },
  { id: "monsters", name: "Monsters" },
];

export const games: Game[] = [
  {
    id: "gh",
    name: "Gloomhaven",
    defaultClass: "BR",
    defaultMonster: "ancient-artillery",
    routes: baseRoutes,
  },
  {
    id: "gh2",
    name: "Gloomhaven 2nd Edition",
    defaultClass: "BR2",
    defaultMonster: "ancient-artillery",
    routes: baseRoutes,
  },
  {
    id: "fh",
    name: "Frosthaven",
    defaultClass: "BB",
    defaultMonster: "abael-herder",
    routes: baseRoutes.concat([
      { id: "buildings", name: "Buildings" },
      { id: "pets", name: "Pets" },
    ]),
  },
  {
    id: "jotl",
    name: "Jaws of the Lion",
    defaultClass: "DE",
    defaultMonster: "black-imp",
    routes: baseRoutes,
  },
  {
    id: "cs",
    name: "Crimson Scales",
    defaultClass: "BK",
    defaultMonster: "blood-ooze",
    routes: baseRoutes,
  },
  {
    id: "toa",
    name: "Trail of Ashes",
    defaultClass: "IN",
    defaultMonster: "harrower-bugflute",
    routes: baseRoutes,
  },
  {
    id: "cc",
    name: "Custom Content",
    defaultClass: "AM",
    defaultMonster: "N/A",
    routes: [{ id: "characters", name: "Characters" }],
  },
];
