import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { itemSearchResults } from "../api/items";
import { useSpoilers } from "../../hooks/useSpoilers";
import { getCharacterColor, itemSpoilerFilter } from "../../common/helpers";
import { FilterOption, Item, SortOption } from "../../common/types";

import CardList from "../../components/CardList";
import Layout from "../../components/Layout";
import Toolbar from "../../components/Toolbar";

const sortOrderOptions: SortOption[] = [
  { id: "id", name: "Item Number" },
  { id: "cost", name: "Cost" },
  { id: "name", name: "Name" },
];

const slotFilters: FilterOption[] = [
  { id: "head", name: "Head", icon: "/icons/equipment/head.png" },
  { id: "body", name: "Body", icon: "/icons/equipment/body.png" },
  { id: "1h", name: "1 Hand", icon: "/icons/equipment/1h.png" },
  { id: "2h", name: "2 Hands", icon: "/icons/equipment/2h.png" },
  { id: "legs", name: "Legs", icon: "/icons/equipment/legs.png" },
  { id: "small", name: "Small Item", icon: "/icons/equipment/small.png" },
];

const activationsFilters: FilterOption[] = [
  { id: "consumed", name: "Consumed", icon: "/icons/consumed.png" },
  { id: "spent", name: "Spent", icon: "/icons/spent.png" },
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
    <div className="filters">
      {slotFilters.map((slot, idx) => (
        <div
          key={idx}
          className={`filter-icon ${
            query.slot === slot.id ? "filter-icon-selected" : ""
          }`}
          onClick={() => handleSlotChange(slot.id)}
        >
          <img alt="" src={slot.icon} />
        </div>
      ))}
      <span style={{ marginLeft: "16px" }} />
      {activationsFilters.map((activations, idx) => (
        <div
          key={idx}
          className={`filter-icon ${
            query.activations === activations.id ? "filter-icon-selected" : ""
          }`}
          onClick={() => handleActivationsChange(activations.id)}
        >
          <img alt="" src={activations.icon} />
        </div>
      ))}
    </div>
  );
};

type PageProps = {
  searchResults: Item[];
};

const Items = ({ searchResults }: PageProps) => {
  const { spoilers } = useSpoilers();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      getCharacterColor(null)
    );
  }, []);

  const cardList = searchResults?.filter(itemSpoilerFilter(spoilers));

  return (
    <Layout>
      <Toolbar pathname="items" sortOrderOptions={sortOrderOptions}>
        <ItemFilters />
      </Toolbar>
      {!spoilers.loading && <CardList cardList={cardList} />}
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
