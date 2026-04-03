import { createContext, useState } from "react";
import api from "../lib/api";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [employee, setEmployee] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [role, setRole] = useState(null);

  const login = async (data: any) => {
    const res = await api.post("/auth/login", data);

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    setAccessToken(res.data.accessToken);
    setEmployee(res.data.employee);
    setRole(res.data.role);
  };

  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setEmployee(null);
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    const res = await api.post("/auth/refresh", { refreshToken });

    localStorage.setItem("accessToken", res.data.accessToken);
    setAccessToken(res.data.accessToken);
  };

  return (
    <AuthContext.Provider
      value={{ employee, accessToken, role, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};