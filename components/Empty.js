import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

function Empty() {
  return (
    <div className="empty">
      <FontAwesomeIcon color="#721c24" icon={faBan} height="48px" />
      <div>No Results</div>
      <div>
        Check your spoiler settings or try changing your search & filters
      </div>
    </div>
  );
}

export default Empty;
