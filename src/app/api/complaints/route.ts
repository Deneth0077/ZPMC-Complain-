import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Complaint from "@/models/Complaint";
import Notification from "@/models/Notification";

const JWT_SECRET = process.env.JWT_SECRET || "hambantota_port_hr_jwt_secret_2026_key";

interface UserJwtPayload {
  id: string;
  employeeNo: string;
  name: string;
  role: string;
  department?: string;
}

function getUserFromAuthHeader(req: Request): UserJwtPayload | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET) as UserJwtPayload;
  } catch {
    return null;
  }
}

// POST: Submit a new complaint
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      employeeNo,
      employeeName,
      department,
      category,
      subType,
      description,
      preferredLanguage,
      attachments,
    } = body;

    if (!category || !subType || !description) {
      return NextResponse.json(
        { error: "Category, subType, and description are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Auto-generate Complaint Number (e.g. CMP-2026-1084)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const complaintNo = `CMP-${new Date().getFullYear()}-${randomSuffix}`;

    const newComplaint = await Complaint.create({
      complaintNo,
      employeeNo: employeeNo || "1234",
      employeeName: employeeName || "Hambantota Port Employee",
      department: department || "HR",
      category,
      subType,
      description,
      preferredLanguage: preferredLanguage || "en",
      status: "PENDING",
      attachments: attachments || [],
      comments: [],
    });

    // Create Notification for HR Officers & HR Manager
    await Notification.create({
      recipientRole: "all_hr",
      complaintId: String(newComplaint._id),
      group: "new_updates",
      title: `New HR Issue (${category})`,
      description: `New complaint ${complaintNo} submitted under ${subType}.`,
      statusBadge: "PENDING",
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      complaintNo: newComplaint.complaintNo,
      complaint: newComplaint,
      message: "Complaint submitted successfully to HR Department",
    });
  } catch (error) {
    console.error("Complaint Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to submit complaint", details: String(error) },
      { status: 500 }
    );
  }
}

// GET: Fetch complaints with role-based privacy rules
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const user = getUserFromAuthHeader(req);
    const url = new URL(req.url);
    const filterEmployeeNo = url.searchParams.get("employeeNo");

    let query: Record<string, unknown> = {};

    // Determine query by user role
    if (user?.role === "employee" || filterEmployeeNo) {
      query.employeeNo = user?.employeeNo || filterEmployeeNo;
    } else if (user?.role === "hr_officer" || user?.role === "hr_manager") {
      // HR users view HR department issues (modular for multi-dept expansion)
      query.department = "HR";
    }

    const rawComplaints = await Complaint.find(query).sort({ createdAt: -1 }).lean();

    // Apply HR Officers Privacy Masking Rule
    // HR Officers MUST NOT see who opened/is handling the complaint (openedBy, assignedOfficer).
    // ONLY HR Manager (hr_manager) can see officer assignment and audit details!
    const isOfficer = user?.role === "hr_officer";

    const processedComplaints = rawComplaints.map((c: any) => {
      const item = { ...c, id: String(c._id) };
      if (isOfficer) {
        // Strip privacy metadata for fellow HR officers
        delete item.openedBy;
        delete item.assignedOfficer;
      }
      return item;
    });

    return NextResponse.json({
      success: true,
      count: processedComplaints.length,
      complaints: processedComplaints,
    });
  } catch (error) {
    console.error("Fetch Complaints Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaints", details: String(error) },
      { status: 500 }
    );
  }
}
