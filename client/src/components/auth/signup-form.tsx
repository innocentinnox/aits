"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services";

import { PasswordInput } from "../ui/password-input";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUrlParams from "@/hooks/use-url-params";

const formSchema = z.object({
  email: z.string().email(),
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers"),
  password: z.string().min(6).max(20),
});

export const SignupForm = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const { constructPath } = useUrlParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  const { isPending: loading, mutate: onSubmit } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      authService.signUp(values),
    onSuccess: (data: any) => {
      toast.success(data?.message);
      navigate(
        constructPath("/auth/verify", {
          email: data.email,
          ...(data.token_id && { tokenId: data?.token_id }),
        }),
        { replace: true }
      );
    },
    onError: (res: any) => {
      console.log("ERROR: ", res);
      toast.error(res?.message);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className={cn("space-y-2", className)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jane@students.mak.ac.ug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First and Last Name in one row */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="jane256" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="*******"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full !mt-4" disabled={loading}>
          Signup
        </Button>
      </form>
    </Form>
  );
};
