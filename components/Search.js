import { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

function Search({ searchCallback }) {
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

    if (searchCallback) searchCallback();
  }, [query, router, search, searchCallback]);

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

export default Search;
