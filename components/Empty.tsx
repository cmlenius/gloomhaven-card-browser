import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Empty = () => {
  return (
    <div className="empty">
      <FontAwesomeIcon icon={faBan} height="48px" />
      <div>No Results</div>
      <div>Check your Settings for spoiler configuration or try changing your search & filters</div>
    </div>
  );
};

export default Empty;
