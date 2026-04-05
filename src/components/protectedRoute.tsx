import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);

  if (!auth?.accessToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
