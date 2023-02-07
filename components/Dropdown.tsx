import { useState } from "react";
import Link from "next/link";

import { Option } from "../common/types";

type DropdownProps = {
  onChange?: (s: string) => void;
  href?: (s: string) => string;
  options: Option[];
  value: string;
};

export const DropdownNav = ({ href, options, value }: DropdownProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentOption = options.find((o) => o.id === value)?.name || "Unknown";

  return (
    <div
      className={`dropdownnav ${isHovered ? "dropdownnav-hover" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(true)}
    >
      <div className="dropdownnav-anchor">{currentOption}</div>
      <div className="dropdownnav-content" key={value}>
        {options.map((opt) => (
          <Link key={opt.id} href={href(opt.id)}>
            <a
              className="dropdownnav-option"
              onClick={(e) => {
                e.stopPropagation();
                setTimeout(() => setIsHovered(false), 200);
              }}
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
