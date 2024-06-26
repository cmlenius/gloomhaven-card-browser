import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

import { GameParams, Item, Option, Spoilers } from "../../common/types";
import {
  customSort,
  getBaseUrl,
  getDescription,
  getPageColor,
  getTitle,
  isInRanges,
  parseRanges,
  verifyQueryParam,
} from "../../common/utils";
import CardList from "../../components/CardList";
import Layout from "../../components/Layout";
import Sort from "../../components/Sort";
import { games } from "../../data/games";
import { itemCards } from "../../data/item-cards";
import { useSpoilers } from "../../hooks/useSpoilers";

const sortOrderOptions: Option[] = [
  { id: "id", name: "Item Number" },
  { id: "cost", name: "Cost" },
  { id: "name", name: "Name" },
];

const slotFilters: Option[] = [
  { id: "head", name: "Head" },
  { id: "body", name: "Body" },
  { id: "1h", name: "1 Hand" },
  { id: "2h", name: "2 Hands" },
  { id: "legs", name: "Legs" },
  { id: "small", name: "Small Item" },
];

const activationsFilters: Option[] = [
  { id: "consumed", name: "Consumed" },
  { id: "spent", name: "Spent" },
];

const itemSpoilerFilter = (spoilers: Spoilers): ((item: Item) => boolean) => {
  return (card) => {
    switch (card.source) {
      case "prosperity":
        return card.prosperity <= parseInt(String(spoilers.items.prosperity), 10);
      case "random-design":
        return !!spoilers.items.recipes;
      case "solo-scenario":
        return !!spoilers.items.solo;
      case "other":
        return !!spoilers.items.other;
      case "fc":
        return !!spoilers.items.fc;
      case "jotl":
        return true;
      case "jotl1":
        return !!spoilers.items.jotl1;
      case "jotl2":
        return !!spoilers.items.jotl2;
      case "jotl3":
        return !!spoilers.items.jotl3;
      case "cs":
      case "toa":
      case "fh":
        return true;
      default:
        return false;
    }
  };
};

type FilterProps = {
  activationFilter: string;
  slotFilter: string;
  handleActivationFilterChange: (newValue: string) => void;
  handleSlotFilterChange: (newValue: string) => void;
};

const ItemFilters = ({
  activationFilter,
  slotFilter,
  handleActivationFilterChange,
  handleSlotFilterChange,
}: FilterProps) => {
  return (
    <div className="button-group filters">
      {slotFilters.map((slot, idx) => (
        <div
          key={idx}
          className={`filter-icon ${slotFilter === slot.id ? "filter-icon-selected" : ""}`}
          onClick={() => handleSlotFilterChange(slot.id)}
        >
          <img alt="" src={getBaseUrl() + `icons/items/${slot.id}.png`} />
        </div>
      ))}
      <span style={{ marginLeft: "16px" }} />
      {activationsFilters.map((activation, idx) => (
        <div
          key={idx}
          className={`filter-icon ${activationFilter === activation.id ? "filter-icon-selected" : ""}`}
          onClick={() => handleActivationFilterChange(activation.id)}
        >
          <img alt="" src={getBaseUrl() + `icons/items/${activation.id}.png`} />
        </div>
      ))}
    </div>
  );
};

type PageProps = {
  searchResults: Item[];
};

const Items = ({ searchResults }: PageProps) => {
  const [search, setSearch] = useState(null);
  const [slotFilter, setSlotFilter] = useState(null);
  const [activationFilter, setActivationFilter] = useState(null);
  const [sortOrder, setsortOrder] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const { spoilers } = useSpoilers();

  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(parseRanges(e.target.value));
  };
  const handleSlotFilterChange = (newValue: string) => {
    if (newValue === slotFilter) {
      setSlotFilter(null);
    } else {
      setSlotFilter(newValue);
    }
  };
  const handleActivationFilterChange = (newValue: string) => {
    if (newValue === activationFilter) {
      setActivationFilter(null);
    } else {
      setActivationFilter(newValue);
    }
  };
  const handleSortOrderChange = (newValue: string) => {
    setsortOrder(newValue);
  };
  const handleSortDirectionChange = (newValue: string) => {
    setSortDirection(newValue);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", getPageColor(null));
  }, []);

  const cardList =
    searchResults
      ?.filter(itemSpoilerFilter(spoilers))
      .filter((item) => {
        if (search !== null && !isInRanges(item.id, search)) return false;
        if (slotFilter && item.slot !== slotFilter) return false;
        if (activationFilter === "consumed" && !item.consumed) return false;
        if (activationFilter === "spent" && !item.spent) return false;
        return true;
      })
      .sort(customSort(sortOrder || "id", sortDirection || "asc")) || [];

  return (
    <Layout description={getDescription(game, "Item Cards", searchResults)} title={getTitle(game, "Items")}>
      <div className="toolbar">
        <div className="toolbar-inner">
          <Sort
            sortOrderOptions={sortOrderOptions}
            handleSortOrderChange={handleSortOrderChange}
            handleSortDirectionChange={handleSortDirectionChange}
            sortOrder={sortOrder}
            sortDirection={sortDirection}
          />
          <div className="flex" style={{ fontWeight: 600, justifyContent: "center" }}>
            {"Item ID:"}
            <input className="id-filter" onChange={handleSearchChange} placeholder="1-10,15" />
          </div>
          <ItemFilters
            activationFilter={activationFilter}
            slotFilter={slotFilter}
            handleActivationFilterChange={handleActivationFilterChange}
            handleSlotFilterChange={handleSlotFilterChange}
          />
        </div>
      </div>
      {!spoilers.loading && <CardList cardList={cardList} showId />}
    </Layout>
  );
};

export default Items;

export const getStaticPaths: GetStaticPaths<GameParams> = async () => {
  return {
    fallback: false,
    paths: games.map((game) => ({
      params: {
        game: game.id,
      },
    })),
  };
};

const itemSearchResults = (query: { [key: string]: string | string[] }) => {
  const game = verifyQueryParam(query.game, "gh");
  return itemCards[game]?.sort(customSort("id", "asc")) || [];
};

export const getStaticProps: GetStaticProps<PageProps, GameParams> = async (context) => {
  const { game } = context.params;
  const searchResults = itemSearchResults({
    game: game,
  });

  return {
    props: {
      searchResults,
    },
  };
};
