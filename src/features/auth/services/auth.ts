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

export type UpdateProfilePayload = {
  name?: string;
  avatar_url?: string;
  birthDate?: string;
  resumeUrl?: string;
  phoneNumber?: string;
  headline?: string;
  location?: string;
  about?: string;
};

export async function updateProfile(payload: UpdateProfilePayload) {
  const response = await apiInstance.patch("/user/profile", payload);
  return response.data;
}

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiInstance.post("/upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data?.data ?? response.data;
}
