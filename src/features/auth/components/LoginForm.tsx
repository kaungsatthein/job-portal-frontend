"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Bell,
  ChevronDown,
  AlertCircle,
  Briefcase,
  Clock3,
  LucideIcon,
  MessageSquare,
  User,
  FileText,
  LogOut,
  UserRoundSearch,
  Users,
  BookmarkCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocale, useTranslations } from "next-intl";
import { showToast } from "@/lib";
import { useGoogleLogin } from "@/features/auth/queries/auth";
import { updateProfile, uploadResume } from "@/features/auth/services/auth";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context";

type NotificationCategory = "application" | "interview" | "reminder" | "system";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  category: NotificationCategory;
  unread?: boolean;
  actionLabel?: string;
};

const notificationTone: Record<
  NotificationCategory,
  { label: string; icon: LucideIcon; badgeClass: string; iconWrap: string }
> = {
  application: {
    label: "Application",
    icon: Briefcase,
    badgeClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-100",
    iconWrap:
      "text-blue-600 border-blue-200 bg-blue-50 dark:border-blue-500/40 dark:text-blue-100 dark:bg-blue-500/10",
  },
  interview: {
    label: "Interview",
    icon: CalendarClock,
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-100",
    iconWrap:
      "text-emerald-700 border-emerald-200 bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-100 dark:bg-emerald-500/10",
  },
  reminder: {
    label: "Reminder",
    icon: MessageSquare,
    badgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-50",
    iconWrap:
      "text-amber-700 border-amber-200 bg-amber-50 dark:border-amber-500/40 dark:text-amber-50 dark:bg-amber-500/10",
  },
  system: {
    label: "Update",
    icon: AlertCircle,
    badgeClass:
      "bg-slate-200 text-slate-800 dark:bg-slate-500/15 dark:text-slate-100",
    iconWrap:
      "text-slate-700 border-slate-200 bg-slate-50 dark:border-slate-500/40 dark:text-slate-100 dark:bg-slate-500/10",
  },
};

const LoginForm = () => {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, signOut, refreshUser, role } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState({
    avatar_url: "",
    name: "",
    email: "",
    phone: "",
    headline: "",
    location: "",
    bio: "",
    birthDate: "",
    resumeUrl: "",
    role: "",
  });
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | "unread"
  >("all");
  const [showWelcome, setShowWelcome] = useState(false);

  console.log("showWelcome :>> ", showWelcome);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Interview confirmed with Acme",
      description: "Recruiter scheduled a 45 min interview for Tuesday, 3 PM.",
      time: "2h ago",
      category: "interview",
      unread: true,
      actionLabel: "Review prep guide",
    },
    {
      id: "2",
      title: "Application viewed",
      description: "Your profile for Lead Product Designer was opened.",
      time: "6h ago",
      category: "application",
      unread: true,
      actionLabel: "Open application",
    },
    {
      id: "3",
      title: "Add a quick portfolio note",
      description:
        "Help recruiters by pinning a project link to your profile summary.",
      time: "Yesterday",
      category: "reminder",
      actionLabel: "Add note",
    },
    {
      id: "4",
      title: "Product update",
      description:
        "Saved jobs now sync with interview reminders on your dashboard.",
      time: "2 days ago",
      category: "system",
    },
  ]);
  const { mutate: loginWithGoogle, isPending: isGoogleLoginPending } =
    useGoogleLogin(refreshUser);

  const handleRoleLogin = (role?: LoginRole) => {
    if (isGoogleLoginPending) {
      return;
    }
    loginWithGoogle(role);
  };

  console.log("profile :>> ", profile);

  const handleLogout = () => {
    signOut();
    showToast("success", "Logged out successfully");
  };

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingResume(true);
    try {
      const result = await uploadResume(file);
      console.log("result :>> ", result);
      const url = result?.url || result?.fileUrl || result?.path || result;
      console.log("url :>> ", url);
      if (typeof url === "string" && url.length > 0) {
        setProfile((prev) => ({ ...prev, resumeUrl: url }));
        showToast("success", t("resumeUploaded"));
      } else {
        showToast("error", t("resumeUploadFailed"));
      }
    } catch (error: any) {
      console.error("Resume upload failed", error);
      showToast(
        "error",
        error?.response?.data?.message || t("resumeUploadFailed")
      );
    } finally {
      setIsUploadingResume(false);
      event.target.value = "";
    }
  };

  const handleProfileSave = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: profile.name,
        avatar_url: profile.avatar_url,
        birthDate: profile.birthDate || undefined,
        resumeUrl: profile.resumeUrl || undefined,
        phoneNumber: profile.phone || undefined,
        headline: profile.headline || undefined,
        location: profile.location || undefined,
        about: profile.bio || undefined,
      });
      showToast("success", t("profileUpdated"));
      setIsEditOpen(false);
      refreshUser();
    } catch (error: any) {
      console.error("Failed to update profile", error);
      showToast(
        "error",
        error?.response?.data?.message || t("profileUpdateFailed")
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const goToApplicationStatus = () => {
    router.push(`/${locale}/application-status`);
  };

  const goToSavedJobs = () => {
    router.push(`/${locale}/saved-jobs`);
  };

  useEffect(() => {
    if (!role) return;
    if (role === "recruiter" && pathname && !pathname.includes("/recruiter")) {
      router.push(`/${locale}/recruiter`);
    } else if (
      role === "researcher" &&
      pathname &&
      pathname.includes("/recruiter")
    ) {
      router.push(`/${locale}`);
    }
  }, [role, locale, router, pathname]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications]
  );

  const filteredNotifications = useMemo(
    () =>
      notificationFilter === "unread"
        ? notifications.filter((item) => item.unread)
        : notifications,
    [notificationFilter, notifications]
  );
  const resumeFileName = useMemo(() => {
    if (!profile.resumeUrl) return null;
    try {
      const url = new URL(profile.resumeUrl);
      return url.pathname.split("/").pop();
    } catch {
      return profile.resumeUrl.split("/").pop();
    }
  }, [profile.resumeUrl]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  const markAllNotificationsRead = () => {
    if (!unreadCount) return;
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false }))
    );
  };

  const initialAvatar = useMemo(
    () =>
      profile.name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .slice(0, 1)
        .join("")
        .toUpperCase(),
    [profile.name]
  );

  useEffect(() => {
    if (user && typeof user === "object") {
      const u = user as any;
      setProfile((prev) => ({
        avatar_url: u?.avatar_url ?? prev.avatar_url,
        name: u?.name ?? prev.name,
        email: u?.email ?? prev.email,
        phone: u?.phoneNumber ?? prev.phone,
        headline: u?.headline ?? prev.headline,
        location: u?.location ?? prev.location,
        bio: u?.about ?? prev.bio,
        birthDate: u?.birthDate ?? prev.birthDate,
        resumeUrl: u?.resumeUrl ?? prev.resumeUrl,
        role: u?.role ?? prev.role,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (user?.loginCount === 1) {
      setShowWelcome(true);
    }
  }, [user]);

  console.log("profile :>> ", profile);

  if (isLoading) {
    return (
      <Button variant="ghost" className="text-sm px-2 py-1" disabled>
        Loading...
      </Button>
    );
  }

  const closeWelcome = () => setShowWelcome(false);
  const openProfileFromWelcome = () => {
    setShowWelcome(false);
    setIsEditOpen(true);
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t("welcomeTitle", { name: profile.name || "there" })}
              </DialogTitle>
              <DialogDescription>
                {role === "recruiter"
                  ? t("welcomeRecruiter")
                  : t("welcomeResearcher")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {role === "researcher" && (
                <Button variant="outline" onClick={openProfileFromWelcome}>
                  {t("updateProfile")}
                </Button>
              )}
              <Button onClick={closeWelcome}>{t("continue")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative cursor-pointer"
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={12}
            className="w-[380px] p-0 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold leading-tight">
                  Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Track interviews, application updates, and helpful nudges.
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {unreadCount > 0 ? `${unreadCount} new` : "Up to date"}
              </Badge>
            </div>

            <div className="flex items-center gap-2 px-4 py-2">
              <Button
                size="sm"
                variant={notificationFilter === "all" ? "secondary" : "ghost"}
                className="cursor-pointer"
                onClick={() => setNotificationFilter("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={
                  notificationFilter === "unread" ? "secondary" : "ghost"
                }
                className="cursor-pointer"
                onClick={() => setNotificationFilter("unread")}
              >
                Unread
                {unreadCount > 0 && (
                  <Badge
                    variant="outline"
                    className=" rounded-full border-primary/30 px-2 py-0 text-[11px] text-primary"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            <Separator />

            <div className="max-h-[360px] space-y-2 overflow-y-auto px-3 py-2">
              {filteredNotifications.length ? (
                filteredNotifications.map((item) => {
                  const tone = notificationTone[item.category];
                  const Icon = tone.icon;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "group flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 transition-colors",
                        item.unread
                          ? "border-primary/40 bg-primary/5 shadow-sm"
                          : "hover:border-primary/20 hover:bg-accent/60"
                      )}
                      onClick={() => markNotificationRead(item.id)}
                    >
                      <div
                        className={cn(
                          "rounded-full border p-2 transition-colors group-hover:border-primary/50",
                          tone.iconWrap
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-1 flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold leading-tight">
                            {item.title}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "border-transparent text-[11px] font-semibold",
                              tone.badgeClass
                            )}
                          >
                            {tone.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" />
                            {item.time}
                          </span>
                          {item.unread ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                              <CheckCircle2 className="h-3 w-3" />
                              New
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">
                              <CheckCircle2 className="h-3 w-3" />
                              Seen
                            </span>
                          )}
                          {item.actionLabel && (
                            <button
                              type="button"
                              className="ml-auto inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
                              onClick={(event) => {
                                event.stopPropagation();
                                markNotificationRead(item.id);
                              }}
                            >
                              {item.actionLabel}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                  <AlertCircle className="mx-auto mb-2 h-5 w-5" />
                  {notificationFilter === "unread"
                    ? "No unread notifications."
                    : "You're all caught up."}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={markAllNotificationsRead}
                disabled={!unreadCount}
              >
                Mark all as read
              </Button>
              <Button
                variant="link"
                size="sm"
                className="px-0 text-primary"
                onClick={() => setNotificationFilter("all")}
              >
                View activity
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profile.avatar_url} alt="@shadcn" />
                <AvatarFallback>{initialAvatar || "ME"}</AvatarFallback>
              </Avatar>
              <ChevronDown className="absolute -bottom-1 -right-1 w-3 h-3 bg-background rounded-full border" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {role !== "recruiter" && (
              <>
                <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
                  <User className="w-4 h-4" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={goToApplicationStatus}>
                  <FileText className="w-4 h-4" />
                  Application Status
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={goToSavedJobs}>
                  <BookmarkCheck className="w-4 h-4" />
                  Saved Jobs
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
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
                    disabled
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
                <Label htmlFor="resumeUrl">Resume link</Label>
                <Input
                  id="resumeUrl"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={isUploadingResume}
                />
                {profile.resumeUrl && (
                  <p className="text-xs text-muted-foreground break-all">
                    {t("resumeCurrent")}
                    {resumeFileName && (
                      <span className="font-semibold"> {resumeFileName}</span>
                    )}
                    {", "}
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      {t("viewResume")}
                    </a>
                  </p>
                )}
                {isUploadingResume && (
                  <p className="text-xs text-muted-foreground">
                    {t("resumeUploading")}
                  </p>
                )}
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
            </div>

            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleProfileSave} disabled={isSavingProfile}>
                {isSavingProfile ? "Saving..." : "Save changes"}
              </Button>
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
