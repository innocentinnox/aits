import { z } from "zod";
// Schema for the onboarding fields.
// These fields are in addition to the signup fields which are already provided.
//
export const OnboardingSchema = z
  .object({
    college: z.string().min(1, "College is required"),
    school: z.string().optional(),
    department: z.string().optional(),
    course: z.string().optional(),
    student_number: z.string().optional(),
    registration_number: z.string().optional(),
  })
  .refine(data => !data.student_number || Boolean(data.registration_number), {
    message: "Registration number is required.",
    path: ["registration_number"],
  })
  .refine(data => !data.registration_number || Boolean(data.student_number), {
    message: "Student number is required.",
    path: ["student_number"],
  });