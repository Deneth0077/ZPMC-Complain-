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

// GET single complaint details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const user = getUserFromAuthHeader(req);
    const { id } = await params;


    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    // Record openedBy if HR Officer / Manager opens a PENDING issue for the first time
    if (
      (user?.role === "hr_officer" || user?.role === "hr_manager") &&
      !complaint.openedBy?.officerId
    ) {
      complaint.openedBy = {
        officerId: user.employeeNo || user.id,
        officerName: user.name || "HR Officer",
        openedAt: new Date(),
      };
      if (complaint.status === "PENDING") {
        complaint.status = "UNDER REVIEW";
      }
      await complaint.save();
    }

    const item = complaint.toObject();
    item.id = String(item._id);

    // Apply HR Privacy Shield for HR Officers
    if (user?.role === "hr_officer") {
      delete item.openedBy;
      delete item.assignedOfficer;
    }

    return NextResponse.json({ success: true, complaint: item });
  } catch (error) {
    console.error("Fetch Complaint Detail Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch complaint detail", details: String(error) },
      { status: 500 }
    );
  }
}

// PATCH update status, assign officer, or add comments
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const user = getUserFromAuthHeader(req);
    const { id } = await params;
    const body = await req.json();


    const { status, commentMessage, assignOfficerId, assignOfficerName } = body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    // Update status if provided
    if (status && ["PENDING", "UNDER REVIEW", "RESOLVED", "REJECTED"].includes(status)) {
      complaint.status = status;
    }

    // Assign officer if provided (Manager or Officer self-assign)
    if (assignOfficerId || assignOfficerName) {
      complaint.assignedOfficer = {
        officerId: assignOfficerId || user?.employeeNo || "HR-001",
        officerName: assignOfficerName || user?.name || "HR Officer",
      };
    } else if (!complaint.assignedOfficer?.officerId && user) {
      complaint.assignedOfficer = {
        officerId: user.employeeNo,
        officerName: user.name,
      };
    }

    // Add comment if provided
    if (commentMessage && commentMessage.trim()) {
      complaint.comments.push({
        sender: user?.name || "HR Team",
        senderRole: user?.role || "hr_officer",
        message: commentMessage.trim(),
        createdAt: new Date(),
      });
    }

    await complaint.save();

    // Trigger Notification for the Employee
    if (status) {
      await Notification.create({
        employeeNo: complaint.employeeNo,
        recipientRole: "employee",
        complaintId: String(complaint._id),
        group: "status_changed",
        title: `Complaint Status Updated (${complaint.complaintNo})`,
        description: `Your issue status has been updated to ${complaint.status}.`,
        statusBadge: complaint.status,
        isRead: false,
      });
    }

    const item = complaint.toObject();
    item.id = String(item._id);

    if (user?.role === "hr_officer") {
      delete item.openedBy;
      delete item.assignedOfficer;
    }

    return NextResponse.json({
      success: true,
      message: "Complaint updated successfully",
      complaint: item,
    });
  } catch (error) {
    console.error("Update Complaint Error:", error);
    return NextResponse.json(
      { error: "Failed to update complaint", details: String(error) },
      { status: 500 }
    );
  }
}
