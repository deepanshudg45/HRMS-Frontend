import { createContext, useMemo, useState } from "react";

type LoginPayload = {
  email: string;
  password: string;
};

type Employee = {
  email: string;
  employeeId: string;
};

type AuthContextValue = {
  employee: Employee | null;
  accessToken: string | null;
  role: string | null;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
};

const initialRole = localStorage.getItem("role") ?? import.meta.env.VITE_EMPLOYEE_ROLE ?? "HR";
const initialEmployeeId =
  localStorage.getItem("employeeId") ?? import.meta.env.VITE_EMPLOYEE_ID ?? "hr-admin";
const initialEmployeeEmail = localStorage.getItem("employeeEmail") ?? "";

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [employee, setEmployee] = useState<Employee | null>(
    initialEmployeeEmail
      ? {
          email: initialEmployeeEmail,
          employeeId: initialEmployeeId,
        }
      : null
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [role, setRole] = useState<string | null>(initialRole);

  const login = async (data: LoginPayload) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const employeeId = normalizedEmail.split("@")[0] || initialEmployeeId;
    const nextRole =
      normalizedEmail.includes("hr") || normalizedEmail.includes("admin") ? "HR" : "EMPLOYEE";
    const sessionToken = `local-session-${employeeId}`;

    localStorage.setItem("accessToken", sessionToken);
    localStorage.setItem("refreshToken", sessionToken);
    localStorage.setItem("employeeId", employeeId);
    localStorage.setItem("employeeEmail", normalizedEmail);
    localStorage.setItem("role", nextRole);

    setAccessToken(sessionToken);
    setEmployee({
      email: normalizedEmail,
      employeeId,
    });
    setRole(nextRole);
  };

  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setEmployee(null);
    setRole(null);
  };

  const refreshToken = async () => {
    const existingToken = localStorage.getItem("accessToken");

    if (!existingToken) {
      return;
    }

    setAccessToken(existingToken);
  };

  const value = useMemo(
    () => ({ employee, accessToken, role, login, logout, refreshToken }),
    [employee, accessToken, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
