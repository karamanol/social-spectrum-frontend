import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(
    function () {
      if (!currentUser) {
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    },
    [navigate, currentUser]
  );

  return currentUser ? children : null;
}
export default ProtectedRoute;
