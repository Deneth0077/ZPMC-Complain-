import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Employee from "@/models/Employee";

const JWT_SECRET = process.env.JWT_SECRET || "hambantota_port_hr_jwt_secret_2026";

export async function POST(req: Request) {
  try {
    const { employeeNo, pin, remember } = await req.json();

    if (!employeeNo || !pin) {
      return NextResponse.json(
        { error: "Employee Number and PIN are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB Atlas
    await connectToDatabase();

    const formattedEmpNo = employeeNo.toUpperCase();

    // Check if employee exists in database or seed default employee
    let employee = await Employee.findOne({ employeeNo: formattedEmpNo });

    if (!employee) {
      // Create initial employee record in MongoDB Atlas
      employee = await Employee.create({
        employeeNo: formattedEmpNo,
        pin: pin,
        name: "Deneth",
        phone: "+94 77 123 4567",
        department: "Port Logistics Operations",
        designation: "Senior Operations Assistant",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        role: "employee",
      });
    }

    const userData = {
      id: String(employee._id),
      employeeNo: employee.employeeNo,
      name: employee.name,
      phone: employee.phone,
      department: employee.department,
      designation: employee.designation,
      avatarUrl: employee.avatarUrl,
      role: employee.role,
    };

    const token = jwt.sign(userData, JWT_SECRET, {
      expiresIn: remember ? "30d" : "1d",
    });

    return NextResponse.json({
      success: true,
      user: userData,
      token,
      dbConnected: true,
    });
  } catch (error) {
    console.error("Auth Login Error:", error);
    return NextResponse.json(
      { error: "Authentication failed", details: String(error) },
      { status: 500 }
    );
  }
}
