import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Employee from "@/models/Employee";

const JWT_SECRET = process.env.JWT_SECRET || "hambantota_port_hr_jwt_secret_2026_key";

export async function POST(req: Request) {
  try {
    const { employeeNo, name, phone, workingSite, nic, pin } = await req.json();

    if (!employeeNo || !name || !phone || !workingSite || !pin) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Clean numeric employee number
    const cleanEmpNo = String(employeeNo).trim();
    if (!/^\d+$/.test(cleanEmpNo)) {
      return NextResponse.json(
        { error: "Employee Number must contain numbers only" },
        { status: 400 }
      );
    }

    if (String(pin).trim().length !== 4) {
      return NextResponse.json(
        { error: "PIN must be exactly 4 digits" },
        { status: 400 }
      );
    }

    // Connect to MongoDB Atlas
    await connectToDatabase();

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ employeeNo: cleanEmpNo }, { employeeNo: `HMPT-${cleanEmpNo}` }],
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Employee Number is already registered" },
        { status: 409 }
      );
    }

    // Create new employee record
    const newEmployee = await Employee.create({
      employeeNo: cleanEmpNo,
      name: String(name).trim(),
      phone: String(phone).trim(),
      workingSite: String(workingSite).trim(),
      nic: nic ? String(nic).trim() : "",
      pin: String(pin).trim(),
      department: `${workingSite} Operations`,
      designation: "Staff Employee",
      role: "employee",
      avatarUrl: "",
    });

    const userData = {
      id: String(newEmployee._id),
      employeeNo: newEmployee.employeeNo,
      name: newEmployee.name,
      phone: newEmployee.phone,
      workingSite: newEmployee.workingSite,
      nic: newEmployee.nic,
      department: newEmployee.department,
      designation: newEmployee.designation,
      avatarUrl: newEmployee.avatarUrl,
      role: newEmployee.role,
    };

    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: "30d" });

    return NextResponse.json({
      success: true,
      user: userData,
      token,
      message: "Employee registered successfully",
    });
  } catch (error) {
    console.error("Auth Register Error:", error);
    return NextResponse.json(
      { error: "Registration failed", details: String(error) },
      { status: 500 }
    );
  }
}
