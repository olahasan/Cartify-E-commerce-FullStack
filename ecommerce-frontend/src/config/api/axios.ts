import axios from "axios";
import { eventBus } from "@app/eventBus";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/EcommerceAPI`,
  headers: { "Content-Type": "application/json" },
});

// ======= Get Token Safely =======
const getToken = () => {
  try {
    const persistRoot = localStorage.getItem("persist:root");
    if (!persistRoot) return null;

    const root = JSON.parse(persistRoot);
    const auth = JSON.parse(root.auth || "{}");

    return auth?.LoginReturn?.token || null;
  } catch {
    return null;
  }
};

// ======= Request Interceptor =======
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ======= Response Interceptor =======
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const requestUrl = error.config?.url || "";

      if (currentPath === "/login" || requestUrl.includes("/Login"))
        return Promise.reject(error);

      eventBus.triggerLogout();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
