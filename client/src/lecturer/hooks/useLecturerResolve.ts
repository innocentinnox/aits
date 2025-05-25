import { issueService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLecturerResolve() {
  const queryClient = useQueryClient();

  // Mutation for resolving issues with resolution details
  const { mutate: resolveWithDetails, isPending: isResolvingWithDetails } = useMutation({
    mutationFn: ({ token, resolution_details }: { token: string; resolution_details: string }) => 
      issueService.resolveWithDetails(token, resolution_details),
    onError: (error: any) => {
      toast.error(error.message || "Failed to resolve issue");
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["lecturer-issues"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-issues"],
      });
      toast.success(data.message || "Issue resolved successfully");
    },
  });

  return { 
    resolveWithDetails,
    isResolvingWithDetails
  };
}
