// Helper function to format and print issue details
import { formatDate as formatDateTime } from './utils';
import axiosInstance from './axios-instance';

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
  course_unit: number | { id: number; name: string; code?: string; title?: string };
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
const getEntityName = (entity: number | { id: number; name?: string; title?: string; code?: string }) => {
  if (entity === null || entity === undefined) return 'Not specified';
  if (typeof entity === 'object') {
    return entity.name || entity.title || `${entity.code || ''} ${entity.title || ''}`.trim() || 'Unknown';
  }
  return `${entity}`; // Return as string if it's a number
};

export const printIssue = async (issue: IssueDetails) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print issue details');
    return;
  }

  // Initialize with current values (which might be IDs)
  let collegeName = issue.college_name || getEntityName(issue.college);
  let courseName = issue.course_name || getEntityName(issue.course);
  let courseUnitName = issue.course_unit_name || getEntityName(issue.course_unit);
  let categoryName = issue.category_name || `Category ${issue.category}`;

  try {
    // Fetch all colleges and find the one matching our ID
    if (typeof issue.college === 'number') {
      const collegeResponse = await axiosInstance.get('/accounts/colleges/');
      if (collegeResponse.data && Array.isArray(collegeResponse.data)) {
        const college = collegeResponse.data.find((c: CollegeEntity) => c.id === issue.college);
        if (college) {
          collegeName = college.name;
        }
      }
    }

    // Fetch all courses and find the one matching our ID
    if (typeof issue.course === 'number') {
      const courseResponse = await axiosInstance.get('/accounts/courses/');
      if (courseResponse.data && Array.isArray(courseResponse.data)) {
        const course = courseResponse.data.find((c: CourseEntity) => c.id === issue.course);
        if (course) {
          courseName = course.name;
        }
      }
    }

    // Fetch all course units and find the one matching our ID
    if (typeof issue.course_unit === 'number' && issue.course_unit) {
      const unitResponse = await axiosInstance.get('/accounts/course-units/');
      if (unitResponse.data && Array.isArray(unitResponse.data)) {
        const unit = unitResponse.data.find((u: CourseUnitEntity) => u.id === issue.course_unit);
        if (unit) {
          courseUnitName = unit.code ? `${unit.code}: ${unit.title}` : unit.title;
        }
      }
    }

    // Try to fetch category name if available
    try {
      const categoryResponse = await axiosInstance.get('/issues/categories/');
      if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
        const category = categoryResponse.data.find((c: CategoryEntity) => c.id === issue.category);
        if (category) {
          categoryName = category.name;
        }
      }
    } catch (error) {
      // Silently handle category error - not critical
      console.log('Could not fetch category name, using default');
    }
  } catch (error) {
    console.error('Error fetching entity details:', error);
    // Continue with what we have if fetch fails
  }

  // Format created_by name
  const createdByName = `${issue.created_by.first_name} ${issue.created_by.last_name}`;

  // Format assigned_to name
  const assignedToName = `${issue.assigned_to.first_name} ${issue.assigned_to.last_name}`;

  // Format forwarded_to name if exists
  const forwardedToName = issue.forwarded_to
    ? `${issue.forwarded_to.first_name} ${issue.forwarded_to.last_name}`
    : 'N/A';

  // Format dates
  const createdAt = formatDateTime(issue.created_at);
  const updatedAt = formatDateTime(issue.updated_at);
  const resolvedAt = issue.resolved_at ? formatDateTime(issue.resolved_at) : 'Not yet resolved';

  // Convert semester number to readable form
  const semesterName = issue.semester === 1 ? "Semester 1" :
    issue.semester === 2 ? "Semester 2" :
      `Semester ${issue.semester}`;

  // Print document HTML
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Issue ${issue.token} - Print</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
        .issue-title {
          font-size: 22px;
          font-weight: bold;
          margin: 20px 0 10px;
        }
        .issue-token {
          color: #666;
          font-size: 14px;
        }
        .issue-status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          background-color: ${issue.status === 'resolved' ? '#d1fae5' : '#fef3c7'};
          color: ${issue.status === 'resolved' ? '#065f46' : '#92400e'};
        }
        .section {
          margin: 20px 0;
          border-bottom: 1px solid #ddd;
          padding-bottom: 15px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #1f2937;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .label {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }
        .value {
          font-weight: 500;
        }
        .full-width {
          grid-column: span 2;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          text-align: center;
          color: #666;
        }
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">AITS - Academic Issue Tracking System</div>
        <p>Official Issue Record</p>
      </div>

      <div class="issue-title">
        ${issue.title} 
        <span class="issue-token">(${issue.token})</span>
      </div>
      
      <div>
        <span class="issue-status">${issue.status.toUpperCase()}</span>
        <span style="margin-left: 10px; color: #666;">Category: ${categoryName}</span>
      </div>

      <div class="section">
        <div class="section-title">Description</div>
        <p>${issue.description}</p>
      </div>

      <div class="section">
        <div class="section-title">Academic Information</div>
        <div class="grid">
          <div>
            <div class="label">College</div>
            <div class="value">${collegeName}</div>
          </div>
          <div>
            <div class="label">Course</div>
            <div class="value">${courseName}</div>
          </div>
          <div>
            <div class="label">Course Unit</div>
            <div class="value">${courseUnitName || 'Not specified'}</div>
          </div>
          <div>
            <div class="label">Year of Study</div>
            <div class="value">Year ${issue.year_of_study}</div>
          </div>
          <div>
            <div class="label">Semester</div>
            <div class="value">${semesterName}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">People</div>
        <div class="grid">
          <div>
            <div class="label">Created By</div>
            <div class="value">${createdByName}</div>
            <div>${issue.created_by.email}</div>
          </div>
          <div>
            <div class="label">Assigned To</div>
            <div class="value">${assignedToName}</div>
            <div>${issue.assigned_to.email}</div>
          </div>
          <div>
            <div class="label">Forwarded To</div>
            <div class="value">${forwardedToName}</div>
            ${issue.forwarded_to ? `<div>${issue.forwarded_to.email}</div>` : ''}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Timeline</div>
        <div class="grid">
          <div>
            <div class="label">Created At</div>
            <div class="value">${createdAt}</div>
          </div>
          <div>
            <div class="label">Last Updated</div>
            <div class="value">${updatedAt}</div>
          </div>
          <div>
            <div class="label">Resolved At</div>
            <div class="value">${resolvedAt}</div>
          </div>
        </div>
      </div>

      ${issue.resolution_details ? `
        <div class="section">
          <div class="section-title">Resolution Details</div>
          <p>${issue.resolution_details}</p>
        </div>
      ` : ''}

      ${issue.attachments && issue.attachments.length > 0 ? `
        <div class="section">
          <div class="section-title">Attachments</div>
          <p>${issue.attachments.length} attachment(s)</p>
        </div>
      ` : ''}

      <div class="footer">
        <p>Printed on ${new Date().toLocaleString()}</p>
        <p>AITS - Academic Issue Tracking System - Document for record-keeping purposes</p>
      </div>

      <div class="no-print">
        <p style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print Document
          </button>
          <button onclick="window.close();" style="padding: 10px 20px; margin-left: 10px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Close
          </button>
        </p>
      </div>
    </body>
    </html>
  `;

  // Write the HTML to the new window and print it
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
};