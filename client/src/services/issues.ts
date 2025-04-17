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
      }

      // Post the FormData to the endpoint.
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
  }
  async resolve(token: string) {
    try {
      const res = await axiosInstance.patch(`/issues/update/${token}/`, {
        action: "resolve",
      });
      console.log("resoleved", res);
      return res.data as { id: number; name: string; description: string }[];
    } catch (error: any) {
      console.log("RESOLSLSLSLSLL", error);
      return [];
    }
  }
}

export const issueService = new IssueService();
