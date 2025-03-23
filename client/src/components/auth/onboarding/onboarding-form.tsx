"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios-instance";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { OnboardingSchema } from "./schema";



type OnboardingFormValues = z.infer<typeof OnboardingSchema>;

interface OnboardingFormProps {
  role: "student" | "lecturer" | "department_head" | "registrar";
  onSubmit: (values: OnboardingFormValues) => void;
}

export const OnboardingForm = ({ role, onSubmit }: OnboardingFormProps) => {
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      college: "",
      school: "",
      department: "",
      course: "",
      student_number: "",
      registration_number: "",
    },
  });

  // Fetch colleges on mount
  const { data: colleges, isPending: fetchingColleges } = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const res = await axiosInstance.get("/accounts/colleges/");
      console.log("Colleges: ", res.data);
      return res.data as { id: number; name: string }[];
    },
  });

  // Fetch schools when a college is selected
  const collegeId = form.watch("college");
  const { data: schools, isPending: fetchingSchools } = useQuery({
    queryKey: ["schools", collegeId],
    queryFn: async () => {
      if (!collegeId) return [];
      const res = await axiosInstance.get("/accounts/schools/", { params: { college_id: collegeId } });
      console.log("Schools: ", res.data, "collegeId: ", collegeId);
      return res.data as { id: number; name: string }[];
    },
    enabled: !!collegeId,
  });

  // Fetch departments when a school is selected
  const schoolId = form.watch("school");
  const { data: departments, isPending: fetchingDepartments } = useQuery({
    queryKey: ["departments", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const res = await axiosInstance.get("/accounts/departments/", { params: { school_id: schoolId } });
      return res.data as { id: number; name: string }[];
    },
    enabled: !!schoolId,
  });

  // Fetch courses when a department is selected
  const departmentId = form.watch("department");
  const { data: courses, isPending: fetchingCourses } = useQuery({
    queryKey: ["courses", departmentId],
    queryFn: async () => {
      if (!departmentId) return [];
      const res = await axiosInstance.get("/accounts/courses/", { params: { department_id: departmentId } });
      return res.data as { id: number; name: string }[];
    },
    enabled: !!departmentId,
  });

  // Determine which fields to show based on the user role:
  // - All users must select a college.
  // - Registrar might not need school or department.
  // - Department_head needs at least school.
  // - Lecturer and student need school, department, and course.
  // - Student also provides student_number and registration_number.
  const showSchool = role !== "registrar";
  const showDepartment = role === "student" || role === "lecturer" || role === "department_head";
  const showCourse = role === "student" || role === "lecturer";
  const showStudentFields = role === "student";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* College Select */}
        <FormField
          control={form.control}
          name="college"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange} disabled={fetchingColleges}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={fetchingColleges ? "Loading..." : "Select College"} />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges?.map((col) => (
                      <SelectItem key={col.id} value={col.id.toString()}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* School Select */}
        {showSchool && (
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} disabled={fetchingSchools || !collegeId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={collegeId && fetchingSchools ? "Loading..." : "Select School"} />
                    </SelectTrigger>
                    <SelectContent>
                      {schools?.map((sch) => (
                        <SelectItem key={sch.id} value={sch.id.toString()}>
                          {sch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Department Select */}
        {showDepartment && (
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} disabled={fetchingDepartments || !schoolId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={schoolId && fetchingDepartments ? "Loading..." : "Select Department"} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dep) => (
                        <SelectItem key={dep.id} value={dep.id.toString()}>
                          {dep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Course Select */}
        {showCourse && (
          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} disabled={fetchingCourses || !departmentId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={departmentId && fetchingCourses ? "Loading..." : "Select Course"} />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Student-specific fields */}
        {showStudentFields && (
          <>
            <FormField
              control={form.control}
              name="student_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Student Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registration_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Registration Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" className="w-full">Update Profile</Button>
      </form>
    </Form>
  );
};