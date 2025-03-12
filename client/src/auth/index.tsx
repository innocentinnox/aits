export { useAuth } from "@/context/auth-context";
import { useAuth } from ".";

export const useCurrentUser = () => {
    const { user } = useAuth()
    return user
}