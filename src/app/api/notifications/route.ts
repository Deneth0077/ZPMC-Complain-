import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Notification from "@/models/Notification";

const JWT_SECRET = process.env.JWT_SECRET || "hambantota_port_hr_jwt_secret_2026_key";

interface UserJwtPayload {
  id: string;
  employeeNo: string;
  role: string;
}

function getUserFromAuthHeader(req: Request): UserJwtPayload | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET) as UserJwtPayload;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const user = getUserFromAuthHeader(req);

    let query: Record<string, unknown> = {};

    if (user?.role === "hr_officer" || user?.role === "hr_manager") {
      query = {
        $or: [
          { recipientRole: "all_hr" },
          { recipientRole: user.role },
          { employeeNo: user.employeeNo },
        ],
      };
    } else if (user?.employeeNo) {
      query = {
        $or: [
          { employeeNo: user.employeeNo },
          { employeeNo: "1234" },
          { recipientRole: "employee" },
        ],
      };
    }

    let notifications = await Notification.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      notifications,
      dbConnected: true,
    });
  } catch (error) {
    console.error("Notifications API Error:", error);
    return NextResponse.json(
      { success: false, error: "Database error", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const user = getUserFromAuthHeader(req);

    let query: Record<string, unknown> = {};
    if (user?.role === "hr_officer" || user?.role === "hr_manager") {
      query = { recipientRole: { $in: ["all_hr", user.role] } };
    } else if (user?.employeeNo) {
      query = { employeeNo: user.employeeNo };
    }

    await Notification.updateMany(query, { isRead: true });

    return NextResponse.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

