"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import axios from "axios"

axios.defaults.baseURL = process.env.API_URL;

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  const request = new URLSearchParams({
    grant_type: "password",
    username: username,
    password: password,
  });

  try {
    const response = await axios.post("/auth/login", request.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    (await cookies()).set({
      name: "access_token",
      value: response.data.access_token,
      maxAge: response.data.expires_in,
    });

    (await cookies()).set({
      name: "current_user",
      value: JSON.stringify(response.data.user),
      maxAge: response.data.expires_in,
    });

    console.log(response.data);

  } catch (error) {
    console.error("Login failed:", error);
    return { error: "Invalid credentials" };
  }
  redirect(callbackUrl);
}

export async function logout() {
  (await cookies()).delete("access_token")
  redirect("/")
}

