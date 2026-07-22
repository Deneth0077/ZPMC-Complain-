import { NextResponse } from "next/server";

const mockNotifications = [
  {
    id: "notif-1",
    complaintId: "COMP-4829",
    group: "hr_requested_info",
    title: "Medical Certificate Missing",
    description: "HR requires a scanned copy of your official medical certificate to process...",
    timeAgo: "2h ago",
    isRead: false,
    badgeType: "red_alert",
  },
  {
    id: "notif-2",
    complaintId: "COMP-4712",
    group: "status_changed",
    title: "Moved to Investigation",
    description: 'Your grievance regarding "Safety Equipment Delay" has been assigned to a senior officer.',
    timeAgo: "5h ago",
    isRead: true,
    statusBadge: "UNDER REVIEW",
    badgeType: "status_change",
  },
  {
    id: "notif-3",
    complaintId: "COMP-4501",
    group: "status_changed",
    title: "Resolution Finalized",
    description: 'The "Overtime Discrepancy" complaint has been resolved. Check your dashboard for the final report.',
    timeAgo: "Yesterday",
    isRead: false,
    statusBadge: "RESOLVED",
    badgeType: "status_change",
  },
  {
    id: "notif-4",
    complaintId: "COMP-4900",
    group: "new_updates",
    title: "New Comment from HR",
    description: '"We have contacted the department head regarding the workstation ergonomics request..."',
    dateStr: "Oct 24",
    isRead: true,
    badgeType: "comment",
  },
  {
    id: "notif-5",
    complaintId: "COMP-4882",
    group: "new_updates",
    title: "Document Attached",
    description: "An 'Official Policy Reference' has been attached to your pending complaint.",
    dateStr: "Oct 22",
    isRead: true,
    badgeType: "attachment",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    notifications: mockNotifications,
  });
}

export async function PATCH() {
  return NextResponse.json({
    success: true,
    message: "All notifications marked as read",
  });
}
