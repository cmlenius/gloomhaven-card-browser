import { useEffect, useState, ChangeEvent } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faSnowflake,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

import { eventSearchResults } from "../api/events";
import { useSpoilers } from "../../hooks/useSpoilers";
import { getCharacterColor, verifyQueryParam } from "../../common/helpers";
import { Event, Option } from "../../common/types";

import CardList from "../../components/CardList";
import Layout from "../../components/Layout";

type SeasonOption = {
  id: string;
  icon: IconDefinition;
};

const eventTypeFilters: Record<string, Option[]> = {
  gh: [
    { id: "city", name: "City" },
    { id: "road", name: "Road" },
    { id: "rift", name: "Rift" },
  ],
  fh: [
    { id: "outpost", name: "Outpost" },
    { id: "road", name: "Road" },
    { id: "boat", name: "Boat" },
  ],
  jotl: [{ id: "city", name: "City" }],
  cs: [
    { id: "city", name: "City" },
    { id: "road", name: "Road" },
  ],
  toa: [
    { id: "city", name: "City" },
    { id: "road", name: "Road" },
  ],
};

const seasonFilters: SeasonOption[] = [
  { id: "summer", icon: faSun },
  { id: "winter", icon: faSnowflake },
];

const EventFilters = () => {
  const router = useRouter();
  const query = router.query;
  const game = verifyQueryParam(query.game, "gh");
  const eventType = verifyQueryParam(query.eventType, "outpost");

  const handleEventTypeChange = (newEventType: string | null) => {
    console.log(newEventType);
    if (eventType === newEventType) return;
    router.push({
      pathname: "events",
      query: { ...query, eventType: newEventType },
    });
  };

  return (
    <div className="button-group-left">
      {eventTypeFilters[game]?.map((et) => (
        <button key={et.id} onClick={() => handleEventTypeChange(et.id)}>
          {et.name}
        </button>
      ))}
    </div>
  );
};

type PageProps = {
  searchResults: Event[];
};

const Events = ({ searchResults }: PageProps) => {
  const [search, setSearch] = useState(null);
  const { spoilers } = useSpoilers();
  const router = useRouter();
  const query = router.query;
  const game = verifyQueryParam(query.game, "gh");
  const season = verifyQueryParam(query.season);

  const handleSeasonChange = (newSeason: string | null) => {
    query.season === newSeason
      ? delete query.season
      : (query.season = newSeason);
    router.push({
      pathname: "events",
      query: query,
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      getCharacterColor(null)
    );
  }, []);

  const cardList = searchResults.filter((e) => !search || e.name === search);

  return (
    <Layout>
      <div className="toolbar">
        <div className="toolbar-inner">
          <EventFilters />
          <div
            className="flex"
            style={{ fontWeight: 600, justifyContent: "center" }}
          >
            {"Event ID:"}
            <input
              className="id-filter"
              onChange={handleSearchChange}
              type="number"
            />
          </div>
          {game === "fh" ? (
            <div
              className="button-group"
              style={{
                minWidth: 0,
              }}
            >
              {seasonFilters.map((s) => (
                <div
                  key={s.id}
                  className={`filter-icon ${
                    season === s.id ? "filter-icon-selected" : ""
                  }`}
                  onClick={() => handleSeasonChange(s.id)}
                  style={{ marginRight: "4px", padding: "4px 0" }}
                >
                  <FontAwesomeIcon icon={s.icon} />
                </div>
              ))}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
      {!spoilers.loading && <CardList cardList={cardList} showId />}
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
