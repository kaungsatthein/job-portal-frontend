"use client";

import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  User,
  FileText,
  LogOut,
  UserRoundSearch,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib";
import { useGoogleLogin } from "@/features/auth/queries/auth";
import type { LoginRole } from "@/features/auth/services/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const LoginForm = () => {
  const t = useTranslations("Auth");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [cvName, setCvName] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane.doe@email.com",
    phone: "+95 9 123 456 789",
    headline: "Product Designer",
    location: "Yangon, Myanmar",
    bio: "Designing thoughtful experiences for SaaS and marketplace products.",
  });
  const { mutate: loginWithGoogle, isPending: isGoogleLoginPending } =
    useGoogleLogin();

  const handleRoleLogin = (role?: LoginRole) => {
    if (isGoogleLoginPending) {
      return;
    }
    const res = loginWithGoogle(role);
    console.log("res :>> ", res);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast("success", "Logged out successfully");
  };

  const handleProfileSave = () => {
    showToast("success", "Profile updated (demo)");
    setIsEditOpen(false);
  };

  const initialAvatar = useMemo(
    () =>
      profile.name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [profile.name]
  );

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Bell />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>{initialAvatar || "ME"}</AvatarFallback>
              </Avatar>
              <ChevronDown className="absolute -bottom-1 -right-1 w-3 h-3 bg-background rounded-full border" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
              <User className="w-4 h-4" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => showToast("info", "Check application status")}
            >
              <FileText className="w-4 h-4" />
              Application Status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Update your basic info and upload a CV. This is a demo form;
                data won&apos;t persist.
              </p>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={profile.headline}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        headline: e.target.value,
                      }))
                    }
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+95 ..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="bio">About</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={3}
                  placeholder="Tell recruiters about yourself"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="cv">Upload CV</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setCvName(file ? file.name : null);
                    }}
                  />
                  {cvName && (
                    <span className="text-sm text-muted-foreground truncate">
                      {cvName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted: PDF, DOC, DOCX. Max 10MB.
                </p>
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleProfileSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-sm px-2 py-1 cursor-pointer flex items-center gap-1"
            disabled={isGoogleLoginPending}
          >
            {t("login")} <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuItem
            onSelect={() => handleRoleLogin()}
            disabled={isGoogleLoginPending}
          >
            <Users className="w-4 h-4" />
            {t("loginWithResearcher")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleRoleLogin("recruiter")}
            disabled={isGoogleLoginPending}
          >
            <UserRoundSearch className="w-4 h-4" />
            {t("loginWithRecruiter")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default LoginForm;
