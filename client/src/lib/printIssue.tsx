// Helper function to format and print issue details
import { formatDate as formatDateTime } from "./utils";
import axiosInstance from "./axios-instance";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface CollegeEntity {
  id: number;
  name: string;
}

interface CourseEntity {
  id: number;
  name: string;
}

interface CourseUnitEntity {
  id: number;
  title: string;
  code?: string;
}

interface CategoryEntity {
  id: number;
  name: string;
}

export interface IssueDetails {
  id: number;
  token: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  category: number;
  category_name?: string;
  college: number | { id: number; name: string };
  college_name?: string;
  course: number | { id: number; name: string };
  course_name?: string;
  course_unit:
    | number
    | { id: number; name: string; code?: string; title?: string };
  course_unit_name?: string;
  semester: number;
  year_of_study: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolution_details: string | null;
  created_by: User;
  assigned_to: User;
  modified_by: User | null;
  closed_by: User | null;
  forwarded_to: User | null;
  attachments: any[];
}

// Helper function to get formatted entity name
const getEntityName = (
  entity: number | { id: number; name?: string; title?: string; code?: string }
) => {
  if (entity === null || entity === undefined) return "Not specified";
  if (typeof entity === "object") {
    return (
      entity.name ||
      entity.title ||
      `${entity.code || ""} ${entity.title || ""}`.trim() ||
      "Unknown"
    );
  }
  return `${entity}`; // Return as string if it's a number
};

export const printIssue = async (issue: IssueDetails) => {
  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to print issue details");
    return;
  }

  // Initialize with current values (which might be IDs)
  let collegeName = issue.college_name || getEntityName(issue.college);
  let courseName = issue.course_name || getEntityName(issue.course);
  let courseUnitName =
    issue.course_unit_name || getEntityName(issue.course_unit);
  let categoryName = issue.category_name || `Category ${issue.category}`;

  try {
    // Fetch all colleges and find the one matching our ID
    if (typeof issue.college === "number") {
      const collegeResponse = await axiosInstance.get("/accounts/colleges/");
      if (collegeResponse.data && Array.isArray(collegeResponse.data)) {
        const college = collegeResponse.data.find(
          (c: CollegeEntity) => c.id === issue.college
        );
        if (college) {
          collegeName = college.name;
        }
      }
    }

    // Fetch all courses and find the one matching our ID
    if (typeof issue.course === "number") {
      const courseResponse = await axiosInstance.get("/accounts/courses/");
      if (courseResponse.data && Array.isArray(courseResponse.data)) {
        const course = courseResponse.data.find(
          (c: CourseEntity) => c.id === issue.course
        );
        if (course) {
          courseName = course.name;
        }
      }
    }

    // Fetch all course units and find the one matching our ID
    if (typeof issue.course_unit === "number" && issue.course_unit) {
      const unitResponse = await axiosInstance.get("/accounts/course-units/");
      if (unitResponse.data && Array.isArray(unitResponse.data)) {
        const unit = unitResponse.data.find(
          (u: CourseUnitEntity) => u.id === issue.course_unit
        );
        if (unit) {
          courseUnitName = unit.code
            ? `${unit.code}: ${unit.title}`
            : unit.title;
        }
      }
    }

    // Try to fetch category name if available
    try {
      const categoryResponse = await axiosInstance.get("/issues/categories/");
      if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
        const category = categoryResponse.data.find(
          (c: CategoryEntity) => c.id === issue.category
        );
        if (category) {
          categoryName = category.name;
        }
      }
    } catch (error) {
      // Silently handle category error - not critical
      console.log("Could not fetch category name, using default");
    }
  } catch (error) {
    console.error("Error fetching entity details:", error);
    // Continue with what we have if fetch fails
  }

  // Format created_by name
  const createdByName = `${issue.created_by.first_name} ${issue.created_by.last_name}`;

  // Format assigned_to name
  const assignedToName = `${issue.assigned_to.first_name} ${issue.assigned_to.last_name}`;

  // Format forwarded_to name if exists
  const forwardedToName = issue.forwarded_to
    ? `${issue.forwarded_to.first_name} ${issue.forwarded_to.last_name}`
    : "N/A";

  // Format dates
  const createdAt = formatDateTime(issue.created_at);
  const updatedAt = formatDateTime(issue.updated_at);
  const resolvedAt = issue.resolved_at
    ? formatDateTime(issue.resolved_at)
    : "Not yet resolved";

  // Convert semester number to readable form
  const semesterName =
    issue.semester === 1
      ? "Semester 1"
      : issue.semester === 2
      ? "Semester 2"
      : `Semester ${issue.semester}`;

  // Print document HTML
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Issue ${issue.token} - Official Record</title>
    <style>
      @page {
        size: A4;
        margin: 10mm;
      }
      body {
        font-family: "Arial", sans-serif;
        line-height: 1.3;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 0;
        background-color: #f9fafb;
      }
      .document {
        background-color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 10px auto;
        /* Ensure this fits a typical A4 page */
        max-height: 277mm; /* A4 height minus margins */
      }
      .company-header {
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .company-logo {
        font-weight: bold;
      }
      .company-logo img {
        width: 70px;
        height: auto;
        margin-right: 5px;
      }
      .company-info {
        text-align: right;
        font-size: 11px;
        line-height: 1.2;
      }
      .document-title {
        text-align: center;
        margin: 0;
        padding: 6px 0;
        border-bottom: 1px solid #f3f4f6;
        font-size: 16px;
        font-weight: bold;
      }
      .content {
        padding: 8px 12px;
      }
      .issue-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding-bottom: 5px;
        border-bottom: 1px solid #e5e7eb;
      }
      .issue-title {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
      }
      .issue-token {
        color: #666;
        font-size: 11px;
        display: block;
        margin-top: 2px;
      }
      .issue-meta {
        text-align: right;
      }
      .issue-status {
        display: inline-block;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
        font-size: 11px;
      }
      .section {
        margin: 8px 0;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 6px;
      }
      .section-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 6px;
        color: #1e3a8a;
        padding-bottom: 2px;
        border-bottom: 1px dashed #ccc;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .field {
        margin-bottom: 6px;
      }
      .label {
        font-size: 11px;
        color: #666;
        margin-bottom: 1px;
        font-weight: 500;
      }
      .value {
        font-weight: 600;
        padding: 1px 0;
        font-size: 12px;
      }
      .full-width {
        grid-column: span 2;
      }
      .document-footer {
        background-color: #f3f4f6;
        padding: 6px;
        text-align: center;
        font-size: 10px;
        color: #666;
        border-top: 1px solid #e5e7eb;
      }
      .footer-logo {
        font-weight: bold;
        margin-bottom: 2px;
      }
      .ref-number {
        font-family: monospace;
        background: #f3f4f6;
        padding: 1px 3px;
        border-radius: 2px;
        font-size: 11px;
        border: 1px solid #e5e7eb;
      }
      p {
        margin: 2px 0;
      }
      @media print {
        body {
          padding: 0;
          margin: 0;
          background-color: white;
        }
        .document {
          margin: 0;
          box-shadow: none;
        }
        .no-print {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="document">
      <div class="company-header">
        <div class="company-logo">
          <img
            src="https://cocis.mak.ac.ug/wp-content/uploads/2023/11/Mak-Logo.png"
            alt="mak-logo"
          />
        </div>
        <div class="company-info">
          <div>Makerere University</div>
          <div>Academic Issue Tracking System</div>
          <div>Tel: +1 (555) 123-4567</div>
          <div>support@aits.edu</div>
        </div>
      </div>

      <div class="document-title">OFFICIAL ISSUE RECORD</div>

      <div class="content">
        <div class="issue-header">
          <div>
            <h1 class="issue-title">
              ${issue.title}
              <span class="issue-token">${issue.token}</span>
            </h1>
          </div>
          <div class="issue-meta">
            <span class="issue-status">${issue.status.toUpperCase()}</span>
            <div style="margin-top: 4px; color: #666; font-size: 11px;">
              Ref: <span class="ref-number">AITS-${issue.token}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Issue Details</div>
          <div class="field">
            <div class="label">Category</div>
            <div class="value">${categoryName}</div>
          </div>
          <div class="field">
            <div class="label">Description</div>
            <div class="value">${issue.description}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Academic Information</div>
          <div class="grid">
            <div class="field">
              <div class="label">College</div>
              <div class="value">${collegeName}</div>
            </div>
            <div class="field">
              <div class="label">Course</div>
              <div class="value">${courseName}</div>
            </div>
            <div class="field">
              <div class="label">Course Unit</div>
              <div class="value">${courseUnitName || "Not specified"}</div>
            </div>
            <div class="field">
              <div class="label">Year of Study</div>
              <div class="value">Year ${issue.year_of_study}</div>
            </div>
            <div class="field">
              <div class="label">Semester</div>
              <div class="value">${semesterName}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Responsible Personnel</div>
          <div class="grid">
            <div class="field">
              <div class="label">Created By</div>
              <div class="value">${createdByName}</div>
              <div style="font-size: 11px;">${issue.created_by.email}</div>
            </div>
            <div class="field">
              <div class="label">Assigned To</div>
              <div class="value">${assignedToName}</div>
              <div style="font-size: 11px;">${issue.assigned_to.email}</div>
            </div>
            <div class="field">
              <div class="label">Forwarded To</div>
              <div class="value">${forwardedToName}</div>
              ${
                issue.forwarded_to
                  ? `
              <div style="font-size: 11px;">${issue.forwarded_to.email}</div>
              `
                  : ""
              }
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Timeline Information</div>
          <div class="grid">
            <div class="field">
              <div class="label">Created At</div>
              <div class="value">${createdAt}</div>
            </div>
            <div class="field">
              <div class="label">Last Updated</div>
              <div class="value">${updatedAt}</div>
            </div>
            <div class="field">
              <div class="label">Resolved At</div>
              <div class="value">${resolvedAt}</div>
            </div>
          </div>
        </div>

        ${
          issue.resolution_details
            ? `
        <div class="section">
          <div class="section-title">Resolution Details</div>
          <div class="field full-width">
            <div class="value" style="max-height: 60px; overflow-y: auto;">${issue.resolution_details}</div>
          </div>
        </div>
        `
            : ""
        } ${
    issue.attachments && issue.attachments.length > 0
      ? `
        <div class="section">
          <div class="section-title">Attachments</div>
          <div class="field">
            <div class="value">${issue.attachments.length} attachment(s)</div>
          </div>
        </div>
        `
      : ""
  }
      </div>

      <div class="document-footer">
        <div class="footer-logo">AITS - Academic Issue Tracking System</div>
        <p>This is an official document generated on ${new Date().toLocaleString()}</p>
        <p>This document is for record-keeping purposes and is valid without signature.</p>
      </div>
    </div>

    <div class="no-print">
      <p style="text-align: center; margin: 10px 0">
        <button
          onclick="window.print();"
          style="
            padding: 6px 12px;
            background: #1e3a8a;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
          "
        >
          Print Document
        </button>
        <button
          onclick="window.close();"
          style="
            padding: 6px 12px;
            margin-left: 8px;
            background: #6b7280;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
          "
        >
          Close
        </button>
      </p>
    </div>
  </body>
</html>`;

  // Write the HTML to the new window and print it
  printWindow.document.open();
  printWindow.document.close();
  printWindow.document.body.innerHTML = html;
};
