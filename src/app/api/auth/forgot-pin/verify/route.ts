import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Employee from "@/models/Employee";

// Helper to normalize phone numbers for accurate comparison
function normalizePhone(phoneStr: string): string {
  if (!phoneStr) return "";
  let cleaned = phoneStr.replace(/\D/g, ""); // remove non-digits
  if (cleaned.startsWith("94") && cleaned.length > 9) {
    cleaned = "0" + cleaned.slice(2);
  }
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const { employeeNo, phone } = await req.json();

    if (!employeeNo || !phone) {
      return NextResponse.json(
        { error: "Employee Number and Contact Mobile Number are required" },
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
        { error: "Employee Number not found in system." },
        { status: 404 }
      );
    }

    const inputPhoneNorm = normalizePhone(String(phone));
    const storedPhoneNorm = normalizePhone(String(employee.phone));

    if (inputPhoneNorm !== storedPhoneNorm && inputPhoneNorm.slice(-9) !== storedPhoneNorm.slice(-9)) {
      return NextResponse.json(
        { error: "Entered Mobile Number does NOT match the contact number previously registered for this Employee Number." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      matched: true,
      employeeName: employee.name,
      message: "Mobile number verified successfully. You can now reset your PIN.",
    });
  } catch (error) {
    console.error("Forgot PIN Verification Error:", error);
    return NextResponse.json(
      { error: "Verification process failed", details: String(error) },
      { status: 500 }
    );
  }
}
