import { issueService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useResolveForward() {
  const queryClient = useQueryClient();
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

  return { onResolve, isSubmittingIssue };
}
