import { Loader, Send, SquareCheckBig } from "lucide-react";
import CardItem from "./CardItem";
import { formatCurrency } from "@/utilities/helper";
import { useAuth } from "@/auth";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
const CARDS = ["submitted", "in progress", "resolved"];
const SVGS = [<Send />, <Loader />, <SquareCheckBig />];
export default function CardGrid() {
  const admin = [30, 20, 10];
  const adminTitle = ["Received", "Forwarded", "Resolved"];
  const { user } = useAuth();
  const isStud = user?.role === "student";

  // presentation
  const { data: issuesData, isLoading: isLoadingIssues } = useQuery({
    queryFn: () => axiosInstance.get("/issues/list/"),
    queryKey: ["issues"],
  });
  // present

  const tempStudentIssues = issuesData?.data.issues;
  const pending = tempStudentIssues?.filter(
    (iss: any) => iss.status === "pending"
  );
  const resolved = tempStudentIssues?.filter(
    (iss: any) => iss.status === "resolved"
  );

  console.log(pending, "cards");
  const student = [
    tempStudentIssues?.length,
    pending?.length,
    resolved?.length,
  ];
  return (
    <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-around  p-4 pt-0 items-center">
      {CARDS.map((card, index) => (
        <CardItem
          title={!isStud ? adminTitle[index] : card}
          icon={SVGS[index]}
          value={isStud ? student[index] : admin[index]}
          key={card}
        />
      ))}
    </div>
  );
}
