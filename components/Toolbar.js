import { useRouter } from "next/router";
import Dropdown from "../components/Dropdown";

const sortDirectionOptions = [
  { id: "asc", name: "Asc" },
  { id: "desc", name: "Desc" },
];

function Toolbar({ children, pathname, sortOrderOptions }) {
  const router = useRouter();
  const query = router.query;

  function handleSortOrderChange(newOrder) {
    router.push({
      pathname: pathname,
      query: { ...query, order: newOrder },
    });
  }

  function handleSortDirectionChange(newDirection) {
    router.push({
      pathname: pathname,
      query: { ...query, dir: newDirection },
    });
  }

  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        {sortOrderOptions && (
          <div className="sort">
            <Dropdown
              onChange={handleSortOrderChange}
              options={sortOrderOptions}
              value={query.order}
            />
            <span style={{ margin: "0 8px" }}>:</span>
            <Dropdown
              onChange={handleSortDirectionChange}
              options={sortDirectionOptions}
              value={query.dir}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default Toolbar;
