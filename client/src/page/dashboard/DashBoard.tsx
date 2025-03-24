import { Send } from "lucide-react";
import CardGrid from "./CardGrid";
import IssueTable from "@/components/issues/table/issue-table";
import { NewIssueDialog } from "@/components/issues/issue-dialog";
import { Button } from "@/components/ui/button";
import React from "react";

export default function DashBoard() {
  const [showIssueDialog, setShowIssueDialog] = React.useState(false);
  return (
    <>
      <CardGrid />
      <div className="container py-10 mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Issues</h1>
        <div className="flex items-center gap-4">
          {/* <ThemeToggle /> */}
          <NewIssueDialog 
            open={showIssueDialog}
            onOpenChange={setShowIssueDialog}
            showTrigger={false} 
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
