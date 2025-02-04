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
import { toast } from "@/hooks/use-toast"
import { authService } from "../services"
import { useNavigate } from "react-router-dom"
import { CalendarCheck2 } from "lucide-react"
import GoogleIcon from "@/icons/Google"
// import GoogleIcon from "@/icons/Google"
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20)
});



const LoginForm = ({ className }:{ className?: string }) => {

    const navigation = useNavigate()

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
             toast({
                 title: "Info",
                 description: res?.message,
               });
               navigation("/dashboard")
         })
         .catch((res) => {
             toast({
                 title: "Info",
                 description: res?.message,
               })
         })
      }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8", "w-[20rem]")}>
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
            <GoogleIcon />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*******" {...field} type="password"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
}
export default LoginForm;