import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  employeeNo?: string;
  recipientRole?: 'employee' | 'hr_officer' | 'hr_manager' | 'all_hr';
  complaintId?: string;
  group: 'hr_requested_info' | 'status_changed' | 'new_updates';
  title: string;
  description: string;
  isRead: boolean;
  statusBadge?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  employeeNo: { type: String },
  recipientRole: { type: String, enum: ['employee', 'hr_officer', 'hr_manager', 'all_hr'], default: 'employee' },
  complaintId: { type: String },
  group: {
    type: String,
    enum: ['hr_requested_info', 'status_changed', 'new_updates'],
    required: true,
    default: 'new_updates',
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  statusBadge: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

