import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faMagnifyingGlass,
  faSackDollar,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

import { useSpoilers } from "../hooks/useSpoilers";
import { characters } from "../data/common";
import SvgCharacterIcon from "../components/svg";

function Spoilers({ open, onClose }) {
  const { spoilers, updateSpoilers } = useSpoilers();

  function handleCharacterSpoilerToggle(id) {
    let newSet = spoilers.characters;
    if (spoilers.characters?.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    updateSpoilers({ ...spoilers, characters: newSet });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({ ...spoilers, characters: Array.from(newSet) })
    );
  }

  function handleCharacterSpoilerToggleAll() {
    let newSet = [];
    if (unlockabelClasses.some((c) => !spoilers.characters.has(c.id))) {
      newSet = unlockabelClasses.map((c) => c.id);
    }

    updateSpoilers({ ...spoilers, characters: new Set(newSet) });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        ...spoilers,
        characters: newSet,
      })
    );
  }

  const unlockabelClasses = characters.filter((c) => !c.base);

  return (
    <div>
      <div
        className="spoilers-overlay"
        onClick={onClose}
        style={{ width: open ? "100%" : 0 }}
      />
      <div className="spoilers" style={{ width: open ? "280px" : 0 }}>
        <div className="spoilers-inner">
          <h2>Spoilers</h2>
          <ul>
            <li className="spoiler-check-option">
              <input
                checked={unlockabelClasses.every((c) =>
                  spoilers.characters.has(c.id)
                )}
                onChange={handleCharacterSpoilerToggleAll}
                type="checkbox"
                style={{ accentColor: "#000000" }}
              />
              <h4 style={{ margin: "8px 4px" }}>Character Spoilers</h4>
            </li>
            {unlockabelClasses.map((char, idx) => (
              <li key={idx} className="spoiler-check-option">
                <input
                  checked={spoilers.characters.has(char.id)}
                  onChange={() => handleCharacterSpoilerToggle(char.id)}
                  style={{ accentColor: char.colour }}
                  type="checkbox"
                />
                <SvgCharacterIcon character={char.id} />
                <span>{char.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

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
  }, [search]);

  useEffect(() => {
    if (query.search && query.search !== search) {
      setSearch(query.search);
    }
  }, [query.search]);

  // TODO add listener to input element
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
  }, [handleSearch]);

  return (
    <div className="search">
      <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
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

function TopBar() {
  const [spoilerDrawerOpen, setSpoilerDrawerOpen] = useState(false);

  return (
    <nav className="topbar">
      <div className="topbarInner">
        <img src="/logo.png" style={{ height: 40, width: 40 }} />
        <Search />
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
          <div
            className="header-link"
            onClick={() => setSpoilerDrawerOpen(true)}
          >
            <span>
              <FontAwesomeIcon className="header-icon" icon={faEye} />
              <a>Spoilers</a>
            </span>
          </div>
        </div>
      </div>
      <Spoilers
        open={spoilerDrawerOpen}
        onClose={() => setSpoilerDrawerOpen(false)}
      />
    </nav>
  );
}

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>Gloomhaven Card Viewer</title>
        <meta name="description" content="Browse gloomhaven cards and data" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <TopBar />
      <main className="main">{children}</main>
    </div>
  );
}
