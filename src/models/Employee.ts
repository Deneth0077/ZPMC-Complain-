import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employeeNo: string;
  pin: string;
  name: string;
  phone: string;
  workingSite?: string;
  nic?: string;
  department?: string;
  designation?: string;
  avatarUrl?: string;
  role: string;
  createdAt: Date;
}

const EmployeeSchema: Schema = new Schema({
  employeeNo: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  workingSite: { type: String, required: true, default: 'HIPG' },
  nic: { type: String, required: false },
  department: { type: String, default: 'Port Operations' },
  designation: { type: String, default: 'Employee' },
  avatarUrl: { type: String, default: '' },
  role: { type: String, default: 'employee' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
