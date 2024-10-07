import { AxiosError } from "axios";
import Swal from "sweetalert2";
import { getErrorMessage } from "./getErrorMessage";

export const showErrorToast = (err: Error) => {
  Swal.fire({
    toast: true,
    title:
      err instanceof AxiosError
        ? err.response?.data?.message
        : getErrorMessage(err),
    showConfirmButton: false,
    timer: 3000,
    position: "bottom-left",
    icon: "error",
    animation: false,
    background: document.documentElement.classList.contains("dark")
      ? "#20232a"
      : undefined,
  });
};
