import { PUBLIC_API_ROUTES } from "@/routes";
import { authService } from "@/services";
import axios from "axios";
import { matchPath } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  withCredentials: true, // ensures cookies are sent with requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Extract pathname from URL—this handles both relative and absolute URLs.
    let pathname = config.url || "";
    try {
      // If config.url is an absolute URL, extract the pathname
      const parsedUrl = new URL(config.url!, window.location.origin);
      pathname = parsedUrl.pathname;
    } catch (e) {
      // Otherwise, we assume config.url is already a relative path
    }

    console.log("Pathname", pathname)
    
    // Check if the current request is a public route using matchPath.
    const isPublic = PUBLIC_API_ROUTES.some((pattern) => {
      // matchPath returns non-null if the pathname matches the given pattern.
      return matchPath(pattern, pathname);
    });

    if (isPublic) {
      // Skip attaching the token if the route is public.
      return config;
    }

    // Otherwise, attach the token if available.
    const accessToken = authService.getAccessAndRefresh().access_token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (originalRequest.url.includes("/accounts/token/refresh/")) {
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosInstance.post("/accounts/token/refresh/");
        
        const newAccessToken = refreshResponse.data.access;
        authService.storeAccess(newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
