import { useEffect, useState, ChangeEvent } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { itemSearchResults } from "../api/items";
import { useSpoilers } from "../../hooks/useSpoilers";
import {
  getBaseUrl,
  getCharacterColor,
  getDescription,
  getTitle,
  isInRanges,
  itemSpoilerFilter,
  parseRanges,
  verifyQueryParam,
} from "../../common/helpers";
import { Item, Option } from "../../common/types";

import CardList from "../../components/CardList";
import Layout from "../../components/Layout";
import Sort from "../../components/Sort";

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

const ItemFilters = () => {
  const router = useRouter();
  const query = router.query;

  const handleSlotChange = (newSlot: string | null) => {
    query.slot === newSlot ? delete query.slot : (query.slot = newSlot);
    router.push({
      pathname: "items",
      query: query,
    });
  };

  const handleActivationsChange = (newActivations: string | null) => {
    query.activations === newActivations
      ? delete query.activations
      : (query.activations = newActivations);
    router.push({
      pathname: "items",
      query: query,
    });
  };

  return (
    <div className="button-group filters">
      {slotFilters.map((slot, idx) => (
        <div
          key={idx}
          className={`filter-icon ${
            query.slot === slot.id ? "filter-icon-selected" : ""
          }`}
          onClick={() => handleSlotChange(slot.id)}
        >
          <img alt="" src={getBaseUrl() + `icons/items/${slot.id}.png`} />
        </div>
      ))}
      <span style={{ marginLeft: "16px" }} />
      {activationsFilters.map((activation, idx) => (
        <div
          key={idx}
          className={`filter-icon ${
            query.activations === activation.id ? "filter-icon-selected" : ""
          }`}
          onClick={() => handleActivationsChange(activation.id)}
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
  const { spoilers } = useSpoilers();

  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(parseRanges(e.target.value));
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      getCharacterColor(null)
    );
  }, []);

  const cardList = searchResults
    ?.filter(itemSpoilerFilter(spoilers))
    .filter((i) => !search || isInRanges(i.id, search));

  return (
    <Layout
      description={getDescription(game, "Item Cards", searchResults)}
      title={getTitle(game, "Items")}
    >
      <div className="toolbar">
        <div className="toolbar-inner">
          <Sort sortOrderOptions={sortOrderOptions} />
          <div
            className="flex"
            style={{ fontWeight: 600, justifyContent: "center" }}
          >
            {"Item ID:"}
            <input
              className="id-filter"
              onChange={handleSearchChange}
              placeholder="1-10,15"
            />
          </div>
          <ItemFilters />
        </div>
      </div>
      {!spoilers.loading && <CardList cardList={cardList} showId />}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchResults = await itemSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
};

export default Items;
