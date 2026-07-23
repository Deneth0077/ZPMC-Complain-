export type UserRole = 'employee' | 'hr_officer' | 'hr_manager' | 'super_admin' | 'it_support';

export interface Employee {
  id: string;
  employeeNo: string;
  name: string;
  phone: string;
  workingSite?: string;
  nic?: string;
  department: string;
  designation: string;
  avatarUrl?: string;
  role: UserRole;
}

export type ComplaintStatus = 'PENDING' | 'UNDER REVIEW' | 'RESOLVED' | 'REJECTED';
export type CategoryType = 'OT_ISSUES' | 'HRIS_ERRORS' | 'NO_PAY_ISSUES' | 'OTHER_ISSUES';

export interface NotificationItem {
  id: string;
  complaintId: string;
  group: 'hr_requested_info' | 'status_changed' | 'new_updates';
  title: string;
  description: string;
  timeAgo: string;
  dateStr?: string;
  isRead: boolean;
  statusBadge?: 'UNDER REVIEW' | 'RESOLVED' | 'PENDING' | 'REJECTED';
  badgeType?: 'red_alert' | 'status_change' | 'comment' | 'attachment';
}

export interface Complaint {
  id: string;
  complaintNo: string;
  category: CategoryType;
  categoryTitle: string;
  subType: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  employeeNo: string;
  assignedOfficer?: string;
}
