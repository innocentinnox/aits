import axiosInstance from "@/lib/axios-instance";
class IssueService {
  async categories() {
    try {
      const res = await axiosInstance.get("/issues/categories/");
      return res.data as { id: number; name: string; description: string }[];
    } catch (error: any) {
      console.log("FETCH_CATEGORIES_ERR", error);
      return [];
    }
  }

  async create(values: any) {
    console.log("VALUES: ", values);
    try {
      // Create a FormData object to hold your data and files.
      const formData = new FormData();

      // Append text fields to the FormData.
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category.toString());
      formData.append("course_unit", values.course_unit.toString());
      formData.append("year", values.year.toString());
      formData.append("course", values.course.toString());
      formData.append("college", values.college.toString());

      // Append attachments if available.
      // This assumes that values.attachments is an array of File objects.
      if (values.attachments && Array.isArray(values.attachments)) {
        values.attachments.forEach((file: File) => {
          formData.append("attachments", file);
        });
      }      // Post the FormData to the endpoint.
      const res = await axiosInstance.post("/issues/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("RESPONSE: ", res.data);
      return { message: res.data.message || "Issue created successfully" };
    } catch (error: any) {
      console.log("FETCH_CATEGORIES_ERR", error);
      throw new Error(
        error?.response?.data.message || "Failed to create issue"
      );
    }
  }  async resolve(token: string) {
    try {
      const res = await axiosInstance.patch(`/issues/update/${token}/`, {
        action: "resolve",
      });

      return res.data as { id: number; name: string; description: string }[];
    } catch (error: any) {
      console.error(error);
      throw new Error(error?.response?.data?.message || "Failed to resolve issue");
    }
  }
  async resolveWithDetails(token: string, resolution_details: string) {
    try {
      const res = await axiosInstance.patch(`/issues/update/${token}/`, {
        action: "resolve",
        resolution_details
      });

      return res.data;
    } catch (error: any) {
      console.error("Error resolving issue:", error);
      throw new Error(error?.response?.data?.message || "Failed to resolve issue");
    }
  }
  async forward(token: string, forwarded_to: number) {
    try {
      const res = await axiosInstance.patch(`/issues/update/${token}/`, {
        action: "forward",
        forwarded_to
      });

      return res.data;
    } catch (error: any) {
      console.error("Error forwarding issue:", error);
      throw new Error(error?.response?.data?.message || "Failed to forward issue");
    }
  }async departments(schoolId?: number) {
    try {
      const params = schoolId ? { school_id: schoolId } : {};
      console.log("issueService.departments - params:", params);
      console.log("issueService.departments - schoolId:", schoolId);
      const res = await axiosInstance.get("/accounts/departments/", { params });
      console.log("issueService.departments - response:", res.data);
      return res.data as { id: number; name: string; code: string }[];
    } catch (error: any) {
      console.error("Error fetching departments:", error);
      throw new Error(error?.response?.data?.message || "Failed to fetch departments");
    }
  }  async departmentsByParams(params: { school_id?: number; college_id?: number }) {
    try {
      const res = await axiosInstance.get("/accounts/departments/", { params });
      return res.data as { id: number; name: string; code: string }[];
    } catch (error: any) {
      console.error("Error fetching departments by params:", error);
      throw new Error(error?.response?.data?.message || "Failed to fetch departments");
    }
  }  async lecturers(collegeId?: number, departmentId?: number) {
    try {
      const params: any = {};
      if (collegeId) params.college_id = collegeId;
      if (departmentId) params.department_id = departmentId;
      
      const res = await axiosInstance.get("/accounts/lecturers/", { params });
      return res.data as { id: number; first_name: string; last_name: string; email: string; full_name: string }[];
    } catch (error: any) {
      console.error("Error fetching lecturers:", error);
      throw new Error(error?.response?.data?.message || "Failed to fetch lecturers");
    }
  }  async fetchLecturerIssues(params?: Record<string, any>) {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "" && 
              !(Array.isArray(value) && value.length === 0)) {
            if (Array.isArray(value)) {
              searchParams.append(key, value.join(","));
            } else {
              searchParams.append(key, value.toString());
            }
          }
        });
      }      const queryString = searchParams.toString();
      const url = queryString 
        ? `/issues/lecturer-view/?${queryString}`
        : "/issues/lecturer-view/";
        
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error: any) {
      console.error("Error fetching lecturer issues:", error);
      throw new Error(error?.response?.data?.message || "Failed to fetch lecturer issues");
    }
  }
}

export const issueService = new IssueService();
