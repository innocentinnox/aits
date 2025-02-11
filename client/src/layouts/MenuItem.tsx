import { Link, NavLink } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MenuItem({
  name,
  icon,

  path,
}: {
  name: string;
  icon: JSX.Element;

  path: string;
}) {
  if (path === "issues") {
    return (
      <li className=" group items-center gap-2  pl-6 pr-4 text-slate-200  ">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="">
              <span>{icon}</span>
              <span className="text-[1rem] capitalize text-semibold">
                {name}
              </span>
            </AccordionTrigger>
            <NavLink to="create">
              <AccordionContent className=" hover:bg-mainwhite hover:text-primary">
                Create An Issue
              </AccordionContent>
            </NavLink>
            <NavLink to="track">
              <AccordionContent className=" hover:bg-mainwhite hover:text-primary">
                Track status
              </AccordionContent>
            </NavLink>
          </AccordionItem>
        </Accordion>
      </li>
    );
  }
  return (
    <NavLink to={path}>
      <li className="flex items-center gap-2 py-3 pl-6 pr-4 text-slate-200 hover:bg-mainwhite hover:text-primary">
        <span>{icon}</span>
        <span className="text-[1rem] capitalize text-semibold"> {name}</span>
      </li>
    </NavLink>
  );
}
