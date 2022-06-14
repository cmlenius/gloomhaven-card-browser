import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

function Pagination(params) {
  const { maxPageCount, onPageChange } = params;
  const router = useRouter();
  const page = parseInt(router.query?.page) || 1;
     
  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <FontAwesomeIcon className="pagination-icon" icon={faAngleLeft} />
        <span style={{ marginLeft: "4px" }}>Prev 30</span>
      </button>
      <button
        className="pagination-btn"
        disabled={page >= maxPageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <span style={{ marginRight: "4px" }}>Next 30</span>
        <FontAwesomeIcon className="pagination-icon" icon={faAngleRight} />
      </button>
    </div>
  );
}

export default Pagination;
