import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { isLogin, user } = useSelector((state) => state.user);

  // not logged in → go to login
  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  // logged in but not admin → block
  if (!user?.isAdmin) {
    return <Navigate to="/" />; // or /profile
  }

  // admin → allow access
  return children;
};

export default AdminRoute;