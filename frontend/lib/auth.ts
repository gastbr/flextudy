import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import { logout } from "@/app/login/actions";

const secret = process.env.SECRET_KEY as string;

export interface UserData {
  username: string;
  role: string;
  name: string;
  email: string;
}

export async function getCurrentUser(request: NextRequest): Promise<UserData | null> {
  try {
    const tokenCookie = request.cookies.get("token")?.value;
    if (!tokenCookie) return null;

    // Remove 'token ' prefix if present
    const token = tokenCookie.replace(/^token\s+/i, "");

    // Create a TextEncoder
    const encoder = new TextEncoder();

    // Verify and decode the token
    const { payload } = await jose.jwtVerify(
      token,
      encoder.encode(secret)
    );

    return {
      username: payload.sub ?? "",
      role: payload.role as string,
      name: payload.name as string,
      email: payload.email as string,
    };
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.error("Token has expired. User needs to log in again.");
      const logoutResponse = await logout(request);
      if (logoutResponse instanceof NextResponse) {
        return null;
      }
    } else {
      console.error("Token verification failed:", error);
    }
    return null;
  }
}