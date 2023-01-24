import type { NextApiRequest, NextApiResponse } from "next";

import { eventCards } from "../../data/event-cards";
import { customSort, verifyQueryParam } from "../../common/helpers";

export const eventSearchResults = async (query: {
  [key: string]: string | string[];
}) => {
  const game = verifyQueryParam(query.game, "gh");
  const order = verifyQueryParam(query.order, "id");
  const direction = verifyQueryParam(query.dir, "asc");
  const season = verifyQueryParam(query.season);
  let eventType = verifyQueryParam(query.eventType, "city");

  if (game === "fh" && eventType === "city") eventType = "outpost";

  return (
    eventCards[game]
      ?.filter((event) => {
        if (eventType && eventType !== "" && eventType !== event.eventType)
          return false;
        if (
          game === "fh" &&
          (eventType === "outpost" || eventType === "road") &&
          season &&
          season !== "" &&
          season !== event.season
        )
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
