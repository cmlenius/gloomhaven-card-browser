import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSackDollar,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

function Search() {
  const router = useRouter();
  const query = router.query;

  const ref = useRef(null);
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (query.search && query.search !== search) {
      setSearch(query.search);
    }
  }, [query.search]);

  useEffect(() => {
    if (!ref.current) return;

    function handleEnterKey(event) {
      if (event.key === "Enter" && search !== query.search) {
        console.log(search, "searching");
        router.push({
          pathname: "/search",
          query: {
            search: search,
          },
        });
      }
    }

    ref.current.addEventListener("keypress", handleEnterKey);
    return () => {
      ref.current.removeEventListener("keypress", handleEnterKey);
    };
  }, [ref]);

  return (
    <div className="search">
      <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
      <input
        onChange={handleSearchChange}
        placeholder="Search for ability or item cards..."
        ref={ref}
        type="text"
        value={search}
      />
    </div>
  );
}

function TopBar() {
  return (
    <nav className="topbar">
      <div className="topbarInner">
        <img src="/logo.png" style={{ height: 40, width: 40 }} />
        <Search />
        <div className="header-links">
          <div className="header-link">
            <Link href="/characters">
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
        </div>
      </div>
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
