import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";

import { itemSearchResults } from "./api/items";
import { useSpoilers } from "../hooks/useSpoilers";
import {
  baseUrl,
  colour,
  optionToLabel,
  sortDirectionOptions,
} from "../data/common";

import Dropdown from "../components/dropdown";
import Layout from "../components/layout";

const rowsPerPage = 20;

const sortOrderOptions = [
  { id: "id", name: "Item Number" },
  { id: "cost", name: "Cost" },
  { id: "slot", name: "Equipment Slot" },
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
          <img src={slot.icon} />
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
          <img src={activations.icon} />
        </div>
      ))}
    </div>
  );
}

function ItemsToolbar() {
  const router = useRouter();
  const query = router.query;

  function handleSortOrderChange(newOrder) {
    router.push({
      pathname: "/items",
      query: { ...query, order: newOrder },
    });
  }

  function handleSortDirectionChange(newDirection) {
    router.push({
      pathname: "/items",
      query: { ...query, dir: newDirection },
    });
  }

  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        <div className="sort">
          <Dropdown
            onChange={handleSortOrderChange}
            options={sortOrderOptions}
            value={optionToLabel(query.order, sortOrderOptions)}
          />
          <span style={{ margin: "0 8px" }}>:</span>
          <Dropdown
            onChange={handleSortDirectionChange}
            options={sortDirectionOptions}
            value={optionToLabel(query.dir, sortDirectionOptions)}
          />
        </div>
        <ItemFilters />
      </div>
    </div>
  );
}

function Items({ searchResults }) {
  const { spoilers } = useSpoilers();
  const [items, setItems] = useState(searchResults.slice(0, rowsPerPage));

  function loadMore(page) {
    setItems(searchResults.slice(0, (page + 1) * rowsPerPage));
  }

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", colour(null));
  }, []);

  useEffect(() => {
    setItems(searchResults.slice(0, rowsPerPage));
  }, [searchResults]);

  return (
    <Layout>
      <ItemsToolbar />
      {searchResults && (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={items.length < searchResults.length}
          loader={<h4 key={0}>Loading...</h4>}
        >
          <div className="card-list">
            {items
              .filter((card) => {
                if (card.source === "Prosperity")
                  return (
                    card.prosperity <= parseInt(spoilers.items.prosperity, 10)
                  );
                if (card.source === "Random Item Design")
                  return spoilers.items.recipes;
                return spoilers.items.other;
              })
              .map((card, idx) => (
                <div key={idx} className="card">
                  <img className="card-img" src={baseUrl + card.image} />
                </div>
              ))}
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="card" />
            ))}
          </div>
        </InfiniteScroll>
      )}
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
