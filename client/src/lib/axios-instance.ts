import { ACCESS_TOKEN } from "@/constants";
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Doc cookies", document.cookie)    
    const accessToken = Cookies.get(ACCESS_TOKEN);
    console.log("accessToken: ", accessToken);

    // const accessToken = JSON.parse(document.cookie || "").accessToken;

    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
