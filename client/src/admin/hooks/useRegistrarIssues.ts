import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import type { IssueParams } from "@/types";

function useRegistrarIssues(params: IssueParams) {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      queryParams.set("take", params.take.toString());
      queryParams.set("skip", params.skip.toString());
      
      // Add search and filter parameters
      if (params.search) queryParams.set("search", params.search);
      if (params.priority) queryParams.set("priority", params.priority);
      if (params.category) queryParams.set("category", params.category);
      if (params.statuses && params.statuses.length > 0) {
        queryParams.set("statuses", params.statuses.join(","));
      }
      if (params.year) queryParams.set("year", params.year);
      if (params.semester) queryParams.set("semester", params.semester);
      if (params.course) queryParams.set("course", params.course);
      if (params.course_unit) queryParams.set("course_unit", params.course_unit);
      if (params.created_after) queryParams.set("created_after", params.created_after);
      if (params.created_before) queryParams.set("created_before", params.created_before);
      if (params.ordering) queryParams.set("ordering", params.ordering);
      
      const response = await axiosInstance.get(
        `/issues/registrar-view/?${queryParams.toString()}`
      );
      return response.data;
    },
    queryKey: ["registrar-issues", params],
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    issuesData: data?.issues || [],
    totalCount: data?.total || 0,
    isLoadingIssues: isLoading,
    take: data?.take || params.take,
    skip: data?.skip || params.skip,
  };
}

export default useRegistrarIssues;
