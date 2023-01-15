import type { NextApiRequest, NextApiResponse } from "next";

import { itemCards } from "../../data/item-cards";
import { customSort, verifyQueryParam } from "../../common/helpers";

export const itemSearchResults = async (query: {
  [key: string]: string | string[];
}) => {
  const game = verifyQueryParam(query.game, "gh");
  const order = verifyQueryParam(query.order, "id");
  const direction = verifyQueryParam(query.dir, "asc");
  const activations = verifyQueryParam(query.activations);
  const slot = verifyQueryParam(query.slot);

  return (
    itemCards[game]
      ?.filter((item) => {
        if (slot && item.slot !== slot) return false;
        if (activations === "consumed" && !item.consumed) return false;
        if (activations === "spent" && !item.spent) return false;
        return true;
      })
      .sort(customSort(order, direction)) || []
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const searchResults = await itemSearchResults(query);
  res.status(200).json({ searchResults: searchResults });
};

export default handler;
