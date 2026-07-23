import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Employee from "@/models/Employee";

const JWT_SECRET = process.env.JWT_SECRET || "hambantota_port_hr_jwt_secret_2026_key";

export async function POST(req: Request) {
  try {
    const { employeeNo, pin, remember } = await req.json();

    if (!employeeNo || !pin) {
      return NextResponse.json(
        { error: "Employee Number / HR ID and PIN are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB Atlas
    await connectToDatabase();

    const rawEmpNo = String(employeeNo).trim().toUpperCase();
    const numericOnly = rawEmpNo.replace(/\D/g, "");

    // Find employee by exact input or by clean numeric string or prefixed
    let employee = await Employee.findOne({
      $or: [
        { employeeNo: rawEmpNo },
        { employeeNo: numericOnly },
        { employeeNo: `HMPT-${numericOnly}` },
        { employeeNo: `HMPT-${rawEmpNo}` },
      ],
    });

    // Seed default employee if DB empty and user is logging in with HMPT-1234 or 1234
    if (!employee && (rawEmpNo === "HMPT-1234" || numericOnly === "1234")) {
      employee = await Employee.create({
        employeeNo: "1234",
        pin: "1234",
        name: "Deneth",
        phone: "0771234567",
        workingSite: "HIPG",
        nic: "199512345678",
        department: "Port Logistics Operations",
        designation: "Senior Operations Assistant",
        avatarUrl: "",
        role: "employee",
      });
    }

    // Seed HR Officers & HR Manager if requested via login
    if (!employee && rawEmpNo.startsWith("HR-")) {
      const officerNumber = rawEmpNo;
      employee = await Employee.create({
        employeeNo: officerNumber,
        pin: String(pin).trim() || "1234",
        name: `HR Officer ${officerNumber}`,
        phone: "0770000000",
        workingSite: "HIPG",
        nic: "199000000000",
        department: "Human Resources",
        designation: "HR Executive",
        avatarUrl: "",
        role: "hr_officer",
      });
    } else if (!employee && rawEmpNo.startsWith("HRM-")) {
      employee = await Employee.create({
        employeeNo: "HRM-001",
        pin: String(pin).trim() || "1234",
        name: "HR Manager",
        phone: "0779999999",
        workingSite: "HIPG",
        nic: "198599999999",
        department: "Human Resources Management",
        designation: "Head of HR Department",
        avatarUrl: "",
        role: "hr_manager",
      });
    }

    if (!employee) {
      return NextResponse.json(
        { error: "Employee / HR ID not found. Please check your ID or Register first." },
        { status: 404 }
      );
    }

    if (String(employee.pin) !== String(pin).trim()) {
      return NextResponse.json(
        { error: "Invalid PIN. Please check your 4-digit PIN." },
        { status: 401 }
      );
    }

    const userData = {
      id: String(employee._id),
      employeeNo: employee.employeeNo,
      name: employee.name,
      phone: employee.phone,
      workingSite: employee.workingSite || "HIPG",
      nic: employee.nic || "",
      department: employee.department || "Port Operations",
      designation: employee.designation || "Employee",
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

