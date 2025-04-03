import { Link, NavLink } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePopMenu } from "@/context/usePopMenu";
import { NewIssueDialog } from "@/components/issues/issue-dialog";
import { ReactElement, useState } from "react";
import { useAuth } from "@/auth";
import LogoutButton from "./LogoutButton";

export default function MenuItem({
  name,
  icon,
  path,
  setIsMenuOpen,
}: {
  name: string;
  icon: ReactElement;
  setIsMenuOpen: any;
  path: string;
}) {
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const { logout } = useAuth();

  // Activate modal window
  if (path.includes("create"))
    return (
      <>
        <NewIssueDialog
          open={showIssueDialog}
          onOpenChange={setShowIssueDialog}
          showTrigger={false}
        />
        <li
          className="flex items-center gap-2 py-3 pl-6 pr-4 text-zinc-900 hover:bg-zinc-200 hover:text-zinc-700 "
          onClick={() => {
            // close menu
            setIsMenuOpen?.(false);
            // open modal window
            setShowIssueDialog((val) => !val);
          }}
        >
          <span>{icon}</span>
          <span className="text-[1rem] capitalize text-semibold"> {name}</span>
        </li>
      </>
    );
  //Activate logout function
  if (path.includes("logout"))
    return <LogoutButton handler={() => logout()} name={name} />;
  return (
    <>
      <NavLink to={path}>
        <li
          className="flex items-center gap-2 py-3 pl-6 pr-4 text-zinc-900 hover:bg-zinc-200 hover:text-zinc-700 "
          onClick={() => {
            setIsMenuOpen?.(false);
          }}
        >
          <span>{icon}</span>
          <span className="text-[1rem] capitalize text-semibold"> {name}</span>
        </li>
      </NavLink>
    </>
  );
}
