export default function TableRow({ issue }: { issue: any }) {
  return (
    <tr className="border cursor-pointer hover:bg-tertiary transition-all duration-300">
      <td className=" px-2 py-1 sm:px-4 sm:py-2 text-center text-[0.6rem] sm:text-sm">
        {issue.id}
      </td>
      <td className="px-2 py-1 sm:px-4 sm:py-2 text-[0.6rem] sm:text-sm">
        {issue.date}
      </td>
      <td className="px-2 py-1 sm:px-4 sm:py-2 text-[0.6rem] sm:text-sm">
        {issue.name}
      </td>
      <td className={` text-[10px] text-center text-white   sm:text-sm `}>
        <span
          className={` p-[0.15rem] sm:p-1  inline-block  text-[0.5rem] sm:text-[0.8rem] ${
            issue.status === "Pending" ? "text-red-700" : "text-green-700"
          }`}
        >
          {issue.status}
        </span>
      </td>
    </tr>
  );
}
