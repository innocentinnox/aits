import { issueService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useForwardIssue() {
  const queryClient = useQueryClient();
  
  const { mutate: forwardIssue, isPending: isForwarding } = useMutation({
    mutationFn: ({ token, lecturerId }: { token: string; lecturerId: number }) => 
      issueService.forward(token, lecturerId),
    onError: (error: any) => {
      toast.error(error.message || "Failed to forward issue");
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-issues"],
      });
      queryClient.invalidateQueries({
        queryKey: ["lecturer-issues"],
      });
      toast.success(data.message || "Issue forwarded successfully");
    },
  });

  return { 
    forwardIssue, 
    isForwarding 
  };
}
