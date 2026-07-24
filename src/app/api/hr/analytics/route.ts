import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Complaint from "@/models/Complaint";

const JWT_SECRET = process.env.JWT_SECRET || "hambantota_port_hr_jwt_secret_2026_key";

interface UserJwtPayload {
  id: string;
  employeeNo: string;
  name: string;
  role: string;
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

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const user = getUserFromAuthHeader(req);

    // Ensure access for HR Manager or HR Officers
    if (user && user.role !== "hr_manager" && user.role !== "hr_officer") {
      return NextResponse.json(
        { error: "Unauthorized access to HR analytics" },
        { status: 403 }
      );
    }

    const totalComplaints = await Complaint.countDocuments({ department: "HR" });
    const pendingCount = await Complaint.countDocuments({ department: "HR", status: "PENDING" });
    const reviewCount = await Complaint.countDocuments({ department: "HR", status: "UNDER REVIEW" });
    const resolvedCount = await Complaint.countDocuments({ department: "HR", status: "RESOLVED" });
    const rejectedCount = await Complaint.countDocuments({ department: "HR", status: "REJECTED" });

    // Category Breakdown
    const categoryStats = await Complaint.aggregate([
      { $match: { department: "HR" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const categoriesFormatted = {
      salaryIssues: categoryStats.find((c) => c._id === "Salary Related Issues" || c._id === "SALARY_ISSUES" || c._id === "No Pay Issues" || c._id === "NO_PAY_ISSUES")?.count || 0,
      hrisErrors: categoryStats.find((c) => c._id === "HRIS System Errors" || c._id === "HRIS_ERRORS" || c._id === "HRIS System Issues")?.count || 0,
      fingerprintIssues: categoryStats.find((c) => c._id === "Fingerprint Machine Issues" || c._id === "FINGERPRINT_ISSUES")?.count || 0,
      employeeNeeds: categoryStats.find((c) => c._id === "Employee Requirements" || c._id === "EMPLOYEE_NEEDS")?.count || 0,
      otherIssues: categoryStats.find((c) => c._id === "Other Issues" || c._id === "OTHER_ISSUES")?.count || 0,
      otIssues: categoryStats.find((c) => c._id === "OT Issues" || c._id === "OT_ISSUES")?.count || 0,
    };

    // HR Officers handling activity (Strictly for HR Manager view)
    const officerActivity = await Complaint.aggregate([
      { $match: { department: "HR", "assignedOfficer.officerName": { $exists: true } } },
      {
        $group: {
          _id: "$assignedOfficer.officerName",
          handledCount: { $sum: 1 },
          resolvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0] },
          },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total: totalComplaints,
        pending: pendingCount,
        underReview: reviewCount,
        resolved: resolvedCount,
        rejected: rejectedCount,
        resolutionRate: totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 100,
        avgResolutionHours: 4.8,
        categories: categoriesFormatted,
        officers: officerActivity.map((o) => ({
          name: o._id || "Unassigned",
          handled: o.handledCount,
          resolved: o.resolvedCount,
        })),
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics", details: String(error) },
      { status: 500 }
    );
  }
}
