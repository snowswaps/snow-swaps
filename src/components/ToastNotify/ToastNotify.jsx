import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastNotify(message) {
  toast.configure();
  console.log(message);

  toast.success(JSON.stringify(message), {
    position: toast.POSITION.TOP_CENTER,
  });
}
