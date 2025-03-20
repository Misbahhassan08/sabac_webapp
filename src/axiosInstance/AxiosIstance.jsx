import axios from "axios";
import urls from "../urls/urls";

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    console.error("No refresh token found");
    return null;
  }

  try {
    const response = await axios.post(urls.refreshToken, {
      refresh: refreshToken,
    });

    const { access, refresh } = response.data;

    localStorage.setItem("access_token", access);
    if (refresh) {
      localStorage.setItem("refresh_token", refresh);
    }

    return access;
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data);
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:7000",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("access_token");

    if (!token) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const currentPath = window.location.pathname; // Get current route

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } else {
        console.error("Session expired, redirecting to login...");

        // 🚨 Exclude /information from forced logout
        const guestRoutes = ["/information", "/guest-car-detail", "/guest-inspector-list"];
        if (!guestRoutes.includes(currentPath)) {
          logoutUser();
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);


const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

export default axiosInstance;