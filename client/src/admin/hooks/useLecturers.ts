import { issueService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth";

export function useLecturers(departmentId?: number) {
  const { user } = useAuth();
  
  const { data: lecturers, isLoading, error } = useQuery({
    queryKey: ["lecturers", user?.college?.id, departmentId],
    queryFn: () => {
      // If departmentId is provided, filter by department
      if (departmentId) {
        return issueService.lecturers(user?.college?.id, departmentId);
      }
      // Otherwise, get all lecturers in the college
      return issueService.lecturers(user?.college?.id);
    },
    enabled: !!user?.college?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { 
    lecturers: lecturers || [], 
    isLoading,
    error 
  };
}
