import { useAppSelector } from "../redux/hooks";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );
  return currentUser || currentUserGoogle ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default PrivateRoute;
