import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Notification from "@/models/Notification";

const defaultNotifications = [
  {
    employeeNo: "HMPT-1234",
    complaintId: "COMP-4829",
    group: "hr_requested_info",
    title: "Medical Certificate Missing",
    description: "HR requires a scanned copy of your official medical certificate to process...",
    isRead: false,
    badgeType: "red_alert",
  },
  {
    employeeNo: "HMPT-1234",
    complaintId: "COMP-4712",
    group: "status_changed",
    title: "Moved to Investigation",
    description: 'Your grievance regarding "Safety Equipment Delay" has been assigned to a senior officer.',
    isRead: true,
    statusBadge: "UNDER REVIEW",
    badgeType: "status_change",
  },
  {
    employeeNo: "HMPT-1234",
    complaintId: "COMP-4501",
    group: "status_changed",
    title: "Resolution Finalized",
    description: 'The "Overtime Discrepancy" complaint has been resolved. Check your dashboard for the final report.',
    isRead: false,
    statusBadge: "RESOLVED",
    badgeType: "status_change",
  },
  {
    employeeNo: "HMPT-1234",
    complaintId: "COMP-4900",
    group: "new_updates",
    title: "New Comment from HR",
    description: '"We have contacted the department head regarding the workstation ergonomics request..."',
    isRead: true,
    badgeType: "comment",
  },
  {
    employeeNo: "HMPT-1234",
    complaintId: "COMP-4882",
    group: "new_updates",
    title: "Document Attached",
    description: "An 'Official Policy Reference' has been attached to your pending complaint.",
    isRead: true,
    badgeType: "attachment",
  },
];

export async function GET() {
  try {
    await connectToDatabase();

    let notifications = await Notification.find({}).sort({ createdAt: -1 });

    if (notifications.length === 0) {
      await Notification.insertMany(defaultNotifications);
      notifications = await Notification.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      notifications,
      dbConnected: true,
    });
  } catch (error) {
    console.error("Notifications API Error:", error);
    return NextResponse.json(
      { success: false, error: "Database error", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    await connectToDatabase();
    await Notification.updateMany({}, { isRead: true });

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read in MongoDB Atlas",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
