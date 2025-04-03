import { LogOut } from "lucide-react";

function LogoutButton({
  handler,
  name,
}: {
  handler: Function;
  name: string | undefined;
}) {
  return (
    <li
      className={
        `${
          !name
            ? ""
            : "py-3 pl-6 pr-4 text-zinc-900 hover:bg-zinc-200 hover:text-zinc-700"
        }` + " flex items-center gap-2  cursor-pointer "
      }
      onClick={() => {
        // call logout function
        handler();
      }}
    >
      <span>
        <LogOut size={!name ? 16 : 24} />
      </span>
      <span
        className={` ${
          !name ? "text-[14px]" : "text-[1rem]"
        } capitalize text-semibold `}
      >
        {name || "Logout"}
      </span>
    </li>
  );
}
export default LogoutButton;
