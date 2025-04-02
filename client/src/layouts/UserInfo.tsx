import { useAuth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const { logout, user } = useAuth();

  const navigate = useNavigate();
  function handleDetailsNavigation() {
    navigate("details");
  }
  return (
    <div className="flex items-center justify-between gap-4 ">
      <div className="user-info text-zinc-600">
        <h2 className="font-semibold uppercase text-[0.8rem] sm:text-[1rem] ">
          {user?.first_name && user?.first_name}{" "}
          {user?.last_name && user?.last_name}
        </h2>
        <p className="uppercase text-right text-[0.6rem] sm:text-[0.8rem]">
          <span className="capitalize">{user?.role}</span> (
          {user?.college?.code && user?.college?.code})
        </p>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="w-[2.8rem] h-[2.8rem] bg-primary rounded-full flex items-center justify-center outline-none">
              <UserRound color="white" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDetailsNavigation}>
              Edit Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
