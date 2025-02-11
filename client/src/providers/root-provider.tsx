"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/theme-provider";
// import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
// import { AuthProvider } from "./auth/auth-provider";

function RootProvider({ children }: { children: ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({}));
  return (
    // <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
            defaultTheme="light"
            storageKey="vite-ui-theme"
          >
        {/* <TooltipProvider> */}
          {children}
          <Toaster />
        {/* </TooltipProvider> */}
        </ThemeProvider>
      </QueryClientProvider>
    // </AuthProvider>
  );
}

export default RootProvider;
