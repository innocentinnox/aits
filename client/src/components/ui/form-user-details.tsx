"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

const formSchema = z.object({
  name: z.string().min(5),
  studentNumber: z.string(),
  regNumber: z.string().min(6),
  college: z.string(),
  password: z.string().min(6).max(20),
});

export const UserDetailsForm = ({ className }: { className?: string }) => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      studentNumber: "",
      regNumber: "",
      college: "",
      password: "",
    },
  });

  const loading = false;

  function onHandleSubmit(values: any) {
    console.log("Form Submitted", values); // Check if values are logged correctly
  }

  return (
    <div className=" flex flex-col md:items-center overflow-scroll  bg-zinc-100  ">
      <div className="self-center mt-2">
        <LogoIcon />
      </div>
      <div className="  lg:items-center p-4 px-10 shadow-lg rounded-sm min-w-[18rem] md:w-[50rem]">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold uppercase">Fill in your details</h1>
          <p className="text-balance text-muted-foreground italic">
            This will only be done once...
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              console.log("Form submitted with values:", values); // Should be logged on submission
              onHandleSubmit(values);
            })}
            className={cn("space-y-5 ", className)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="john smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student No:</FormLabel>
                  <FormControl>
                    <Input placeholder="2400723098" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regNumber"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Registration No:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="22/U/23908/PSA"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="college"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Choose your college</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose college" />
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

            <Button type="submit" className="text-lg" disabled={loading}>
              Save
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
