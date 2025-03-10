import { UserDetailsForm } from "@/components/ui/form-user-details";
import Header from "@/layouts/Header";

function Details() {
  return (
    <div className="grid grid-rows-[auto_1fr]  overflow-hidden h-dvh ">
      <Header />

      <UserDetailsForm />
    </div>
  );
}
export default Details;
