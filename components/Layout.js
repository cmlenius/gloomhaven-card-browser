import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEye,
  faMagnifyingGlass,
  faScroll,
  faSackDollar,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

import { defaultClass } from "../data/utils";
import Dropdown from "./Dropdown";
import Spoilers from "./Spoilers";

const headerLinks = [
  { icon: faShield, label: "Characters", pathname: "/characters" },
  { icon: faSackDollar, label: "Items", pathname: "/items" },
  { icon: faScroll, label: "Mats", pathname: "/mats" },
];

const gameOptions = [
  { id: "gh", name: "Gloomhaven" },
  { id: "jotl", name: "Jaws of the Lion" },
  { id: "cs", name: "Crimson Scales" },
];

function Search() {
  const router = useRouter();
  const query = router.query;

  const [search, setSearch] = useState("");
  const ref = useRef();

  function handleSearchChange(e) {
    setSearch(e.target.value);
  }

  const handleSearch = useCallback(() => {
    if (search && search !== "" && search !== query.search) {
      router.push({
        pathname: "/search",
        query: {
          ...(query.game ? { game: query.game } : {}),
          search: search,
        },
      });
    }
  }, [query, router, search]);

  useEffect(() => {
    setSearch(query.search || "");
  }, [query.search]);

  useEffect(() => {
    if (!ref.current) return;

    function handleEnterKey(event) {
      if (event.key === "Enter") {
        handleSearch();
      }
    }
    ref?.current?.addEventListener("keypress", handleEnterKey);
    return () => {
      ref?.current?.removeEventListener("keypress", handleEnterKey);
    };
  }, [handleSearch, ref]);

  return (
    <div className="search">
      <FontAwesomeIcon
        className="search-icon"
        icon={faMagnifyingGlass}
        onClick={handleSearch}
      />
      <input
        ref={ref}
        onChange={handleSearchChange}
        placeholder="Search for ability or item cards..."
        type="text"
        value={search}
      />
    </div>
  );
}

function HeaderLinks({ openSpoilerDrawer }) {
  const router = useRouter();
  const query = router.query;

  return (
    <div className="header-links">
      {headerLinks.map((link, idx) => (
        <div key={idx} className="header-link">
          <Link
            href={{
              pathname: link.pathname,
              query: { game: query.game || "gh" },
            }}
          >
            <span>
              <FontAwesomeIcon className="header-icon" icon={link.icon} />
              <a>{link.label}</a>
            </span>
          </Link>
        </div>
      ))}
      <div className="header-link" onClick={openSpoilerDrawer}>
        <span>
          <FontAwesomeIcon className="header-icon" icon={faEye} />
          <a>Spoilers</a>
        </span>
      </div>
    </div>
  );
}

function TopBar({ openSpoilerDrawer }) {
  const router = useRouter();
  const query = router.query;
  const [hiddenLinksOpen, setHiddenLinksOpen] = useState(true);

  function handleHiddenLinksToggle() {
    setHiddenLinksOpen(!hiddenLinksOpen);
  }

  function handleGameChange(newGame) {
    let newQuery = { ...query, game: newGame };

    if (router.pathname === "/characters") {
      newQuery.class = defaultClass(newGame);
    }

    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  }

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <Dropdown
          className="game-picker"
          onChange={handleGameChange}
          options={gameOptions}
          value={query.game || "gh"}
          width="154px"
        />
        <Search />
        <div className="main-header-links">
          <HeaderLinks openSpoilerDrawer={openSpoilerDrawer} />
        </div>
        <div className="view-more" onClick={handleHiddenLinksToggle}>
          <FontAwesomeIcon className="header-icon" icon={faBars} />
        </div>
      </div>
      <div
        className="topbar-hidden-links"
        style={hiddenLinksOpen ? { height: "52px" } : {}}
      >
        <HeaderLinks openSpoilerDrawer={openSpoilerDrawer} />
      </div>
    </nav>
  );
}

export default function Layout({ children }) {
  const [spoilerDrawerOpen, setSpoilerDrawerOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Gloomhaven Cards</title>
        <meta
          name="description"
          content="Gloomhaven Cards is a tool for browsing and searching Gloomhaven cards."
        />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Spoilers
        open={spoilerDrawerOpen}
        onClose={() => setSpoilerDrawerOpen(false)}
      />
      <TopBar openSpoilerDrawer={() => setSpoilerDrawerOpen(true)} />
      <main className="main">{children}</main>
    </>
  );
}
