"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios-instance";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { OnboardingSchema } from "./schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useAuth } from "@/auth";
import { useNavigate } from "react-router-dom";



type OnboardingFormValues = z.infer<typeof OnboardingSchema>;

export const OnboardingForm = () => {
  const { user, checkAuthStatus } = useAuth();
  const role = user?.role;
  
  const navigate = useNavigate();
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      college: "",
      school: "",
      department: "",
      course: "",
      student_number: user?.student_number || "",
      registration_number: user?.registration_number || "",
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

  // Fetch courses when a school is selected
  // const departmentId = form.watch("department");
  const { data: courses, isPending: fetchingCourses } = useQuery({
    queryKey: ["courses", schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      const res = await axiosInstance.get("/accounts/courses/", { params: { school_id: schoolId } });
      return res.data as { id: number; name: string }[];
    },
    enabled: !!schoolId,
  });

  // Determine which fields to show based on the user role:
  // - All users must select a college.
  // - Registrar might not need school or department.
  // - Department_head needs at least school.
  // - Lecturer and student need school, department, and course.
  // - Student also provides student_number and registration_number.
  const showSchool = role !== "registrar";
  const showDepartment = role === "lecturer" || role === "department_head";
  const showCourse = role === "student" || role === "lecturer";
  const showStudentFields = role === "student";


  // Form submission
  const { mutate: onSubmit, isPending: updatingProfile } = useMutation({
    mutationFn: async (values: OnboardingFormValues) => {
      console.log("Submitting: ", values);
      const res = await axiosInstance.put("/accounts/profile/", values);
      checkAuthStatus()
      .then(() => navigate(DEFAULT_LOGIN_REDIRECT))
      return res.data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
  });

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
                  <Select value={field.value} onValueChange={field.onChange} disabled={fetchingCourses || !schoolId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={schoolId && fetchingCourses ? "Loading..." : "Select Course"} />
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

        <Button type="submit" className="w-full !mt-4" disabled={updatingProfile}>
          {updatingProfile ? "Updating..." : "Complete Profile"}
        </Button>
        {/* <Button>Update Profile</Button> */}
      </form>
    </Form>
  );
};