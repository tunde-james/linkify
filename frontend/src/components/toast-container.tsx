import { useToastStore } from "../store/toast-store";
import Toast from "./toast";

const ToastContainer = () => {
  const { message, type, hideToast } = useToastStore();

  if (!message || !type) return null;

  return <Toast message={message} type={type} onClose={hideToast} />;
};

export default ToastContainer;
