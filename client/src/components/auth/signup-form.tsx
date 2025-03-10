"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { authService } from "@/services"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { PasswordInput } from "../ui/password-input"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
  
const formSchema = z.object({
    email: z.string().email(),
    username: z.string()
      .min(2)
      .max(20)
      .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers"),

    password: z.string().min(6).max(20),
  });


export const SignupForm = ({ className }:{ className?: string }) => {

    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          username: "",
          password: "",
        },
      })

      const { isPending: loading, mutate: onSubmit } = useMutation({
        mutationFn: (values:  z.infer<typeof formSchema>) => authService.signUp(values),
        onSuccess: (res: any) => {
          toast.success(res?.message);
          navigate("/auth/login")
        },
        onError: (res: any) => {
          console.log("ERROR: ", res)
          toast.error(res?.message)
        }
      })

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className={cn("space-y-8", className)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jane@students.mak.ac.ug" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is student or lecturer email.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="jane256" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is student or lecturer email.
                  </FormDescription> */}
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
                    <PasswordInput placeholder="*******" {...field} type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>Signup</Button>
          </form>
        </Form>
      )
}
