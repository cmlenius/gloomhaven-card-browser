import { useRouter } from "next/router";
import Dropdown from "../components/Dropdown";
import { SortOption } from "../common/types";

type SortDirectionOption = {
  id: string;
  name: string;
};

const sortDirectionOptions: SortDirectionOption[] = [
  { id: "asc", name: "Asc" },
  { id: "desc", name: "Desc" },
];

type ToolbarProps = {
  children: React.ReactNode;
  pathname: string;
  sortOrderOptions: SortOption[];
};

const Toolbar = ({ children, pathname, sortOrderOptions }: ToolbarProps) => {
  const router = useRouter();
  const query = router.query;

  const handleSortOrderChange = (newOrder: string) => {
    router.push({
      pathname: pathname,
      query: { ...query, order: newOrder },
    });
  };

  const handleSortDirectionChange = (newDirection: string) => {
    router.push({
      pathname: pathname,
      query: { ...query, dir: newDirection },
    });
  };

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
};

export default Toolbar;
