import axiosInstance from "@/lib/axios-instance";

class AuthService {
    async signUp(formData: any) {
        return await axiosInstance.post("/auth/sign-up", { ...formData }, { withCredentials: true });
      }

    async login(formData: any) {
        /** Login simulation*/
        const delayPromise = new Promise<void>((resolve) => setTimeout(() => resolve() , 1500));
        await delayPromise;
        return { message: "Login successful" }
        /** End Login simulation*/

        // return await axiosInstance.post("/auth/login", { ...formData }, { withCredentials: true });
      }

    async logout() {
        return await axiosInstance.post("/auth/logout", { withCredentials: true } );
      }

    async verify(formData: any) {
        return await axiosInstance.post("/auth/verify", { ...formData }, { withCredentials: true }  );
      }

    async newPassword(formData: any) {
        return await axiosInstance.post("/auth/reset", { ...formData }, { withCredentials: true }   );
      }

    async newPassVerify(formData: any) {
        return await axiosInstance.post("/auth/reset/new-password", { ...formData }, { withCredentials: true }    );
      }

    async checkAuthStatus() {
      return await axiosInstance.get("/auth/status", { withCredentials: true }  );
    }
}

export const authService = new AuthService()