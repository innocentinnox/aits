export default function TableRow({ issue }: { issue: any }) {
  return (
    <tr className="border-2">
      <td className="px-4 py-2 text-center">{issue.id}</td>
      <td className="px-4 py-2">{issue.date}</td>
      <td className="px-4 py-2">{issue.name}</td>
      <td className={` text-[10px] text-center text-white rounded-full  `}>
        <span
          className={` p-1 rounded-full ${
            issue.status === "Pending" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {issue.status}
        </span>
      </td>
    </tr>
  );
}
