import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Employee from "@/models/Employee";

function normalizePhone(phoneStr: string): string {
  if (!phoneStr) return "";
  let cleaned = phoneStr.replace(/\D/g, "");
  if (cleaned.startsWith("94") && cleaned.length > 9) {
    cleaned = "0" + cleaned.slice(2);
  }
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const { employeeNo, phone, newPin } = await req.json();

    if (!employeeNo || !phone || !newPin) {
      return NextResponse.json(
        { error: "Employee Number, Mobile Number, and New PIN are required" },
        { status: 400 }
      );
    }

    const cleanPin = String(newPin).trim();
    if (cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      return NextResponse.json(
        { error: "New PIN must be exactly 4 numeric digits" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const rawEmpNo = String(employeeNo).trim();
    const numericOnly = rawEmpNo.replace(/\D/g, "");

    const employee = await Employee.findOne({
      $or: [
        { employeeNo: rawEmpNo },
        { employeeNo: numericOnly },
        { employeeNo: `HMPT-${numericOnly}` },
        { employeeNo: `HMPT-${rawEmpNo}` },
      ],
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee Number not found." },
        { status: 404 }
      );
    }

    const inputPhoneNorm = normalizePhone(String(phone));
    const storedPhoneNorm = normalizePhone(String(employee.phone));

    if (inputPhoneNorm !== storedPhoneNorm && inputPhoneNorm.slice(-9) !== storedPhoneNorm.slice(-9)) {
      return NextResponse.json(
        { error: "Verification failed. Mobile Number does not match records." },
        { status: 400 }
      );
    }

    // Update PIN in MongoDB Atlas
    employee.pin = cleanPin;
    await employee.save();

    return NextResponse.json({
      success: true,
      message: "PIN updated successfully! You can now log in with your new PIN.",
    });
  } catch (error) {
    console.error("Forgot PIN Reset Error:", error);
    return NextResponse.json(
      { error: "Reset process failed", details: String(error) },
      { status: 500 }
    );
  }
}
