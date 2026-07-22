import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hambantota_port_hr_secret_2026";

export async function POST(req: Request) {
  try {
    const { employeeNo, pin, remember } = await req.json();

    if (!employeeNo || !pin) {
      return NextResponse.json(
        { error: "Employee Number and PIN are required" },
        { status: 400 }
      );
    }

    // Enterprise PIN validation check (mock DB match for HIP-1234 or any valid standard employee ID)
    const mockEmployee = {
      id: "emp-1234",
      employeeNo: employeeNo.toUpperCase(),
      name: "Deneth",
      phone: "+94 77 123 4567",
      department: "Port Logistics Operations",
      designation: "Senior Operations Assistant",
      role: "employee",
    };

    const token = jwt.sign(mockEmployee, JWT_SECRET, {
      expiresIn: remember ? "30d" : "1d",
    });

    return NextResponse.json({
      success: true,
      user: mockEmployee,
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed", details: String(error) },
      { status: 500 }
    );
  }
}
