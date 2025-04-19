import { issueService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useResolveForward() {
  const queryClient = useQueryClient();
  
  // This is the original resolve mutation that doesn't include resolution details
  // It's now deprecated and should not be used
  const { mutate: onResolve, isPending: isSubmittingIssue } = useMutation({
    mutationFn: (token: string) => issueService.resolve(token),
    onError: (error: any) => {
      toast.error(error.message || "Failed to resolve issue");
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-issues"],
      });
      toast.success(data.message || "Issue resolved successfully");
    },
  });

  // New mutation that includes resolution details
  const { mutate: resolveWithDetails, isPending: isResolvingWithDetails } = useMutation({
    mutationFn: ({ token, resolution_details }: { token: string; resolution_details: string }) => 
      issueService.resolveWithDetails(token, resolution_details),
    onError: (error: any) => {
      toast.error(error.message || "Failed to resolve issue");
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-issues"],
      });
      toast.success(data.message || "Issue resolved successfully");
    },
  });

  return { 
    onResolve, 
    isSubmittingIssue,
    resolveWithDetails,
    isResolvingWithDetails
  };
}
