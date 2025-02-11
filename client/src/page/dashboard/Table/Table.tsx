import FilterGrid from "./Filter/FilterGrid";
import styles from "./Table.module.css";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
const fakeData = [
  {
    id: "#5647775",
    name: "Late Submission",
    date: "05 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647774",
    name: "Missing Marks",
    date: "02 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647775",
    name: "Late Submission",
    date: "05 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647776",
    name: "Exam Clash",
    date: "07 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647777",
    name: "Wrong Grade",
    date: "10 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647778",
    name: "Attendance Issue",
    date: "12 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647779",
    name: "Course Error",
    date: "15 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647782",
    name: "Exam Reschedule",
    date: "22 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647782",
    name: "Exam Reschedule",
    date: "22 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647780",
    name: "Timetable Conflict",
    date: "18 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647781",
    name: "Lost Assignment",
    date: "20 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647782",
    name: "Exam Reschedule",
    date: "22 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647783",
    name: "Fee Error",
    date: "25 FEB 2024",
    status: "Resolved",
  },
];

export default function Table() {
  return (
    <>
      <FilterGrid />
      <div className="">
        <table className="min-w-full bg-white border border-tertiary rounded-lg mt-8 ">
          <thead className=" border rounded-lg">
            <TableHeader />
          </thead>
          <tbody>
            {fakeData.map((issue) => (
              <TableRow issue={issue} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
