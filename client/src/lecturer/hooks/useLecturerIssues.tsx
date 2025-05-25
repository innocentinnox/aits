import { useQuery } from "@tanstack/react-query";
import { issueService } from "@/services/issues";

function useLecturerIssues(params?: Record<string, any>) {
    const { data, isLoading: isLoadingIssues } = useQuery({
        queryFn: () => issueService.fetchLecturerIssues(params),
        queryKey: ["lecturer-issues", params],
    });

    // Debug the data structure
    console.log('Raw response from fetchLecturerIssues:', data);

    const issuesData = data?.issues || [];
    const totalCount = data?.total || 0;

    return { issuesData, isLoadingIssues, totalCount };
}

export default useLecturerIssues;
