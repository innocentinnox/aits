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
import { useResolveForward } from "@/admin/hooks/useResolveForward";

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

interface IssueResolveFormProps {
    issue: IssueDetails;
    onCloseModal: () => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
};

const IssueResolveForm: React.FC<IssueResolveFormProps> = ({ issue, onCloseModal }) => {
    const queryClient = useQueryClient();
    const { resolveWithDetails, isResolvingWithDetails } = useResolveForward();

    // Setup form with validation
    const form = useForm<FormValues>({
        resolver: zodResolver(resolveFormSchema),
        defaultValues: {
            resolution_details: "",
        },
    });

    // Form submission handler
    const onSubmit = (values: FormValues) => {
        resolveWithDetails({
            token: issue.token,
            resolution_details: values.resolution_details
        }, {
            onSuccess: () => {
                toast.success("Issue resolved successfully");
                queryClient.invalidateQueries({
                    queryKey: ["admin-issues"],
                });
                onCloseModal();
            }
        });
    };

    return (
        <ScrollArea className="h-[calc(80vh-6rem)] w-full">
            <Card className="max-w-4xl mx-auto p-6 my-4">
                <div className="space-y-6">
                    {/* Header Section with issue details */}
                    <div className="border-b pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h1 className="text-2xl font-bold">Resolve Issue</h1>
                            <Badge variant="outline">{issue.token}</Badge>
                        </div>
                        <div className="mt-2">
                            <h2 className="text-xl font-semibold">{issue.title}</h2>
                            <div className="mt-2 flex flex-wrap gap-3">
                                <Badge variant="secondary">{issue.status.toUpperCase()}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Issue description */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
                    </div>

                    {/* Student info */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-2">Student Information</h3>
                        <p>
                            <span className="font-medium">Name:</span> {issue.created_by.first_name} {issue.created_by.last_name}
                        </p>
                        <p>
                            <span className="font-medium">Email:</span> {issue.created_by.email}
                        </p>
                        <p>
                            <span className="font-medium">Created:</span> {formatDate(issue.created_at)}
                        </p>
                    </div>

                    {/* Resolution Form */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Resolution Details</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Please provide details about how this issue was resolved.
                        </p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="resolution_details"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Resolution Comments</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Provide details about how the issue was resolved..."
                                                    className="min-h-[150px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end space-x-2 pt-2">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={onCloseModal}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isResolvingWithDetails}>
                                        {isResolvingWithDetails ? "Resolving..." : "Resolve Issue"}
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

export default IssueResolveForm;