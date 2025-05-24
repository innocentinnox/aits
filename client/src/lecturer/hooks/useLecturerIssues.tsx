import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { issueService } from "@/services/issues";

function useLecturerIssues(params?: Record<string, any>) {
    const { data: issues, isLoading: isLoadingIssues } = useQuery({
        queryFn: () => issueService.fetchLecturerIssues(params),
        queryKey: ["lecturer-issues", params],
    });

    const issuesData = issues?.issues || [];
    const totalCount = issues?.total || 0;

    return { issuesData, isLoadingIssues, totalCount };
}

export default useLecturerIssues;
