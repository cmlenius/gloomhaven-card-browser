import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

function Pagination(params) {
  const { onPageChange } = params;
  const router = useRouter();
  const query = router.query;

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={!query.page || query.page <= 0}
        onClick={() => onPageChange(query.page - 1)}
      >
        <FontAwesomeIcon className="pagination-icon" icon={faAngleLeft} />
        <span style={{ marginLeft: "4px" }}>Prev 30</span>
      </button>
      <button
        className="pagination-btn"
        onClick={() => onPageChange(query.page + 1)}
      >
        <span style={{ marginRight: "4px" }}>Next 30</span>
        <FontAwesomeIcon className="pagination-icon" icon={faAngleRight} />
      </button>
    </div>
  );
}

export default Pagination;
