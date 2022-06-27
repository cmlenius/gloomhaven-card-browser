import { useEffect } from "react";
import { useRouter } from "next/router";

import { itemSearchResults } from "./api/items";
import { useSpoilers } from "../hooks/useSpoilers";
import { colour } from "../data/common";

import CardList from "../components/CardList";
import Layout from "../components/Layout";
import Toolbar from "../components/Toolbar";

const sortOrderOptions = [
  { id: "id", name: "Item Number" },
  { id: "cost", name: "Cost" },
  { id: "name", name: "Name" },
];

const slotFilters = [
  { id: "head", name: "Head", icon: "/icons/equipment/head.png" },
  { id: "body", name: "Body", icon: "/icons/equipment/body.png" },
  { id: "1h", name: "1 Hand", icon: "/icons/equipment/1h.png" },
  { id: "2h", name: "2 Hands", icon: "/icons/equipment/2h.png" },
  { id: "legs", name: "Legs", icon: "/icons/equipment/legs.png" },
  { id: "small", name: "Small Item", icon: "/icons/equipment/small.png" },
];

const activationsFilters = [
  { id: "consumed", name: "Consumed", icon: "/icons/consumed.png" },
  { id: "spent", name: "Spent", icon: "/icons/spent.png" },
];

function ItemFilters() {
  const router = useRouter();
  const query = router.query;

  function handleSlotChange(newSlot) {
    query.slot === newSlot ? delete query.slot : (query.slot = newSlot);
    router.push({
      pathname: "/items",
      query: query,
    });
  }

  function handleActivationsChange(newActivations) {
    query.activations === newActivations
      ? delete query.activations
      : (query.activations = newActivations);
    router.push({
      pathname: "/items",
      query: query,
    });
  }

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
}

function Items({ searchResults }) {
  const { spoilers } = useSpoilers();

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colour(null));
  }, []);

  const cardList = searchResults?.filter((card) => {
    switch (card.source) {
      case "prosperity":
        return card.prosperity <= parseInt(spoilers.items.prosperity, 10);
      case "random-design":
        return spoilers.items.recipes;
      case "solo-scenario":
        return spoilers.items.solo;
      case "other":
        return spoilers.items.other;
      case "jotl":
        return true;
      case "jotl1":
        return spoilers.items.jotl1;
      case "jotl2":
        return spoilers.items.jotl2;
      case "jotl3":
        return spoilers.items.jotl3;
      default:
        return false;
    }
  });

  return (
    <Layout>
      <Toolbar
        Filters={ItemFilters}
        pathname="/items"
        sortOrderOptions={sortOrderOptions}
      />
      <CardList cardList={cardList || []} />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const searchResults = await itemSearchResults(context.query);

  return {
    props: {
      searchResults,
    },
  };
}

export default Items;
