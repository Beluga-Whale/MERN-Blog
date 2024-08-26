import { useAppSelector } from "../redux/hooks";
import { Outlet, Navigate } from "react-router-dom";

const AdminPrivateRoute = () => {
  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );
  return currentUser?.isAdmin || currentUserGoogle?.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default AdminPrivateRoute;
