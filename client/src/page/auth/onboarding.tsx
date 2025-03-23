"use client";

import { OnboardingForm } from "@/components/auth/onboarding/onboarding-form";
import { CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left sidebar with steps */}
      <div className="hidden w-[400px] bg-primary text-white md:block">
        <div className="flex h-full flex-col p-8">
          <div className="mb-16">
            <div className="flex items-center gap-2 text-xl font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                  <path d="M3 9h18" />
                </svg>
              </div>
              <span>Onboarding</span>
            </div>
          </div>

    <div className="flex justify-between flex-col h-full">
            <div className="space-y-8">
                <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Create your AITS Account</h3>
                    <p className="mt-1 text-blue-200">Completed</p>
                </div>
                </div>

                <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">
                    <span className="text-lg font-bold">2</span>
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Update Your Profile</h3>
                    <p className="mt-1 text-blue-200">Almost there...</p>
                </div>
                </div>
            </div>
            <p className="text-white mt-2">Welcome to AITS! Our system streamlines academic issue management, enhancing transparency and efficiency for students, lecturers, and administrators. Please complete your profile to personalize your experience and receive timely updates.</p>
    </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Tell us more about yourself.</h1>
            {/* <p className="text-muted-foreground mt-2">
              Tell us more about yourself to get started.
            </p> */}
          </div>
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
