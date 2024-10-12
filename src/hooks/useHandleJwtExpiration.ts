import { AxiosError } from "axios";
import { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Swal, { SweetAlertIcon } from "sweetalert2";

export function useHandleJwtExpiration(error: Error | null) {
  const navigate = useNavigate();
  useEffect(() => {
    if (
      error &&
      error instanceof AxiosError &&
      error.response?.data?.message === "jwt_error"
    ) {
      forceUserToLogIn(navigate);
    }
  }, [error, navigate]);
}

export function forceUserToLogIn(
  navigate: NavigateFunction,
  message?: string,
  icon?: SweetAlertIcon | undefined
) {
  localStorage.removeItem("user");
  navigate("/login", { replace: true });
  Swal.fire({
    title: message || "Session expired. Please log in.",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: icon || "error",
    scrollbarPadding: false,
  });
}
