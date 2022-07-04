function Dropdown({ onChange, options, value }) {
   
  function handleOptionChange(event) {
    onChange(event.target.value);
  }

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
}

export default Dropdown;
