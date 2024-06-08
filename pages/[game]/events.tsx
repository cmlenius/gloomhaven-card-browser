import { IconDefinition, faSnowflake, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

import { eventSearchResults } from "../../common/search-results";
import { Event, GameParams, Option } from "../../common/types";
import { getCharacterColor, getTitle, isInRanges, parseRanges, verifyQueryParam } from "../../common/utils";
import CardList from "../../components/CardList";
import Layout from "../../components/Layout";
import { eventRoutes } from "../../data/routes";
import { useSpoilers } from "../../hooks/useSpoilers";

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

type EventFiltersProps = {
  eventTypeFilter: string;
  handleEventTypeFilterChange: (newValue: string) => void;
};

const EventFilters = ({ eventTypeFilter, handleEventTypeFilterChange }: EventFiltersProps) => {
  const router = useRouter();
  const query = router.query;
  const game = verifyQueryParam(query.game, "gh");

  return (
    <div className="button-group-left">
      {eventTypeFilters[game]?.map((et) => (
        <button
          key={et.id}
          className={eventTypeFilter === et.name.toLowerCase() ? "btn-selected" : ""}
          onClick={() => handleEventTypeFilterChange(et.id)}
        >
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
  const { spoilers } = useSpoilers();
  const router = useRouter();
  const query = router.query;
  const game = verifyQueryParam(query.game, "gh");

  const [search, setSearch] = useState(null);
  const [season, setSeason] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState(game === "fh" ? "outpost" : "city");

  const handleEventTypeFilterChange = (newEventType: string | null) => {
    if (eventTypeFilter === newEventType) return;
    setEventTypeFilter(newEventType);
  };

  const handleSeasonChange = (newSeason: string | null) => {
    if (query.season === newSeason) {
      setSeason(null);
    } else {
      setSeason(newSeason);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(parseRanges(e.target.value));
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", getCharacterColor(null));
  }, []);

  const cardList = searchResults?.filter((event) => {
    if (search !== null && !isInRanges(event.name, search)) return false;
    if (eventTypeFilter !== null && eventTypeFilter !== event.eventType) return false;
    if (
      game === "fh" &&
      (eventTypeFilter === "outpost" || eventTypeFilter === "road") &&
      season &&
      season !== "" &&
      season !== event.season
    )
      return false;

    return true;
  });

  return (
    <Layout title={getTitle(game, "Events")}>
      <div className="toolbar">
        <div className="toolbar-inner">
          <EventFilters eventTypeFilter={eventTypeFilter} handleEventTypeFilterChange={handleEventTypeFilterChange} />
          <div className="flex" style={{ fontWeight: 600, justifyContent: "center" }}>
            {"Event ID:"}
            <input className="id-filter" onChange={handleSearchChange} placeholder="1-10,15" />
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
                  className={`filter-icon ${season === s.id ? "filter-icon-selected" : ""}`}
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

export default Events;

export const getStaticPaths: GetStaticPaths<GameParams> = async () => {
  return eventRoutes;
};

export const getStaticProps: GetStaticProps<PageProps, GameParams> = async (context) => {
  const { game } = context.params;
  const searchResults = eventSearchResults({
    game: game,
  });

  return {
    props: {
      searchResults,
    },
  };
};
