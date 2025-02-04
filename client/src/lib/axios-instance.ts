import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    
    // const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
