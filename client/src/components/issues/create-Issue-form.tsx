"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/auth";
import axiosInstance from "@/lib/axios-instance";
import { issueService } from "@/services";
import { FileDropzone, FileWithPreview } from "@/components/file-dropzone";

const fileWithPreviewSchema = z.custom<FileWithPreview>((val) => { 
  return val instanceof File && 'id' in val;
}, { message: "Must be a valid file with preview information"});

const formSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().min(5, "Description is too short"),
  category: z.number(),
  course_unit: z.optional(z.string()),
  attachments: z.array(fileWithPreviewSchema).max(5, "Maximum 5 files allowed")
                .optional().default([]),
  year: z.string(),
  // hidden
  course: z.number(),
  college: z.number(),
});
type FormValues = z.infer<typeof formSchema>;

interface CreateIssueFormProps {
  className?: string;
  category: { id: number; name: string; description: string };
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const CreateIssueForm = ({ className, category, onCancel, onSuccess } : CreateIssueFormProps) => {
  const user = useCurrentUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: category.id,
      course: user?.course?.id,
      college: user?.college?.id,

      title: "",
      description: "",
      course_unit: "",
      attachments: "",
      lecturer: "",
      year: "",
    },
  });

  const loading = false

  // Fetch schools when a college is selected
  const yearTaken = form.watch("year");
  const { data: course_units, isPending: fetchingcourse_units } = useQuery({
    queryKey: ["course_units", yearTaken],
    queryFn: async () => {
      if (!yearTaken) return [];
      const res = await axiosInstance.get("/accounts/course-units/", { params: { course_id: user?.course?.id, year_taken: yearTaken } });
      console.log("Data: ", res.data, "yearTaken: ", yearTaken);
      return res.data as { id: number; title: string; code: string }[];
    },
    enabled: !!yearTaken,
  });


    // Form submission
    const { mutate: onSubmit, isPending: submittingIssue } = useMutation({
      mutationFn: async (values: FormValues) => issueService.create(values),
      onError: (error) => {
        toast.error(error.message || "Failed to submit issue");
      },
      onSuccess: (data) => {
        console.log(data)
        toast.success(data.message || "Issue submitted successfully");
      },
    });

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-3 md:space-y-5 px-6 !pb-4", className)}>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Issue Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Missing Marks for CAT 1"
                className="placeholder:text-sm"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="description"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                className="placeholder:text-sm"
                placeholder="Please provide more information about the issue."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="md:flex flex-col md:flex-row justify-between items-center gap-2 ">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="flex-[0.2]">
              <FormLabel>Year</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {
                    Array.from({ length: 5 }, (_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>
                        Year - {i + 1}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />

    <FormField
              control={form.control}
              name="course_unit"
              render={({ field }) => (
                <FormItem className="flex-[0.8]">
                  <FormLabel>Course Unit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={fetchingcourse_units || !yearTaken}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder={yearTaken && fetchingcourse_units ? "Loading..." : "Select a course unit"} />
                    </SelectTrigger>
                    <SelectContent>
                      {course_units?.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          {unit.code}:{unit.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
      </div>
      <FormField
        control={form.control}
        name="attachments"
        render={({ field }) => (
          <FormItem className="grid gap-2">
            {/* <FormLabel>Attach Documents</FormLabel> */}
            <FormControl>
            <FileDropzone
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              // maxFiles={maxFiles}
              // maxSize={maxSize}
              // accept={accept}
            />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-end items-center gap-2 sm:space-x-0">
        <Button type="button" onClick={onCancel} variant="outline" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={fetchingcourse_units || submittingIssue || !user?.course?.id || !user?.college?.id}>
          Submit
        </Button>
      </div>
    </form>
  </Form>
  );
};
