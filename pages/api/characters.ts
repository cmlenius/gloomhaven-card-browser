import type { NextApiRequest, NextApiResponse } from "next";

import { characterAbilityCards } from "../../data/character-ability-cards";
import {
  customSort,
  getDefaultCharacterClass,
  verifyQueryParam,
} from "../../common/helpers";

export const characterSearchResults = async (query: {
  [key: string]: string | string[];
}) => {
  const game = verifyQueryParam(query.game, "gh");
  const className = verifyQueryParam(
    query.class,
    getDefaultCharacterClass(game)
  );
  const order = verifyQueryParam(query.order, "level");
  const direction = verifyQueryParam(query.dir, "asc");

  return (
    characterAbilityCards[game]?.[className]?.sort(
      customSort(order, direction)
    ) || []
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const searchResults = await characterSearchResults(req.query);
  res.status(200).json({
    searchResults: searchResults,
  });
};

export default handler;
