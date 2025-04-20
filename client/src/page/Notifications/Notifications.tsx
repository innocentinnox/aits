import axiosInstance from "@/lib/axios-instance";
import EmptyNotifications from "./EmptyNotifications";
import NotificationCard from "./NotificationCard";
import { useQuery } from "@tanstack/react-query";

function Notifications() {
  // presentation
  const { data: issuesData, isLoading: isLoadingIssues } = useQuery({
    queryFn: () => axiosInstance.get("/issues/list/"),
    queryKey: ["issues"],
  });
  // present
  const tempStudentIssues = issuesData?.data.issues;
  return (
    <div>
      {!isLoadingIssues && tempStudentIssues?.length === 0 ? (
        <EmptyNotifications />
      ) : (
        tempStudentIssues?.map((iss, index) => (
          <NotificationCard state={true} data={iss} key={index} />
        ))
      )}
    </div>
  );
}

export default Notifications;
