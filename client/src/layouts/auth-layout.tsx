import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

import IvoryTower from  "@/assets/Ivory-Tower.jpeg";
import { Outlet } from "react-router-dom";

export const AuthLayout = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (     <div className="grid place-items-center min-h-[100vh]">
        <div className={cn("flex flex-col gap-6 w-[90%] md:w-[70%] lg:w-[900px]", className)} {...props}>
          <Card className="overflow-hidden">
            <div className="grid p-0 md:grid-cols-[50%_50%]">
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6 min-h-[520px] content-center justify-between">
                  <Outlet /> {/* Renders the child route (e.g., Login, Signup) */}
                </div>
              </div>
              <div className="relative hidden bg-muted md:block">
                <img
                  src={IvoryTower}
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </div>
          </Card>
     
        </div>
        </div> );
}
