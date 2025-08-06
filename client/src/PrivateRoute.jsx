import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const auth = useSelector((state) => state.auth);

  // Add loading state check
  if (auth.loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  // If user is logged in and is admin
  if (auth.token && auth.authUser?.role === "admin") {
    return <Outlet />;
  }

  // If not logged in or not admin, redirect
  return <Navigate to="/admin-login" />;
};

export default PrivateRoute;
