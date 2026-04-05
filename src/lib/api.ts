import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role") ?? import.meta.env.VITE_EMPLOYEE_ROLE ?? "HR";
  const employeeId =
    localStorage.getItem("employeeId") ?? import.meta.env.VITE_EMPLOYEE_ID ?? "hr-admin";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["X-Role"] = role;
  config.headers["X-Employee-ID"] = employeeId;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(error.config);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
