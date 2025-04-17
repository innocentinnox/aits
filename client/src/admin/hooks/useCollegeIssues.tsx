import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";

function useCollegeIssues() {
  const { data: issues, isLoading: isLoadingIssues } = useQuery({
    queryFn: () => axiosInstance.get("/issues/registrar-view/"),
    queryKey: ["admin-issues"],
  });
  const issuesData = issues?.data.issues;

  return { issuesData, isLoadingIssues };
}

export default useCollegeIssues;
