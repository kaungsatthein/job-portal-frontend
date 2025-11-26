import apiInstance from "@/lib/api-config/instance";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export type LoginRole = "researcher" | "recruiter";

export interface LoginPayload {
  username: string;
  password: string;
  role?: LoginRole;
}

export async function googleLogin(role?: LoginRole) {
  if (typeof window === "undefined" || !BASE_URL) {
    return;
  }

  const url = new URL(`${BASE_URL}/auth/google`);
  if (role && role === "recruiter") {
    url.searchParams.set("role", role);
  }

  window.location.href = url.toString();
}

export async function login(payload: LoginPayload) {
  const response = await apiInstance.post(`/auth/login`, {
    ...payload,
    role: payload.role ?? "researcher",
  });
  return response.data;
}

export async function logout() {
  console.log("logout function called");
  return apiInstance.post("/auth/logout-google");
}

export function getPermission() {
  return apiInstance.get("/user/permissions");
}
