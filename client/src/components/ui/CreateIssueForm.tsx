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
import { useNavigate } from "react-router-dom";
import { authService } from "@/services";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "../ui/password-input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import LogoIcon from "@/layouts/LogoIcon";
import { useCurrentUser } from "@/auth";

const formSchema = z.object({
  issueTitle: z.string().min(30),
  description: z.string(),
  courseUnit: z.string().min(6),
  attachments: z.string(),
  lecturer: z.string(),
  year: z.string(),
});

export const CreateIssueForm = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const user = useCurrentUser();
  console.log(user)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issueTitle: "",
      description: "",
      courseUnit: "",
      attachments: "",
      lecturer: "",
      year: "",
    },
  });

  const loading = false;

  function onHandleSubmit(values: any) {
    console.log("Form Submitted", values); // Check if values are logged correctly
  }

  return (
    <div className=" flex flex-col  md:items-center justify-center">
      <div className="self-center mt-2">
        <LogoIcon />
      </div>
      <div className="  lg:items-center p-4 px-10 shadow-xl rounded-sm min-w-[18rem] md:w-[50rem]">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold uppercase"> Log An Issue</h1>
          <p className="text-balance text-muted-foreground"></p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              console.log("Form submitted with values:", values); // Should be logged on submission
              onHandleSubmit(values);
            })}
            className={cn(" space-y-3 md:space-y-5 ", className)}
          >
            <FormField
              control={form.control}
              name="issueTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john smith"
                      className="placeholder:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="placeholder:text-sm"
                      placeholder="Please provide more information to the Lecturer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Attach Documents</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="22/U/23908/PSA"
                      {...field}
                      type="file"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-2 ">
              <FormField
                control={form.control}
                name="courseUnit"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Course Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Choose Course Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COCIS">BSCS</SelectItem>
                        <SelectItem value="CEDAT">BSSE</SelectItem>
                        <SelectItem value="CHS">BIST</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COCIS">2021</SelectItem>
                        <SelectItem value="CEDAT">2020</SelectItem>
                        <SelectItem value="CHS">2019</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lecturer"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Lecturer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Lecturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COCIS">COCIS</SelectItem>
                        <SelectItem value="CEDAT">CEDAT</SelectItem>
                        <SelectItem value="CHS">CHS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between md:justify-end md:gap-6">
              <Button type="submit" variant="outline" disabled={loading}>
                Cancel
              </Button>
              <Button type="reset" disabled={loading}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
