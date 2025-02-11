import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { BeatLoader } from "react-spinners";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import useUrlParams from "@/hooks/use-url-params";
import { useNavigate } from "react-router-dom";

export const VerificationSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
  tokenId: z.optional(z.string()),
  code: z.string(),
});

const VerificationFrom = () => {
  const { next, getDecodedParams, constructPath } = useUrlParams();
  const { email, tokenId } = getDecodedParams<{
    email: string;
    tokenId: string;
  }>(["email", "tokenId"]);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof VerificationSchema>>({
    resolver: zodResolver(VerificationSchema),
    defaultValues: {
      email: email || "",
      tokenId: tokenId || "",
      code: "",
    },
  });

  const {
    mutate: onSubmit,
    data,
    isPending: loading,
  } = useMutation({
    mutationFn: (values: z.infer<typeof VerificationSchema>) =>
      authService.verify({ credential: values.email, code: values.code }),
    onSuccess: ({ data }: any) => {
      if (data?.success) {
        toast.success(data?.message || "Email verified");
        navigate(constructPath("/login", {}));
      }
    },
    onError: ({ response: { data } }: any) => {
      toast.error(data?.message || "Something went wrong");
    },
  });

  return (
    <div >
      <div>
        <div className="flex flex-col gap-4 items-center w-full justify-center">
          {email&&<p className="text-center text-muted-foreground text-sm">
            Enter verification code sent to {email}
          </p>}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((value) => onSubmit(value))}
              className="space-y-6"
            >
              {loading ? (
                <BeatLoader />
              ) : (
                <div>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={(value) => {
                              form.setValue("code", value);
                              if (value.length == 6) {
                                onSubmit({
                                  email: form.getValues("email"),
                                  code: value,
                                });
                              }
                            }}
                            autoFocus
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormError message={data?.error} />
              <FormSuccess message={data?.success} />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerificationFrom;
