import axiosInstance from "@/lib/axios-instance";
import EmptyNotifications from "./EmptyNotifications";
import NotificationCard from "./NotificationCard";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import { issueService } from "@/services/issues";

function Notifications() {
  const { user } = useAuth();

  // For lecturers, fetch forwarded issues using the lecturer service
  // For students and other roles, use the regular issues endpoint
  const { data: issuesData, isLoading: isLoadingIssues } = useQuery({
    queryFn: () => {
      if (user?.role === "lecturer") {
        // Fetch forwarded issues for lecturers using the lecturer service
        return issueService.fetchLecturerIssues({ statuses: ["forwarded"] });
      } else {
        // Regular issues endpoint for students and other roles
        return axiosInstance.get("/issues/list/");
      }
    },
    queryKey: user?.role === "lecturer" ? ["lecturer-notifications"] : ["issues"],
  });

  // Extract issues from response - the structure is different for lecturer vs student endpoints
  const issues = user?.role === "lecturer"
    ? issuesData?.issues || []
    : issuesData?.data?.issues || [];
  return (
    <div>
      {!isLoadingIssues && issues?.length === 0 ? (
        <EmptyNotifications />
      ) : (
        issues?.map((iss: any, index: number) => (
          <NotificationCard state={true} data={iss} key={index} />
        ))
      )}
    </div>
  );
}

export default Notifications;
