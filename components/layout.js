import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEye,
  faMagnifyingGlass,
  faSackDollar,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

import Spoilers from "../components/spoilers";

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
          search: search,
        },
      });
    }
  }, [query.search, router, search]);

  useEffect(() => {
    setSearch(query.search);
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
  return (
    <div className="header-links">
      <div className="header-link">
        <Link href="/characters?class=BR">
          <span>
            <FontAwesomeIcon className="header-icon" icon={faShield} />
            <a>Characters</a>
          </span>
        </Link>
      </div>
      <div className="header-link">
        <Link href="/items">
          <span>
            <FontAwesomeIcon className="header-icon" icon={faSackDollar} />
            <a>Items</a>
          </span>
        </Link>
      </div>
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
  const [hiddenLinksOpen, setHiddenLinksOpen] = useState(true);

  function handleHiddenLinksToggle() {
    setHiddenLinksOpen(!hiddenLinksOpen);
  }

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <img
          alt=""
          src="/logo.png"
          style={{ cursor: "pointer", height: 40, width: 40 }}
          onClick={() => {
            router.push({
              pathname: "/characters",
            });
          }}
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
        <title>Gloomhaven Card Viewer</title>
        <meta name="description" content="Browse gloomhaven cards and data" />
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
