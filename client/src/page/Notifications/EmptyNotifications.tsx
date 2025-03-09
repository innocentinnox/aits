import { BellOff } from "lucide-react";

function EmptyNotifications() {
  return (
    <div className="flex flex-col md:gap-4">
      <div className=" flex justify-center relative">
        <div className="bg-gray-200 flex justify-center items-center rounded-full p-10 scale-50 md:scale-100 stroke-current text-zinc-400 ">
          <BellOff width="100" height="100" strokeWidth="1.00" />
        </div>
        <div className=" flex items-center justify-center  w-[18px] h-[18px]  md:w-[30px] md:h-[30px] bg-red-500 text-white rounded-full top-[34%] md:top-[20%] right-[46%]  md:right-[47%] absolute font-semibold">
          <span>!</span>
        </div>
      </div>
      <div className=" text-xl  md:text-[30px] text-muted-foreground text-center">
        <p>No recent notifications found!</p>
      </div>
    </div>
  );
}

export default EmptyNotifications;
