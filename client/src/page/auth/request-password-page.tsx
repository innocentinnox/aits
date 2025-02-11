import { RequestResetPasswordForm } from "@/components/auth/request-password-reset-from";
import useUrlParams from "@/hooks/use-url-params";
import { Link } from "react-router-dom";

export function RequestPasswordPage({ className, ...props } : React.ComponentProps<"div">) {
  const { constructPath } = useUrlParams();

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-balance text-muted-foreground">
          Get Verification Code
        </p>
      </div>
      <RequestResetPasswordForm />
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <div className="text-center text-sm">
        Know password?{" "}
        <Link to={constructPath("/auth/login", {})} className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </>
  );
}
