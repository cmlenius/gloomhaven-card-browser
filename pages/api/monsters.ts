import type { NextApiRequest, NextApiResponse } from "next";

import { monsterCards } from "../../data/monster-cards";
import { verifyQueryParam } from "../../common/helpers";

export const monsterSearchResults = async (query: {
  [key: string]: string | string[];
}) => {
  const game = verifyQueryParam(query.game, "gh");
  const monster = verifyQueryParam(query.monster, monsterCards[game]?.[0].id);

  return {
    monsterList:
      monsterCards[game]?.map((m) => ({ id: m.id, name: m.name })) || [],
    monster: monsterCards[game]?.find((m) => m.id === monster) || [],
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const searchResults = await monsterSearchResults(query);
  res.status(200).json({ searchResults: searchResults });
};

export default handler;
