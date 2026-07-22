"use client";

import React, { createContext, useContext, useState } from "react";
import { NotificationItem } from "@/types";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
}

const initialNotifications: NotificationItem[] = [
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
    timeAgo: "",
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
    timeAgo: "",
    dateStr: "Oct 22",
    isRead: true,
    badgeType: "attachment",
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
