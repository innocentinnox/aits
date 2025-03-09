import { Bell } from "lucide-react";

function NotificationCard({ state }: { state: boolean }) {
  return (
    <div className="flex gap-2 relative p-2 pb-2 border-b-2 shadow-sm ">
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
          Missing Marks in Computer Architecture paper 1
        </p>
        <div className="flex gap-2 text-muted-foreground text-sm">
          <div>Issued: Jan 02 2025</div>|<div>Resolved: Jan 02 2025</div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
