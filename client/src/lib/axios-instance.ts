// In axios-instance.ts
import { PUBLIC_API_ROUTES, PUBLIC_ROUTES } from "@/routes";
import { authService } from "@/services";
import axios from "axios";
import { matchPath } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  withCredentials: true,
});

const currentRoute = window.location.pathname + window.location.search;
const isCurrentRoutePublic =  PUBLIC_ROUTES.some((pattern) => matchPath(pattern, currentRoute))

// Function to check if a route is public
const isPublicAPIRoute = (url?: string): boolean => {
  if (!url) return false;
  let pathname = url;
  try {
    const parsedUrl = new URL(url, window.location.origin);
    pathname = parsedUrl.pathname;
  } catch (e) {
    // Assume it's a relative path.
  }
  return PUBLIC_API_ROUTES.some((pattern) => matchPath(pattern, pathname));
};




// Request interceptor remains unchanged (or uses our getValidAccessToken method)
axiosInstance.interceptors.request.use(
  async (config) => {
    if (isPublicAPIRoute(config.url)) return config;

    const accessToken = await authService.getValidAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor now uses refreshAccessToken for separation of concern.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (isPublicAPIRoute(originalRequest?.url)) return Promise.reject(error)
    if (isCurrentRoutePublic) return Promise.reject(error); // Prevent redirect loop on public routes

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // Prevent infinite loop if refresh fails.
      if (originalRequest.url.includes("/accounts/token/refresh/")) {
        // Redirect to login page when refresh token fails
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      try {
        const newAccessToken = await authService.refreshAccessToken();
        if (newAccessToken) {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return axiosInstance(originalRequest);
        } else {
          // No access token available after refresh attempt
          window.location.href = '/auth/login';
        }
      } catch (refreshError) {
        // Handle refresh token error
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
