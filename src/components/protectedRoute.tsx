import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const ProtectedRoute = ({ children }: any) => {
  const { accessToken } = useContext(AuthContext);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;