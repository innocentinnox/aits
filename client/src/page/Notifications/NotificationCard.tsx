import { Bell } from "lucide-react";
import { useState } from "react";

function NotificationCard({ state }: { state: boolean }) {
  const [cardClicked, setCardClicked] = useState(false);

  return (
    <div
      className="shadow-sm border-b-2 py-2 cursor-pointer"
      onClick={() => setCardClicked((value) => !value)}
    >
      <div
        className={`flex gap-2 relative p-2 pb-2 ${
          !state && cardClicked ? "border-b-2" : ""
        }`}
      >
        <div
          className={`${
            !state ? "bg-red-200" : "bg-green-200"
          }   flex items-center justify-center w-[60px] h-[60px] rounded-full`}
        >
          <span className="stroke-current text-zinc-600">
            <Bell />
          </span>
        </div>
        <div className="w-[90%]">
          <div className="flex items-center justify-between ">
            <h2 className="font-semibold">{state ? "Resolved" : "Rejected"}</h2>
            <div className="w-[15px] h-[15px] bg-green-600 rounded-full "></div>
          </div>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
            sequi fuga illum porro, officia nulla, non ullam voluptatibus at!
          </p>
          <div className="flex gap-2 text-muted-foreground text-sm">
            <div>Issued: Jan 02 2025</div>|<div>Resolved: Jan 02 2025</div>
          </div>
        </div>
      </div>

      {!state && cardClicked && (
        <div className=" pl-[4.5rem]">
          <h2 className="font-semibold text-sm text-red-400">
            Rejection reason
          </h2>
          <p>
            <div className="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta,
              veniam, necessitatibus consequatur voluptate corporis provident
              voluptatum dignissimos itaque fuga ducimus voluptas. Dicta eveniet
            </div>
          </p>
        </div>
      )}
    </div>
  );
}

export default NotificationCard;
