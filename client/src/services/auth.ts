import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import axiosInstance from "@/lib/axios-instance";
import Cookies from "js-cookie";
import { Cookie } from "lucide-react";
import { jwtDecode } from "jwt-decode"; // Correct default import
import { User } from "@/context/auth-context";

class AuthService {
  async signUp(formData: any) {
    console.log(formData);
    try {
      const response = await axiosInstance.post(
        "/accounts/signup/",
        { ...formData },
        { withCredentials: false }
      );
      console.log(response);
      return { ...response.data, message: "Account created successfully" };
    } catch (error: any) {
      console.log(error.response);
      throw new Error(
        error.response?.data?.message || "Something went wrong :("
      );
    }
  }

  storeAccessAndRefresh(access_tokens: string, refresh_token: string) {
    localStorage.setItem(ACCESS_TOKEN, access_tokens);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
    Cookies.set(ACCESS_TOKEN, access_tokens);
    Cookies.set(REFRESH_TOKEN, refresh_token);
  }

  storeAccess(access_tokens: string) {
    localStorage.setItem(ACCESS_TOKEN, access_tokens);
    Cookies.set(ACCESS_TOKEN, access_tokens);
  }

  getAccessAndRefresh() {
    return {
      access_token:
        Cookies.get(ACCESS_TOKEN) || localStorage.getItem(ACCESS_TOKEN),
      refresh_token:
        Cookies.get(REFRESH_TOKEN) || localStorage.getItem(REFRESH_TOKEN),
    };
  }

  deleteAccessAndRefresh() {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  async refreshAccessToken(): Promise<string | null> {
    const tokens = this.getAccessAndRefresh();
    const refreshToken = tokens?.refresh_token;
    if (!refreshToken) return null;

    try {
      const refreshResponse = await axiosInstance.post(
        "/accounts/token/refresh/",
        { refresh: refreshToken }
      );
      const newAccessToken = refreshResponse.data.access;
      this.storeAccess(newAccessToken);
      console.log(
        "Successfully refreshed access token via AuthService.refreshAccessToken()"
      );
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token", error);
      return null;
    }
  }

  // Method to check if the access token is valid, refresh it if necessary, and return it.
  async getValidAccessToken(): Promise<string | null> {
    const tokens = this.getAccessAndRefresh();
    let accessToken = tokens?.access_token;
    if (!accessToken) return null;

    try {
      const { exp } = jwtDecode<{ exp: number }>(accessToken);
      const now = Math.floor(Date.now() / 1000);
      const expiryDate = new Date(exp * 1000).toLocaleString();
      if (exp < now) {
        console.warn(`Access token expired at ${expiryDate}`);
        // Check refresh token
        const refreshToken = tokens?.refresh_token;
        if (refreshToken) {
          try {
            const { exp: refreshExp } = jwtDecode<{ exp: number }>(
              refreshToken
            );
            const refreshExpiryDate = new Date(
              refreshExp * 1000
            ).toLocaleString();
            if (refreshExp > now) {
              // Refresh token is valid; attempt refresh.
              const refreshResponse = await axiosInstance.post(
                "/accounts/token/refresh/",
                { refresh: refreshToken }
              );
              const newAccessToken = refreshResponse.data.access;
              this.storeAccess(newAccessToken);
              accessToken = newAccessToken;
              console.log("Successfully refreshed access token.");
            } else {
              console.warn(`Refresh token expired at ${refreshExpiryDate}`);
              return null;
            }
          } catch (err) {
            console.error("Failed to decode refresh token", err);
            return null;
          }
        }
      } else {
        console.log(`Access token will expire at ${expiryDate}`);
      }
    } catch (error) {
      console.error("Failed to decode access token", error);
      return null;
    }
    return accessToken;
  }

  async login(formData: any) {
    console.log("LOGIN_", formData);
    /** Login simulation*/
    // const delayPromise = new Promise<void>((resolve) => setTimeout(() => resolve() , 1500));
    // await delayPromise;
    // return { message: "Login successful" }
    /** End Login simulation*/

    try {
      const response = await axiosInstance.post(
        "/accounts/login/",
        { ...formData },
        { withCredentials: false }
      );
      const access_tokens = response.data.access;
      const refresh_token = response.data.refresh;

      if (access_tokens && refresh_token)
        this.storeAccessAndRefresh(access_tokens, refresh_token);
      console.log(response);
      return {
        user: response?.data?.user as User,
        message: response?.data?.message || "Logged in successfully",
        access_tokens,
        refresh_token,
        token_id: String(response?.data?.token_id) || null, 
      };
    } catch (error: any) {
      console.log(error.response.data);
      throw new Error(error.response?.data?.error || "Something went wrong :(");
    }
  }

  async logout() {
    this.deleteAccessAndRefresh();
    try {
      await axiosInstance.post("/accounts/logout/", { withCredentials: true });
      return { message: "Logged out successfully" };
    } catch (error: any) {
      console.log(error.response.data);
      throw new Error(
        error?.response?.data?.message || "Something went wrong :("
      );
    }
  }

  async verify(formData: any) {
    return { message: "Verification successful" };
    // return await axiosInstance.post(
    //   "/auth/verify",
    //   { ...formData },
    //   { withCredentials: true }
    // );
  }

  async newPassword(formData: any) {
    return {
      data: {
        tokenId: Math.random().toString(36).slice(2, 12),
        email: formData?.email,
      },
    };
    // return await axiosInstance.post("/auth/reset", { ...formData }, { withCredentials: true }   );
  }

  async newPassVerify(formData: any) {
    return await axiosInstance.post(
      "/auth/reset/new-password",
      { ...formData },
      { withCredentials: true }
    );
  }

  async checkAuthStatus() {
    return await axiosInstance.get("/accounts/status/", {
      withCredentials: true,
    });
  }
}

export const authService = new AuthService();
