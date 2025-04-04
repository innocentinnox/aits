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
import { Link, useNavigate } from "react-router-dom";
import useUrlParams from "@/hooks/use-url-params";
import { PasswordInput } from "../ui/password-input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth";
import { User } from "@/context/auth-context";
import { DASHBOARD_ROUTES } from "@/routes";
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20),
});

export const LoginForm = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const { next, constructPath } = useUrlParams();
  const { login } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending: loading, mutate: onSubmit } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => login(values),
    onSuccess: (res) => {
      const user: User = res?.user;
      toast.success(res?.message);
      console.log("userrrrrrrrrrrrrrrr", user);
      console.log("DASHBOARD_ROUTES[user.role]", DASHBOARD_ROUTES[user.role]);
      // navigate(DASHBOARD_ROUTES[user.role] || "/")  since the role is department_head
      navigate("/", { replace: true });
    },
    onError: (res: any) => {
      toast.error(res?.message);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className={cn("space-y-6")}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="jane.doe@example.com" {...field} />
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
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  to={constructPath("/auth/reset-password", {})}
                  className="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
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
        <Button type="submit" className="w-full" disabled={loading}>
          Login
        </Button>
      </form>
    </Form>
  );
};
