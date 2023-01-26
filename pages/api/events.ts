import type { NextApiRequest, NextApiResponse } from "next";

import { eventCards } from "../../data/event-cards";
import { customSort, verifyQueryParam } from "../../common/helpers";

export const eventSearchResults = async (query: {
  [key: string]: string | string[];
}) => {
  const game = verifyQueryParam(query.game, "gh");
  const order = verifyQueryParam(query.order, "id");
  const direction = verifyQueryParam(query.dir, "asc");
  const eventType = verifyQueryParam(query.eventType, "city");
  const season = verifyQueryParam(query.season);

  return (
    eventCards[game]
      ?.filter((event) => {
        let et = event.eventType;
        if (et === "outpost") et = "city";

        if (eventType && eventType !== "" && eventType !== et) return false;
        if (game === "fh" && season && season !== "" && season !== event.season)
          return false;

        return true;
      })
      ?.sort(customSort(order, direction)) || []
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const searchResults = await eventSearchResults(query);
  res.status(200).json({ searchResults: searchResults });
};

export default handler;
