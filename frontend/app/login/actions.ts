"use server"

import { cookies } from "next/headers"
import axios from "axios"

const apiUrl = process.env.INTERNAL_API_URL || "http://fastapi:8000/v1";

export async function login(formData: FormData) {
  console.log("➡️ API URL LOGIN:", apiUrl);

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const request = new URLSearchParams({
    grant_type: "password",
    username,
    password,
  });

  await setToken(request);
  // redirect(callbackUrl);
}

async function setToken(request: URLSearchParams) {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, request.toString(), {
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
    console.error("❌ Login failed:", error);
    throw error;
  }
}
