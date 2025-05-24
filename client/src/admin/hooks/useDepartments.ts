import { issueService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth";

export function useDepartments(schoolId?: number) {
  const { user } = useAuth();
  
  // For registrars, use college_id if no school_id is provided
  const queryParams = schoolId 
    ? { school_id: schoolId }
    : user?.school?.id 
      ? { school_id: user.school.id }
      : user?.college?.id 
        ? { college_id: user.college.id }
        : {};
  
  const { data: departments, isLoading, error } = useQuery({
    queryKey: ["departments", schoolId, user?.school?.id, user?.college?.id],
    queryFn: () => issueService.departmentsByParams(queryParams),
    enabled: !!(schoolId || user?.school?.id || user?.college?.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { 
    departments: departments || [], 
    isLoading,
    error 
  };
}
