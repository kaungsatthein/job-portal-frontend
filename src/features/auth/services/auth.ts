import apiInstance from "@/lib/api-config/instance";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export async function googleLogin(
  role: "researcher" | "recruiter" = "researcher"
) {
  if (typeof window === "undefined" || !BASE_URL) {
    return;
  }

  const searchParams = new URLSearchParams({ role });
  window.location.href = `${BASE_URL}/auth/google?${searchParams.toString()}`;
}

export async function logout() {
  console.log("logout function called");
  return apiInstance.post("/auth/logout-google");
}

export function getPermission() {
  return apiInstance.get("/user/permissions");
}
