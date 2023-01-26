import { DropdownOption } from "../common/types";

type DropdownProps = {
  onChange: (s: string) => void;
  options: DropdownOption[];
  value: string;
  width?: number;
};

export const DropdownNav = ({
  onChange,
  options,
  value,
  width,
}: DropdownProps) => {
  const handleOptionChange = (newOption: string) => {
    onChange(newOption);
  };

  const currentOption = options.find((o) => o.id === value)?.name || "Unknown";

  return (
    <div className="dropdownnav" style={{ width }}>
      <div className="dropdownnav-anchor">{currentOption}</div>
      <div className="dropdownnav-content">
        {options.map((opt, idx) => (
          <div
            key={idx}
            className="dropdownnav-option"
            onClick={() => handleOptionChange(opt.id)}
          >
            {opt.name}
          </div>
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
