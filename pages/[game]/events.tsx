import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessRook,
  faRoad,
  faShip,
  faStar,
  faSnowflake,
  faSun,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

import { eventSearchResults } from "../api/events";
import { useSpoilers } from "../../hooks/useSpoilers";
import { getCharacterColor, verifyQueryParam } from "../../common/helpers";
import { Event } from "../../common/types";

import CardList from "../../components/CardList";
import Layout from "../../components/Layout";

export type FilterOption = {
  id: string;
  icon: IconDefinition;
};

const eventTypeFilters: Record<string, FilterOption[]> = {
  gh: [
    { id: "city", icon: faChessRook },
    { id: "road", icon: faRoad },
    { id: "rift", icon: faStar },
  ],
  fh: [
    { id: "outpost", icon: faChessRook },
    { id: "road", icon: faRoad },
    { id: "boat", icon: faShip },
  ],
  jotl: [{ id: "city", icon: faChessRook }],
  cs: [
    { id: "city", icon: faChessRook },
    { id: "road", icon: faRoad },
  ],
  toa: [
    { id: "city", icon: faChessRook },
    { id: "road", icon: faRoad },
  ],
};

const seasonFilters: FilterOption[] = [
  { id: "summer", icon: faSun },
  { id: "winter", icon: faSnowflake },
];

const EventFilters = () => {
  const router = useRouter();
  const query = router.query;
  const game = verifyQueryParam(query.game, "gh");

  const handleEventTypeChange = (newEventType: string | null) => {
    query.eventType === newEventType
      ? delete query.eventType
      : (query.eventType = newEventType);
    router.push({
      pathname: "events",
      query: query,
    });
  };

  const handleSeasonChange = (newSeason: string | null) => {
    query.season === newSeason
      ? delete query.season
      : (query.season = newSeason);
    router.push({
      pathname: "events",
      query: query,
    });
  };

  return (
    <div className="button-group filters">
      {eventTypeFilters[game]?.map((eventType, idx) => (
        <div
          key={idx}
          className={`filter-icon ${
            query.eventType === eventType.id ? "filter-icon-selected" : ""
          }`}
          onClick={() => handleEventTypeChange(eventType.id)}
        >
          <FontAwesomeIcon className="filter-icon" icon={eventType.icon} />
        </div>
      ))}
      <span style={{ marginLeft: "16px" }} />
      {game === "fh" &&
        seasonFilters.map((season, idx) => (
          <div
            key={idx}
            className={`filter-icon ${
              query.season === season.id ? "filter-icon-selected" : ""
            }`}
            onClick={() => handleSeasonChange(season.id)}
          >
            <FontAwesomeIcon className="filter-icon" icon={season.icon} />
          </div>
        ))}
    </div>
  );
};

type PageProps = {
  searchResults: Event[];
};

const Events = ({ searchResults }: PageProps) => {
  const { spoilers } = useSpoilers();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      getCharacterColor(null)
    );
  }, []);

  const cardList = searchResults;

  return (
    <Layout>
      <div className="toolbar">
        <div className="toolbar-inner">
          <EventFilters />
        </div>
      </div>
      {!spoilers.loading && <CardList cardList={cardList} />}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchResults = await eventSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
};

export default Events;
