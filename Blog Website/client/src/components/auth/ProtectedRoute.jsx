import { Navigate, Outlet } from "react-router-dom";
import userAuthStore from "../../store/authStore";

const ProtectedRoute = () => {
  const { user, isAuthenticated } = userAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;