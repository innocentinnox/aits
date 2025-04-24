import Heading from "@/components/ui/Heading";
import StatGrid from "./StatGrid";
import CardGrid from "../../page/dashboard/CardGrid";
import useCollegeIssues from "../hooks/useCollegeIssues";

function Statistics() {
  const { isLoadingIssues, issuesData } = useCollegeIssues();
  return (
    <>
      <CardGrid issuesValues={issuesData} isLoadingIssues={isLoadingIssues} />
      <StatGrid />
    </>
  );
}

export default Statistics;
