import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { isLogin, user, authLoading } = useSelector(
    (state) => state.user
  );

  // wait for verify() to finish
if (!authChecked || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }


  // not logged in
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  // logged in but not admin
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;