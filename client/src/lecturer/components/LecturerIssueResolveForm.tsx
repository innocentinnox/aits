"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLecturerResolve } from "../hooks/useLecturerResolve";

// Form schema for resolution
const resolveFormSchema = z.object({
    resolution_details: z
        .string()
        .min(10, "Resolution details must be at least 10 characters long")
        .max(1000, "Resolution details must be less than 1000 characters"),
});

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface IssueDetails {
    id: number;
    token: string;
    title: string;
    description: string;
    status: string;
    priority: number;
    category: number;
    college: number;
    course: number;
    course_unit: number;
    semester: number;
    year_of_study: number;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
    resolution_details: string | null;
    created_by: User;
    assigned_to: User;
    modified_by: User | null;
    closed_by: User | null;
    forwarded_to: User | null;
    attachments: any[];
}

type FormValues = z.infer<typeof resolveFormSchema>;

interface LecturerIssueResolveFormProps {
    issue: IssueDetails | null;
    onCloseModal: () => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
};

const LecturerIssueResolveForm: React.FC<LecturerIssueResolveFormProps> = ({
    issue,
    onCloseModal,
}) => {
    // Early return with a proper div if issue is not provided
    if (!issue) {
        return <div className="p-4 text-center">No issue selected</div>;
    }

    const queryClient = useQueryClient();
    const { resolveWithDetails, isResolvingWithDetails } = useLecturerResolve();

    // Setup form with validation
    const form = useForm<FormValues>({
        resolver: zodResolver(resolveFormSchema),
        defaultValues: {
            resolution_details: "",
        },
    });

    // Form submission handler
    const onSubmit = (values: FormValues) => {
        resolveWithDetails(
            {
                token: issue.token,
                resolution_details: values.resolution_details,
            },
            {
                onSuccess: () => {
                    toast.success("Issue resolved successfully");
                    queryClient.invalidateQueries({
                        queryKey: ["lecturer-issues"],
                    });
                    form.reset();
                    onCloseModal();
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to resolve issue");
                },
            }
        );
    };

    const priorityColors: Record<number, string> = {
        1: "bg-green-100 text-green-800",
        2: "bg-yellow-100 text-yellow-800",
        3: "bg-orange-100 text-orange-800",
        4: "bg-red-100 text-red-800",
    };

    const getPriorityLabel = (priority: number) => {
        switch (priority) {
            case 1: return "Low";
            case 2: return "Medium";
            case 3: return "High";
            case 4: return "Critical";
            default: return "Unknown";
        }
    };

    return (
        <ScrollArea className="h-[calc(100vh-2rem)] w-full">
            <Card className="max-w-4xl mx-auto p-6 my-4">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="border-b pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h1 className="text-2xl font-bold">Resolve Issue: {issue.title}</h1>
                            <Badge variant="outline">{issue.token}</Badge>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Badge variant="secondary">{issue.status.replace('_', ' ').toUpperCase()}</Badge>
                            <Badge className={priorityColors[issue.priority] || "bg-gray-100 text-gray-800"}>
                                {getPriorityLabel(issue.priority)}
                            </Badge>
                        </div>
                    </div>

                    {/* Issue Summary */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Issue Description</h3>
                            <p className="text-gray-700 mt-2">{issue.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Created by:</span>{" "}
                                {issue.created_by?.first_name} {issue.created_by?.last_name} ({issue.created_by?.username})
                            </div>
                            <div>
                                <span className="font-medium">Created at:</span>{" "}
                                {formatDate(issue.created_at)}
                            </div>
                            {issue.forwarded_to && (
                                <div>
                                    <span className="font-medium">Forwarded to:</span>{" "}
                                    {issue.forwarded_to.first_name} {issue.forwarded_to.last_name}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resolution Form */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Resolution Details</h3>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="resolution_details"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resolution Details *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe how this issue was resolved..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isResolvingWithDetails}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isResolvingWithDetails ? "Resolving..." : "Resolve Issue"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onCloseModal}
                                        disabled={isResolvingWithDetails}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </Card>
        </ScrollArea>
    );
};

export default LecturerIssueResolveForm;
