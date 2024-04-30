import { Option } from "../common/types";
import { verifyQueryParam } from "../common/utils";
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
  handleSortOrderChange: (newValue: string) => void;
  handleSortDirectionChange: (newValue: string) => void;
  sortOrder: string;
  sortDirection: string;
};

const Sort = ({
  sortOrderOptions,
  handleSortOrderChange,
  handleSortDirectionChange,
  sortOrder,
  sortDirection,
}: SortProps) => {
  return (
    <div className="sort">
      <Dropdown onChange={handleSortOrderChange} options={sortOrderOptions} value={verifyQueryParam(sortOrder)} />
      <span style={{ marginRight: "8px" }}>:</span>
      <Dropdown
        onChange={handleSortDirectionChange}
        options={sortDirectionOptions}
        value={verifyQueryParam(sortDirection)}
      />
    </div>
  );
};

export default Sort;
