import { Link, NavLink } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePopMenu } from "@/context/usePopMenu";

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
  return (
    <NavLink to={path}>
      <li
        className="flex items-center gap-2 py-3 pl-6 pr-4 text-zinc-900 hover:bg-zinc-200 hover:text-zinc-700 "
        onClick={() => {
          setIsMenuOpen(false);
        }}
      >
        <span>{icon}</span>
        <span className="text-[1rem] capitalize text-semibold"> {name}</span>
      </li>
    </NavLink>
  );
}
