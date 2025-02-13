import { Database } from "lucide-react";

function Logo() {
  const logoIcon = " w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem]";
  return (
    <div className="flex items-center gap-1 sm:p-4 sm:pl-0  ">
      <Database
        className="  w-[2.5rem] h-[2.5rem] sm:w-[3.5rem] sm:h-[3.5rem] "
        color="#fff"
      />

      <span className=" text-[1.6rem]   md:text-[2.5rem] text-white">AITS</span>
    </div>
  );
}

export default Logo;
