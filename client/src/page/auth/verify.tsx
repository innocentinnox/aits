import VerificationFrom from "@/components/auth/verification-from";
import useUrlParams from "@/hooks/use-url-params";
import { Link } from "react-router-dom";

const Verify = () => {
  const { constructPath } = useUrlParams();

    return (<>
    <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Verification</h1>
        <p className="text-balance text-muted-foreground">
        A verification code was sent to your email
        </p>
    </div>
    <VerificationFrom />
    <div className="text-center text-sm">
       Didn't receive code?{" "}
        <Link to={constructPath("/auth/reset-password", {})} className="underline underline-offset-4">
          Request another
        </Link>
      </div>
    </>);
}
 
export default Verify;