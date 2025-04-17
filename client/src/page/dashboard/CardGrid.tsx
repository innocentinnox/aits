import { Loader, Send, SquareCheckBig } from "lucide-react";
import CardItem from "./CardItem";
import { useAuth } from "@/auth";

const CARDS = ["submitted", "in progress", "resolved"];
const SVGS = [<Send />, <Loader />, <SquareCheckBig />];
const adminTitle = ["Received", "Forwarded", "Resolved"];
export default function CardGrid({
  issuesValues,
  isLoadingIssues,
}: {
  issuesValues?: [];
  isLoadingIssues?: boolean;
}) {
  const { user } = useAuth();
  const RESOLVED = issuesValues?.filter(
    (iss: any) => iss.status === "resolved"
  ).length;

  // Student
  if (user?.role == "student") {
    const SUBMITTED = issuesValues?.filter(
      (iss: any) => iss.status === "pending"
    ).length;

    const PENDING = issuesValues?.filter((iss: any) => iss.forwarded_to).length;
    const values = [SUBMITTED, PENDING, RESOLVED];
    return (
      <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-around  p-4 pt-0 items-center">
        {CARDS.map((card, index) => (
          <CardItem
            title={card}
            icon={SVGS[index]}
            value={values[index]}
            key={card}
            isLoading={isLoadingIssues}
          />
        ))}
      </div>
    );
  }
  // Admin
  if (user?.role == "registrar") {
    const SUBMITTED = issuesValues?.filter(
      (iss: any) => iss.status === "pending"
    ).length;

    const PENDING = issuesValues?.filter((iss: any) => iss.forwarded_to).length;
    const values = [SUBMITTED, PENDING, RESOLVED];
    return (
      <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-around  p-4 pt-0 items-center">
        {adminTitle.map((card, index) => (
          <CardItem
            title={card}
            icon={SVGS[index]}
            value={values[index]}
            key={card}
            isLoading={isLoadingIssues}
          />
        ))}
      </div>
    );
  }

  return null;
}
