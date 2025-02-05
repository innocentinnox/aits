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
import { authService } from "@/services";
import useUrlParams from "@/hooks/use-url-params";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Email is required" })
});

interface Props {
  setOpen?: (value: boolean) => void;
}

export const RequestResetPasswordForm = ({ setOpen }: Props) => {
  const { constructPath, next } = useUrlParams();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useNavigate();
  
  const {
    mutate: onSubmit,
    data,
    isPending,
  } = useMutation({
    mutationFn: (values: z.infer<typeof ResetPasswordSchema>) => authService.newPassword(values),
    onSuccess: ({ data }: any) => {
        if(data?.tokenId && data?.email){
            // Verify the email
            router(constructPath("/auth/reset-password/verify", { tokenId: data?.tokenId, email: form.getValues("email") }))
        }
    },
    onError: ({ response: { data }} :any) => { 
      toast.error(data?.message || "Something went wrong")
    },
  });

  return (
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((value) => onSubmit(value))}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
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
              Send Verification Code
            </Button>
            {/* <div className="text-center justify-center">
              <p className="text-gray-600 text-sm mt-1 dark:text-gray-300">
                This may take a couple of minutes.
              </p>
              <p className="text-gray-600 text-sm mt-1 dark:text-gray-300">
                Didn&apos;t Receive?
                <a href="/new-password" className="text-blue-500 hover:text-blue-600 transition"> Try again</a>
              </p>
            </div> */}
          </form>
        </Form>
      </>
  );
};
