import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function Modal({ content, open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClose]);

  return (
    <div className="modal" style={{ display: open ? "flex" : "none" }}>
      <div ref={ref} className="modal-content">
        {content}
        <div className="close" onClick={onClose}>
          <FontAwesomeIcon
            color="white"
            icon={faClose}
            height="28px"
            width="28px"
          />
        </div>
      </div>
    </div>
  );
}

export default Modal;
