import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaintComment {
  sender: string;
  senderRole: string;
  message: string;
  createdAt: Date;
}

export interface IComplaint extends Document {
  complaintNo: string;
  employeeNo: string;
  employeeName: string;
  department: string;
  category: string;
  subType: string;
  description: string;
  preferredLanguage?: 'en' | 'si';
  status: 'PENDING' | 'UNDER REVIEW' | 'RESOLVED' | 'REJECTED';
  openedBy?: {
    officerId: string;
    officerName: string;
    openedAt: Date;
  };
  assignedOfficer?: {
    officerId: string;
    officerName: string;
  };
  comments: IComplaintComment[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema = new Schema(
  {
    complaintNo: { type: String, required: true, unique: true },
    employeeNo: { type: String, required: true },
    employeeName: { type: String, required: true, default: 'Employee' },
    department: { type: String, required: true, default: 'HR' },
    category: { type: String, required: true },
    subType: { type: String, required: true },
    description: { type: String, required: true },
    preferredLanguage: { type: String, enum: ['en', 'si'], default: 'en' },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'PENDING',
    },
    openedBy: {
      officerId: { type: String },
      officerName: { type: String },
      openedAt: { type: Date },
    },
    assignedOfficer: {
      officerId: { type: String },
      officerName: { type: String },
    },
    comments: [
      {
        sender: { type: String, required: true },
        senderRole: { type: String, required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);

