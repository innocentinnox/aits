import { LoginForm } from "@/components/auth/login-form";
import useUrlParams from "@/hooks/use-url-params";
import { Link } from "react-router-dom";

export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { constructPath } = useUrlParams();

  return (
<>
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="text-balance text-muted-foreground">
        Login to your AITS account
      </p>
    </div>
      <LoginForm />
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or
        </span>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to={constructPath("/auth/signup", {})} className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </>
  );
}
