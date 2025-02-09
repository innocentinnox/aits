export default function TableHeader() {
  return (
    <tr className="border-b-1">
      <th className="px-2 sm:px-4 py-1 sm:py-2 text-[0.8rem]">Issues Id</th>
      <th className="px-2 sm:px-4 py-1 sm:py-2 text-[0.8rem] text-left">
        Date
      </th>
      <th className="px-2 sm:px-4 py-1 sm:py-2 text-[0.8rem] text-left">
        Name
      </th>
      <th className="px-2 sm:px-4 py-1 sm:py-2 text-[0.8rem]"> Status</th>
    </tr>
  );
}
