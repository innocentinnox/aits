import { Link } from "react-router-dom";
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
            <AccordionContent>Create An Issue</AccordionContent>
            <AccordionContent>Track status</AccordionContent>
          </AccordionItem>
        </Accordion>
      </li>
    );
  }
  return (
    <Link to={path}>
      <li className="flex items-center gap-2 py-3 pl-6 pr-4 text-slate-200 hover:bg-mainwhite hover:text-primary">
        <span>{icon}</span>
        <span className="text-[1rem] capitalize text-semibold"> {name}</span>
      </li>
    </Link>
  );
}
