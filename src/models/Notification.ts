import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  employeeNo: string;
  complaintId: string;
  group: 'hr_requested_info' | 'status_changed' | 'new_updates';
  title: string;
  description: string;
  isRead: boolean;
  statusBadge?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  employeeNo: { type: String, required: true },
  complaintId: { type: String, required: true },
  group: {
    type: String,
    enum: ['hr_requested_info', 'status_changed', 'new_updates'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  statusBadge: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
