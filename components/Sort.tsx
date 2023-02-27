import { useRouter } from "next/router";

import { Option } from "../common/types";
import { verifyQueryParam } from "../common/helpers";
import Dropdown from "../components/Dropdown";

type SortDirectionOption = {
  id: string;
  name: string;
};

const sortDirectionOptions: SortDirectionOption[] = [
  { id: "asc", name: "Asc" },
  { id: "desc", name: "Desc" },
];

type SortProps = {
  sortOrderOptions: Option[];
};

const Sort = ({ sortOrderOptions }: SortProps) => {
  const router = useRouter();
  const query = router.query;

  const handleSortOrderChange = (newOrder: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...query, order: newOrder },
    });
  };

  const handleSortDirectionChange = (newDirection: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...query, dir: newDirection },
    });
  };

  return (
    <div className="sort">
      <Dropdown
        onChange={handleSortOrderChange}
        options={sortOrderOptions}
        value={verifyQueryParam(query.order)}
      />
      <span style={{ marginRight: "8px" }}>:</span>
      <Dropdown
        onChange={handleSortDirectionChange}
        options={sortDirectionOptions}
        value={verifyQueryParam(query.dir)}
      />
    </div>
  );
};

export default Sort;
