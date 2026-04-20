type ToastMessageProps = {
  message: string | null;
  colour?: string;
};

const ToastMessage = ({ message, colour }: ToastMessageProps) => {
  if (!message) return null;

  return (
    <div
      className="toast-message"
      style={{ borderColor: colour || "gold" }}
    >
      {message}
    </div>
  );
};

export default ToastMessage;
