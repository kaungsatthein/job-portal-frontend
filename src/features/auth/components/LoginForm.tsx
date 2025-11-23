"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ScanFace, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib";

const LoginForm = () => {
  const t = useTranslations("Auth");
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    showToast("success", t("loginSuccess"));
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Bell />
        </Button>
        <div className="relative cursor-pointer">
          <Avatar className="w-6 h-6">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <ChevronDown className="absolute -bottom-1 -right-1 w-3 h-3 bg-background rounded-full border" />
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className="text-sm font-semibold px-2 py-1 cursor-pointer">
        {t("login")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("loginAs", {
              role: t(isRecruiter ? "roleRecruiter" : "roleResearcher"),
            })}
          </DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4 mt-3" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder={t("username")}
            className="border rounded px-3 py-2"
          />
          <input
            type="password"
            placeholder={t("password")}
            className="border rounded px-3 py-2"
          />

          <div className="flex items-center gap-2 my-2">
            <input
              type="checkbox"
              checked={isRecruiter}
              onChange={() => setIsRecruiter((prev) => !prev)}
            />
            <span>
              {t("recruiterCheckbox")}{" "}
              <span className="text-xs text-muted-foreground">
                {t("recruiterHint")}
              </span>
            </span>
          </div>

          <Button type="submit" className="w-full">
            {t("loginButton")}
          </Button>
          <div className="flex items-center my-2">
            <div className="flex-grow border-t" />
            <span className="mx-2 text-xs text-muted-foreground">
              {t("or")}
            </span>
            <div className="flex-grow border-t" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <ScanFace />
            {t("loginWithGoogle")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;
