import { authService } from "@/services";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  // withCredentials: true, // ensures cookies are sent with requests
});

// Optional: Attach the access token to headers if it's available (if not HTTP‑only)
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = authService.getAccessAndRefresh().access_token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 && !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Trigger the refresh token endpoint.
        // The refresh token should be stored in an HTTP‑only cookie,
        // so the request doesn't need to include it manually.
        await axiosInstance.post('/accounts/token/refresh/');
        // Retry the original request with the new access token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Optionally, redirect to the login page or clear user data if refresh fails
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
