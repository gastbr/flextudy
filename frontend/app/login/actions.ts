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

  const token = await getToken(request);
  getUser(token);

  redirect(callbackUrl);
}

async function getToken(request: URLSearchParams) {
  try {
    const response = await axios.post("/auth/login", request.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    (await cookies()).set({
      name: "accessToken",
      value: response.data.access_token,
      maxAge: response.data.expires_in,
    });
    return response.data.access_token;

  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

async function getUser(token: Promise<string>) {
  try {
    const resolvedToken = await token;
    const response = await axios.get("/auth/me",
      {
        headers: {
          Authorization: `Bearer ${resolvedToken}`,
        },
      });
    (await cookies()).set({
      name: "currentUser",
      value: JSON.stringify(response.data),
      maxAge: response.data.expires_in,
    });
  } catch (error) {
    console.error("Login user fetch failed:", error);
    throw error;
  }
}

export async function logout() {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("currentUser");
  redirect("/");
}

