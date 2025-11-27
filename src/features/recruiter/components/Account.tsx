"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/auth";

const Account = () => {
  const t = useTranslations("Account");
  const { user } = useAuth();
  const { signOut } = useAuth();

  if (!user) return null; // or a loader ✨

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback>
                {user.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <span className="text-sm">{user.name}</span>
              <span className="text-sm">{user.email}</span>
            </div>
          </div>
          <Button size="sm" variant="destructive" onClick={handleLogout}>
            {t("logout")}
            <LogOut />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
