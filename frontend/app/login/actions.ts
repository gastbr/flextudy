"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextResponse, NextRequest } from "next/server"
import axios from "axios"

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  const request = new URLSearchParams({
    grant_type: "password",
    username: username,
    password: password,
  });

  await setToken(request);
  redirect(callbackUrl);
}

async function setToken(request: URLSearchParams) {
  try {
    const response = await axios.post("/auth/login", request.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    (await cookies()).set({
      name: "token",
      value: response.data.access_token,
      maxAge: response.data.expires_in,
      httpOnly: (process.env.HTTPONLY_COOKIE ?? "true") === "true",
      secure: (process.env.SECURE_COOKIE ?? "true") === "true",
      sameSite: (process.env.SAMESITE_COOKIE ?? "strict") as "lax" | "strict" | "none",
    });

    return response.data.access_token;

  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logout(request: NextRequest) {
  (await cookies()).delete("token");
  return NextResponse.redirect(new URL("/login", request.url));
}

