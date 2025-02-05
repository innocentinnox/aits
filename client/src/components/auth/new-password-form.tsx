"use client";

import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { useMutation } from "@tanstack/react-query";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { authService } from "@/services";
import useUrlParams from "@/hooks/use-url-params";
import { useNavigate } from "react-router-dom";


export const NewPasswordSchema = z
  .object({
    email: z.string().email({ message: "Email is required" }),
    tokenId: z.string().min(1, { message: "Invalid token" }),
    code: z.string().min(1, { message: "Verification code is required" }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
    confirmNewPassword: z.string().min(8, { message: "New password required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"], // Ensures error is shown on confirm password field
  });

interface Props {
  setOpen?: (value: boolean) => void;
}

export const NewPasswordForm = ({ setOpen }: Props) => {
  const { constructPath, getDecodedParams } = useUrlParams();
  const { email, tokenId } = getDecodedParams<{ email: string, tokenId: string }>(["email", "tokenId"]);


  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      email: email || "",
      tokenId: tokenId || "",
      code: "",
      newPassword: "",
      confirmNewPassword: ""
    },
  });

  const navigate = useNavigate();
  
  const {
    mutate: onSubmit,
    data,
    isPending,
  } = useMutation({
    mutationFn: (values: z.infer<typeof NewPasswordSchema>) => authService.newPassVerify(values),
    onSuccess: ({ data }: any) => {
        toast.success(data?.message || "Password reset successfully")
        if(data?.success){
            navigate(constructPath("/login", { new_pass: "1" }))
        }
    },
    onError: ({ response: { data }} :any) => {
      console.log(data) 
      toast.error(data?.message || "Something went wrong")
    },
  });

  return (
    <div className="">
       <Form {...form}>
          <form
            onSubmit={form.handleSubmit((value) => onSubmit(value))}
            className="space-y-6"
          >
            <div className="space-y-4">
            <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                        <PasswordInput
                            {...field}
                            disabled={isPending}
                            placeholder="********"
                            type="password"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                        <PasswordInput
                            {...field}
                            disabled={isPending}
                            placeholder="********"
                            type="password"
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormError message={data?.error} />
            <FormSuccess message={data?.success} />
            <Button disabled={isPending} type="submit" className="w-full">
            Change password
            </Button>
          </form>
        </Form>
    </div>
  );
};
