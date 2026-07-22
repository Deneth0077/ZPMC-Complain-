import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employeeNo: string;
  pin: string;
  name: string;
  phone: string;
  department: string;
  designation: string;
  avatarUrl?: string;
  role: string;
  createdAt: Date;
}

const EmployeeSchema: Schema = new Schema({
  employeeNo: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  avatarUrl: { type: String },
  role: { type: String, default: 'employee' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
