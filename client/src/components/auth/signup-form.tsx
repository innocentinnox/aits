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
  
const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
    role: z.enum(["student", "lecturer", "registrar"]),
  });


export const SignupForm = ({ className }:{ className?: string }) => {

    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
          role: "student"
        },
      })

      async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
         await authService.login(values)
         .then((res) => {
          toast.success(res?.message);
            navigate("/")
          })
          .catch((res) => {
              toast.error(res?.message)
          })
      }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", className)}>
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signup as</FormLabel>
                  <FormControl>
                    <Select  {...field}>
                        <SelectTrigger >
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="lecturer">Lecturer</SelectItem>
                            <SelectItem value="registrar">Registrar</SelectItem>
                        </SelectContent>
                    </Select>
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
                    <PasswordInput placeholder="*******" {...field} type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Signup</Button>
          </form>
        </Form>
      )
}
