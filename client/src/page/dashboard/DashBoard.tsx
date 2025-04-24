import { Send } from "lucide-react";
import CardGrid from "./CardGrid";
import IssueTable from "@/components/issues/table/issue-table";
import { NewIssueDialog } from "@/components/issues/issue-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PieChartComp from "../../admin/stat/PieChartComp";
import AreaChartComp from "../../admin/stat/AreaChartComp";
import StatGrid from "../../admin/stat/StatGrid";
import Heading from "@/components/ui/Heading";
import { useAuth } from "@/auth";
import { useIssues } from "@/hooks/useIssues";
import NoIssues from "@/components/issues/NoIssues";

export default function DashBoard() {
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const { issuesData, isLoadingIssues } = useIssues();
  console.log(issuesData, "dash");

  function handleSuccess() {
    setShowIssueDialog(false);
  }
  if (issuesData?.length == 0 && !isLoadingIssues)
    return <NoIssues handler={() => setShowIssueDialog(true)} />;
  return (
    <>
      <CardGrid issuesValues={issuesData} isLoadingIssues={isLoadingIssues} />

      <div className=" py-10 w-[100%] px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Issues</h1>
          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <NewIssueDialog
              open={showIssueDialog}
              onOpenChange={setShowIssueDialog}
              showTrigger={false}
              onSuccess={handleSuccess}
            />
            <Button
              onClick={() => setShowIssueDialog(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md shadow-md"
            >
              New issue
            </Button>
          </div>
        </div>
        <IssueTable />
      </div>
    </>
  );
}
