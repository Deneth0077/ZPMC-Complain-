import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  complaintNo: string;
  employeeNo: string;
  category: string;
  subType: string;
  description: string;
  status: 'PENDING' | 'UNDER REVIEW' | 'RESOLVED' | 'REJECTED';
  assignedOfficer?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema = new Schema(
  {
    complaintNo: { type: String, required: true, unique: true },
    employeeNo: { type: String, required: true },
    category: { type: String, required: true },
    subType: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'PENDING',
    },
    assignedOfficer: { type: String },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
