import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

function optionToLabel(id, options) {
  return options.find((option) => id == option.id)?.name || options[0].name;
}

function Dropdown(params) {
  const { onChange, options, value } = params;
  const ref = useRef(null);

  const [open, setOpen] = useState(false);

  function toggleMenu() {
    setOpen(!open);
  }

  function handleOrderChange(newOrder) {
    setOpen(false);
    onChange(newOrder);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div ref={ref} className="dropdown">
      <div onClick={toggleMenu} className="dropdown-anchor">
        {optionToLabel(value, options)}
        <FontAwesomeIcon className="dropdown-arrow" icon={faAngleDown} />
      </div>
      <ul
        className="dropdown-content"
        style={{ display: open ? "block" : "none" }}
      >
        {options.map((sortOrder, idx) => (
          <li key={idx} onClick={() => handleOrderChange(sortOrder.id)}>
            {sortOrder.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;
