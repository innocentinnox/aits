import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { useAuth } from "@/auth";
import { useState } from "react";
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { printIssue } from "@/lib/printIssue";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface IssueDetails {
  id: number;
  token: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  category: number;
  college: number;
  course: number;
  course_unit: number;
  semester: number;
  year_of_study: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolution_details: string | null;
  created_by: User;
  assigned_to: User;
  modified_by: User | null;
  closed_by: User | null;
  forwarded_to: User | null;
  attachments: any[];
}

const priorityColors = {
  1: "bg-green-100 text-green-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-red-100 text-red-800",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const IssueDetailsForm: React.FC<{ issue: IssueDetails }> = ({ issue }) => {
  const { user } = useAuth();
  const [isPrinting, setIsPrinting] = useState(false);

  // Handle print action
  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      await printIssue(issue);
    } catch (error) {
      console.error("Error printing issue:", error);
      toast.error("Failed to print the issue details. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-2rem)] w-full">
      <Card className="max-w-4xl mx-auto p-6 my-4">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="border-b pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">{issue.title}</h1>
              <Badge variant="outline">{issue.token}</Badge>
            </div>
            <div className="flex justify-between mt-2">
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge variant="secondary">{issue.status.toUpperCase()}</Badge>
              </div>
              <div className="flex gap-2">
                {/* Show Print button for all users */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="flex items-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{isPrinting ? "Printing..." : "Print"}</span>
                </Button>

                {/* Show Forward button only for registrars */}
                {user?.role !== "student" && <Button size="sm">Forward</Button>}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description Section */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {issue.description}
              </p>
            </div>

            {/* Academic Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Academic Information</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm text-gray-500">College</label>
                  <p className="font-medium">{issue.college}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Course</label>
                  <p className="font-medium">{issue.course}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Course Unit</label>
                  <p className="font-medium">{issue.course_unit}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Year of Study</label>
                  <p className="font-medium">{issue.year_of_study}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Semester</label>
                  <p className="font-medium">{issue.semester}</p>
                </div>
              </div>
            </div>

            {/* People Involved */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">People</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm text-gray-500">Created By</label>
                  <p className="font-medium">
                    {issue.created_by.first_name} {issue.created_by.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {issue.created_by.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Assigned To</label>
                  <p className="font-medium">
                    {issue.assigned_to.first_name} {issue.assigned_to.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {issue.assigned_to.email}
                  </p>
                </div>
                {issue.forwarded_to && (
                  <div>
                    <label className="text-sm text-gray-500">
                      Forwarded To
                    </label>
                    <p className="font-medium">
                      {issue.forwarded_to.first_name}{" "}
                      {issue.forwarded_to.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {issue.forwarded_to.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dates and Resolution */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold">Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Created At</label>
                  <p className="font-medium">{formatDate(issue.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Updated</label>
                  <p className="font-medium">{formatDate(issue.updated_at)}</p>
                </div>
                {issue.resolved_at && (
                  <div>
                    <label className="text-sm text-gray-500">Resolved At</label>
                    <p className="font-medium">
                      {formatDate(issue.resolved_at)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resolution Details if any */}
            {issue.resolution_details && (
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-2">
                  Resolution Details
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {issue.resolution_details}
                </p>
              </div>
            )}

            {/* Attachments if any */}
            {issue.attachments.length > 0 && (
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-2">Attachments</h2>
                <div className="flex flex-wrap gap-2">
                  {issue.attachments.map((attachment, index) => (
                    <Badge key={index} variant="secondary">
                      Attachment {index + 1}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </ScrollArea>
  );
};

export default IssueDetailsForm;
