"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Job } from "../type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  MapPin,
  Banknote,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth";
import { showToast } from "@/lib";
import { useApplyToJob } from "@/features/job/services/job-applications";
import {
  useSaveJob,
  useRemoveSavedJob,
} from "@/features/job/services/saved-jobs";

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const t = useTranslations("JobCard");
  const { user, role, refreshUser } = useAuth();
  const applyMutation = useApplyToJob();
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveMutation = useSaveJob();
  const removeSaveMutation = useRemoveSavedJob();
  const [hasApplied, setHasApplied] = useState<boolean>(
    Boolean(job.hasApplied)
  );
  const [isSaved, setIsSaved] = useState(false);
  const [savedJobId, setSavedJobId] = useState<string | null>(null);

  const hasWorkingHours =
    Boolean(job.working_hours) && job.working_hours !== "Not specified";
  const statusKey = job.status?.toLowerCase() ?? "";

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-800 border-amber-100",
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
    published: "bg-emerald-50 text-emerald-700 border-emerald-100",
    closed: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const formatStatus = (status: string) =>
    status
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const infoItems = [
    {
      icon: Briefcase,
      label: t("jobTypeLabel"),
      value: job.job_type,
    },
    {
      icon: Banknote,
      label: t("salaryLabel"),
      value: job.pay_range,
    },
    {
      icon: MapPin,
      label: t("locationLabel"),
      value: job.location,
    },
  ];

  useEffect(() => {
    if (!user) {
      setHasApplied(Boolean(job.hasApplied));
      setIsSaved(Boolean(job.isSaved));
      setSavedJobId(job.savedJobId ?? null);
      return;
    }
    const userApplied =
      job.hasApplied ||
      user.applications?.some((application) => application.jobId === job.id);
    setHasApplied(Boolean(userApplied));

    const savedRecord =
      user.savedJobs?.find(
        (saved) =>
          saved.jobId === job.id ||
          saved.job?.id === job.id ||
          saved.id === job.savedJobId
      ) || null;
    setIsSaved(Boolean(savedRecord) || Boolean(job.isSaved));
    setSavedJobId(savedRecord?.id ?? job.savedJobId ?? null);
  }, [user, job.id, job.hasApplied, job.isSaved, job.savedJobId]);

  const handleApply = async () => {
    if (!user) {
      showToast("info", t("researcherRequired"));
      return;
    }
    if (role === "recruiter") {
      showToast("info", t("recruiterCannotApply"));
      return;
    }
    if (hasApplied) {
      showToast("info", t("alreadyApplied"));
      return;
    }
    if (!user.resumeUrl) {
      showToast("info", t("resumeRequired"));
      return;
    }

    setIsApplying(true);
    try {
      await applyMutation.mutateAsync({
        researcherId: user.id,
        jobId: job.id,
        status: "submitted",
      });
      setHasApplied(true);
      refreshUser();
      showToast("success", t("appliedSuccess"));
    } catch (error: any) {
      console.error("Failed to apply", error);
      showToast("error", error?.response?.data?.message || t("appliedFailed"));
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      showToast("info", t("researcherRequired"));
      return;
    }
    if (role === "recruiter") {
      showToast("info", t("recruiterCannotApply"));
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved && savedJobId) {
        await removeSaveMutation.mutateAsync(savedJobId);
        setIsSaved(false);
        setSavedJobId(null);
        showToast("success", t("unsavedSuccess"));
      } else {
        const saved = await saveMutation.mutateAsync(job.id);
        setIsSaved(true);
        setSavedJobId(saved?.id ?? null);
        showToast("success", t("savedSuccess"));
      }
      // refreshUser();
    } catch (error: any) {
      console.error("Failed to toggle saved job", error);
      showToast("error", error?.response?.data?.message || t("saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card/80 p-5 shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-base font-semibold text-foreground line-clamp-2">
              {job.title}
            </p>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
        </div>
        {job.status && (
          <Badge
            variant="outline"
            className={cn(
              "border-none px-3 py-1 text-xs font-medium capitalize",
              statusStyles[statusKey] ??
                "bg-secondary text-secondary-foreground"
            )}
          >
            {formatStatus(job.status.replace(/[_-]/g, " "))}
          </Badge>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {job.job_scope}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {infoItems.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{t("posted", { time: job.posted })}</span>
          {hasWorkingHours && (
            <>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{job.working_hours}</span>
            </>
          )}
          {typeof job.applicationsCount === "number" && (
            <>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {t("applications", { count: job.applicationsCount })}
              </span>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            className="rounded-full gap-2"
            onClick={handleSaveToggle}
            disabled={isSaving}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isSaving ? t("saving") : isSaved ? t("unsave") : t("save")}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full"
            onClick={handleApply}
            disabled={isApplying || hasApplied}
          >
            {hasApplied
              ? t("alreadyApplied")
              : isApplying
              ? t("applying")
              : t("apply")}
          </Button>
        </div>
      </div>
    </div>
  );
};
