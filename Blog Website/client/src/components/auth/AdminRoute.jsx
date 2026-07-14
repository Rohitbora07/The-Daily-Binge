import { Navigate, Outlet } from "react-router-dom";
import userAuthStore from "../../store/authStore";

const AdminRoute = () => {
  const { user, isAuthenticated } = userAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;