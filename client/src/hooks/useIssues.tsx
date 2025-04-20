import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
export function useIssues() {
  const { data: issues, isLoading: isLoadingIssues } = useQuery({
    queryFn: () => axiosInstance.get("/issues/list/"),
    queryKey: ["issues"],
  });
  const issuesData = issues?.data.issues;
  return { issuesData, isLoadingIssues };
}
