import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
} & React.PropsWithChildren;

const Modal = ({ children, open, onClose }: ModalProps) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event?.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClose]);

  return (
    <div className="modal" style={{ display: open ? "flex" : "none" }}>
      <div ref={ref} className="modal-content">
        {children}
        <div className="close" onClick={onClose}>
          <FontAwesomeIcon color="white" icon={faClose} height="28px" width="28px" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
