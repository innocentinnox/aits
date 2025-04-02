import { Link, NavLink } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePopMenu } from "@/context/usePopMenu";
import { NewIssueDialog } from "@/components/issues/issue-dialog";
import { useState } from "react";
import { useAuth } from "@/auth";

export default function MenuItem({
  name,
  icon,
  path,
  setIsMenuOpen,
}: {
  name: string;
  icon: any;
  setIsMenuOpen: any;
  path: string;
}) {
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const { logout } = useAuth();

  // Activate modal window
  if (path === "create")
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
  if (path === "logout")
    return (
      <li
        className="flex items-center gap-2 py-3 pl-6 pr-4 text-zinc-900 hover:bg-zinc-200 hover:text-zinc-700 "
        onClick={() => {
          // call logout function
          logout();
        }}
      >
        <span>{icon}</span>
        <span className="text-[1rem] capitalize text-semibold"> {name}</span>
      </li>
    );
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
