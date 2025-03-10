import { Database } from "lucide-react";
import LogoIcon from "./LogoIcon";

function Logo() {
  const logoIcon = " w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem]";
  return (
    <div className="flex items-center gap-1 sm:p-4 sm:pl-0  ">
      <LogoIcon />

      <span className=" text-[1.2rem] font-semibold  md:text-[1.2rem] text-primary">
        AITS
      </span>
    </div>
  );
}

export default Logo;
