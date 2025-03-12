import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import axiosInstance from "@/lib/axios-instance";
import Cookies from "js-cookie";
import { Cookie } from "lucide-react";

class AuthService {
    async signUp(formData: any) {
      console.log(formData);
        try {
          const response = await axiosInstance.post("/accounts/signup/", { ...formData }, { withCredentials: false });
          console.log(response)
          return { message: "Account created successfully" }
        } catch(error: any){
          console.log(error.response)
          throw new Error("Something went wrong :(")
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

    getAccessAndRefresh(){
      return {
        access_token:  Cookies.get(ACCESS_TOKEN) || localStorage.getItem(ACCESS_TOKEN),
        refresh_token: Cookies.get(REFRESH_TOKEN) || localStorage.getItem(REFRESH_TOKEN)
      }
    }

    deleteAccessAndRefresh(){
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
    }


    async login(formData: any) {
      console.log("LOGIN_", formData)
        /** Login simulation*/
        // const delayPromise = new Promise<void>((resolve) => setTimeout(() => resolve() , 1500));
        // await delayPromise;
        // return { message: "Login successful" }
        /** End Login simulation*/

        try {
          const response = await axiosInstance.post("/accounts/login/", { ...formData }, { withCredentials: false });
          const access_tokens = response.data.access;
          const refresh_token = response.data.refresh;

          if(access_tokens && refresh_token) this.storeAccessAndRefresh(access_tokens, refresh_token);
          console.log(response)
          return { user: response?.data?.user, message: response?.data?.message || "Logged in successfully", access_tokens, refresh_token }
        } catch(error: any) {
          console.log(error.response.data)
          throw new Error(error.response?.data?.error || "Something went wrong :(")
        }

      }

    async logout() {
        return await axiosInstance.post("/accounts/logout", { withCredentials: true } );
      }

    async verify(formData: any) {
        return await axiosInstance.post("/auth/verify", { ...formData }, { withCredentials: true }  );
      }

    async newPassword(formData: any) {
      return {data: { tokenId: Math.random().toString(36).slice(2, 12), email: formData?.email }}
        // return await axiosInstance.post("/auth/reset", { ...formData }, { withCredentials: true }   );
      }

    async newPassVerify(formData: any) {
        return await axiosInstance.post("/auth/reset/new-password", { ...formData }, { withCredentials: true }    );
      }

    async checkAuthStatus() {
      return await axiosInstance.get("/accounts/status/", { withCredentials: true }  );
    }
}

export const authService = new AuthService()