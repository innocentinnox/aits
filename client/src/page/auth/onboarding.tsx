import { useCurrentUser } from "@/auth";
import { OnboardingForm } from "@/components/auth/onboarding/onboarding-form";
import useUrlParams from "@/hooks/use-url-params";

const OnboardingPage = () => {
  const { constructPath } = useUrlParams();
    const user = useCurrentUser();
    return (<>
    <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">New Password</h1>
        <p className="text-balance text-muted-foreground">
        Create your new password below.
        </p>
    </div>
    <OnboardingForm role={user?.role!} onSubmit={(v) => console.log("Values: ", v)}/>
    </>);
}
 
export default OnboardingPage;