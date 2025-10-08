"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";

const Account = () => {
  const handleLogout = () => {
    console.log("logout");
  };
  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <span className="text-sm">Username</span>
              <span className="text-sm">Email</span>
            </div>
          </div>
          <Button size={"sm"} variant={"destructive"} onSubmit={handleLogout}>
            Logout
            <LogOut />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
