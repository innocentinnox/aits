import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
export function useIssues() {
  const { data: issuesData, isLoading: isLoadingIssues } = useQuery({
    queryFn: () => axiosInstance.get("/issues/list/"),
    queryKey: ["issues"],
  });

  return { issuesData, isLoadingIssues };
}
