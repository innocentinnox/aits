import axiosInstance from "@/lib/axios-instance";

class AuthService {
    async signUp(formData: any) {
        try{
          const response = await axiosInstance.post("/api/user/register/", { ...formData }, { withCredentials: false });
          console.log(response)
          return { message: "Account created successfully" }
        } catch(error: any){
          console.log(error.response.data)
          throw new Error("Something went wrong :(")
        }
      
      }

    async login(formData: any) {
        /** Login simulation*/
        // const delayPromise = new Promise<void>((resolve) => setTimeout(() => resolve() , 1500));
        // await delayPromise;
        // return { message: "Login successful" }
        /** End Login simulation*/

        try {
          const response = await axiosInstance.post("/api/token/", { ...formData }, { withCredentials: false });
          const tokens = response.data;
          localStorage.setItem("accessToken", tokens?.access);
          localStorage.setItem("refreshToken", tokens?.refresh);
          console.log(response)
          return { message: response?.data?.detail || "Logged in successfully" }
        } catch(error: any) {
          console.log(error.response.data)
          throw new Error(error.response.data.detail || "Something went wrong :(")
        }

      }

    async logout() {
        return await axiosInstance.post("/auth/logout", { withCredentials: true } );
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
      return await axiosInstance.get("/auth/status", { withCredentials: true }  );
    }
}

export const authService = new AuthService()