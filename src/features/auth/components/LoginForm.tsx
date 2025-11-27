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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
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
  const { user, isLoading, signOut } = useAuth();
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
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | "unread"
  >("all");
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
    useGoogleLogin();

  const handleRoleLogin = (role?: LoginRole) => {
    if (isGoogleLoginPending) {
      return;
    }
    const res = loginWithGoogle(role);
    console.log("res :>> ", res);
  };

  const handleLogout = () => {
    signOut();
    showToast("success", "Logged out successfully");
  };

  const handleProfileSave = () => {
    showToast("success", "Profile updated (demo)");
    setIsEditOpen(false);
  };

  const goToApplicationStatus = () => {
    router.push(`/${locale}/application-status`);
  };

  const goToSavedJobs = () => {
    router.push(`/${locale}/saved-jobs`);
  };

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
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [profile.name]
  );

  useEffect(() => {
    if (user && typeof user === "object") {
      setProfile((prev) => ({
        name: (user as any)?.name ?? prev.name,
        email: (user as any)?.email ?? prev.email,
        phone: (user as any)?.phone ?? prev.phone,
        headline: (user as any)?.headline ?? prev.headline,
        location: (user as any)?.location ?? prev.location,
        bio: (user as any)?.bio ?? prev.bio,
      }));
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

  if (user) {
    return (
      <div className="flex items-center gap-4">
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
            <DropdownMenuItem onSelect={goToApplicationStatus}>
              <FileText className="w-4 h-4" />
              Application Status
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={goToSavedJobs}>
              <BookmarkCheck className="w-4 h-4" />
              Saved Jobs
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
