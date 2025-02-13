import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
const fakeData = [
  {
    id: "#5647771",
    name: "Late Submission",
    date: "05 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647772",
    name: "Missing Marks",
    date: "02 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647773",
    name: "Exam Clash",
    date: "07 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647774",
    name: "Wrong Grade",
    date: "10 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647775",
    name: "Attendance Issue",
    date: "12 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647776",
    name: "Course Error",
    date: "15 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647777",
    name: "Exam Reschedule",
    date: "22 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647778",
    name: "Timetable Conflict",
    date: "18 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647779",
    name: "Lost Assignment",
    date: "20 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647780",
    name: "Fee Error",
    date: "25 FEB 2024",
    status: "Resolved",
  },
  {
    id: "#5647781",
    name: "Lab Equipment Issue",
    date: "27 FEB 2024",
    status: "Pending",
  },
  {
    id: "#5647782",
    name: "Library Access Problem",
    date: "01 MAR 2024",
    status: "Resolved",
  },
  {
    id: "#5647783",
    name: "Internship Placement",
    date: "03 MAR 2024",
    status: "Pending",
  },
  {
    id: "#5647784",
    name: "Project Submission Delay",
    date: "05 MAR 2024",
    status: "Resolved",
  },
  {
    id: "#5647785",
    name: "Hostel Maintenance",
    date: "07 MAR 2024",
    status: "Pending",
  },
  {
    id: "#5647786",
    name: "ID Card Replacement",
    date: "09 MAR 2024",
    status: "Resolved",
  },
  {
    id: "#5647787",
    name: "Transport Issue",
    date: "11 MAR 2024",
    status: "Pending",
  },
  {
    id: "#5647788",
    name: "Scholarship Inquiry",
    date: "13 MAR 2024",
    status: "Resolved",
  },
  {
    id: "#5647789",
    name: "Elective Change Request",
    date: "15 MAR 2024",
    status: "Pending",
  },
  {
    id: "#5647790",
    name: "Graduation Clearance",
    date: "17 MAR 2024",
    status: "Resolved",
  },
];

export default function Table() {
  return (
    <>
      <div className="">
        <table className="min-w-full bg-white border border-tertiary rounded-lg mt-8 ">
          <thead className=" border rounded-lg">
            <TableHeader />
          </thead>
          <tbody>
            {fakeData.map((issue) => (
              <TableRow issue={issue} key={issue.id} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
