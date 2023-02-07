import { useEffect, useState } from "react";
import Link from "next/link";

import { Option } from "../common/types";

type DropdownProps = {
  onChange?: (s: string) => void;
  href?: (s: string) => string;
  options: Option[];
  value: string;
};

export const DropdownNav = ({ href, options, value }: DropdownProps) => {
  const [stopHover, setStopHover] = useState(false);

  // To force dropdown to disapear
  useEffect(() => setStopHover(false), [stopHover]);

  const currentOption = options.find((o) => o.id === value)?.name || "Unknown";

  return (
    <div className={`dropdownnav ${stopHover ? "" : "dropdownnav-hover"}`}>
      <div className="dropdownnav-anchor">{currentOption}</div>
      <div className="dropdownnav-content">
        {options.map((opt) => (
          <Link key={opt.id} href={href(opt.id)}>
            <a
              className="dropdownnav-option"
              onClick={() => setStopHover(true)}
            >
              {opt.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Dropdown = ({ onChange, options, value }: DropdownProps) => {
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="dropdown">
      <select
        className="dropdown-anchor"
        onChange={handleOptionChange}
        value={value}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
