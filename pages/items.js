import { useEffect } from "react";
import { useRouter } from "next/router";

import Dropdown from "../components/dropdown";
import Layout from "../components/layout";
import Pagination from "../components/pagination";
import { itemSearchResults } from "./api/items";
import {
  activationsFilters,
  baseUrl,
  slotFilters,
  optionToLabel,
  sortDirectionOptions,
  sortOrderOptions,
} from "../data/items";

function ItemFilters() {
  const router = useRouter();
  const query = router.query;

  function handleSlotChange(newSlot) {
    router.push({
      pathname: "/items",
      query: { ...query, slot: query.slot === newSlot ? undefined : newSlot },
    });
  }

  function handleActivationsChange(newActivations) {
    router.push({
      pathname: "/items",
      query: {
        ...query,
        activations: query.activations === newActivations ? undefined : newActivations,
      },
    });
  }

  return (
    <div className="item-filters">
      {slotFilters.map((slot, idx) => (
        <div
          key={idx}
          className={`item-icon ${
            query.slot === slot.id ? "item-icon-selected" : ""
          }`}
          onClick={() => handleSlotChange(slot.id)}
        >
          <img src={slot.icon} height="18px" width="18px" />
        </div>
      ))}
      <span style={{ marginLeft: "16px" }} />
      {activationsFilters.map((activations, idx) => (
        <div
          key={idx}
          className={`item-icon ${
            query.activations === activations.id ? "item-icon-selected" : ""
          }`}
          onClick={() => handleActivationsChange(activations.id)}
        >
          <img src={activations.icon} height="18px" width="18px" />
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

  function handlePageChange(newPage) {
    router.push({
      pathname: "/items",
      query: { ...query, page: newPage },
    });
  }

  return (
    <div className="toolbar">
      <div className="toolbarInner">
        <div>
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
        <Pagination onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

function Items({ searchResults }) {
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", "#473123");
  }, []);

  return (
    <Layout>
      <ItemsToolbar />
      <div className="cardList">
        {searchResults &&
          searchResults.map((card, idx) => (
            <div key={idx} className="card">
              <img className="card-img" src={baseUrl + card.image + ".png"} />
            </div>
          ))}
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="card" />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const searchResults = await itemSearchResults(context.query);

  return {
    props: {
      searchResults: [],
    },
  };
}

export default Items;
