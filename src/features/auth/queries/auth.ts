import { useMutation } from "@tanstack/react-query";
import { logout, googleLogin } from "@/features/auth/services/auth";
import { removeCookieStore } from "@/lib/common/store";

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLogin,
    onError: (error) => {
      console.error("Google login failed:", error);
    },
  });
}

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeCookieStore(process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN as string);
      removeCookieStore(process.env.NEXT_PUBLIC_USER_REFRESH_TOKEN as string);
    },
    onError: (error: any) => {
      console.error("Logout failed:", error);
    },
  });
};
