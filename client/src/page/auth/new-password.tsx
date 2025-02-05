import { NewPasswordForm } from "@/components/auth/new-password-form";
import VerificationFrom from "@/components/auth/verification-from";
import useUrlParams from "@/hooks/use-url-params";
import { Link } from "react-router-dom";

const NewPasswordPage = () => {
  const { constructPath } = useUrlParams();

    return (<>
    <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">New Password</h1>
        <p className="text-balance text-muted-foreground">
        Create your new password below.
        </p>
    </div>
    <NewPasswordForm />
    <div className="text-center text-sm">
       No longer want to change password?{" "}
        <Link to={constructPath("/auth/login", {})} className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </>);
}
 
export default NewPasswordPage;