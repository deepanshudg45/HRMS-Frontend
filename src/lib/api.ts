import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Add token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle 401 error (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Call refresh API
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // Save new token
        localStorage.setItem("accessToken", newAccessToken);

        // Retry original request
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(error.config);
      } catch (err) {
        // If refresh fails → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;