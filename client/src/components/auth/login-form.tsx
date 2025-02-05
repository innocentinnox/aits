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
import { Link, useNavigate } from "react-router-dom"
import { authService } from "@/services"
import useUrlParams from "@/hooks/use-url-params"
import { PasswordInput } from "../ui/password-input"
import { toast } from "sonner"
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20)
});



export const LoginForm = ({ className }:{ className?: string }) => {

    const navigation = useNavigate()
    const { next, constructPath } = useUrlParams();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: ""
        },
      })

      async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
         await authService.login(values)
         .then((res) => {
             toast.success(res?.message);
               navigation("/")
         })
         .catch((res) => {
             toast.error(res?.message)
         })
      }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8")}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jane@students.mak.ac.ug" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is student or lecturer email.
                  </FormDescription>
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
                    <Link to={constructPath("/auth/reset-password", {})} className="ml-auto text-sm underline-offset-2 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="*******" {...field} type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Form>
      )
}
