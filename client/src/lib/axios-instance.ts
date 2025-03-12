import { PUBLIC_API_ROUTES } from "@/routes";
import { authService } from "@/services";
import axios from "axios";
import { matchPath } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  withCredentials: true, // ensures cookies are sent with requests
});

// Function to check if a route is public
const isPublicAPIRoute = (url?: string): boolean => {
  if (!url) return false;
  let pathname = url;
  try {
    const parsedUrl = new URL(url, window.location.origin);
    pathname = parsedUrl.pathname;
  } catch (e) {
    // If not absolute, assume it's a relative path.
  }
  return PUBLIC_API_ROUTES.some((pattern) => matchPath(pattern, pathname));
};


// Request interceptor to attach token (unless the route is public)
axiosInstance.interceptors.request.use(
  (config) => {
    if (isPublicAPIRoute(config.url)) return config;

    const accessToken = authService.getAccessAndRefresh()?.access_token;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor to handle token refresh.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (isPublicAPIRoute(originalRequest?.url)) {
      return Promise.reject(error);
    }
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (originalRequest.url.includes("/accounts/token/refresh/"))  return Promise.reject(error);
      
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosInstance.post("/accounts/token/refresh/");
        const newAccessToken = refreshResponse.data.access;
        authService.storeAccess(newAccessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
