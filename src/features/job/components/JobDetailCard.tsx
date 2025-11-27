"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { useApplyToJob } from "@/features/job/services/job-applications";
import {
  useSaveJob,
  useRemoveSavedJob,
} from "@/features/job/services/saved-jobs";
import { showToast } from "@/lib";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { Job } from "@/features/job/type";

interface JobDetailCardProps {
  job: Job;
}

export function JobDetailCard({ job }: JobDetailCardProps) {
  const t = useTranslations("JobDetail");
  const jobCardT = useTranslations("JobCard");
  const { user, role, refreshUser } = useAuth();
  const applyMutation = useApplyToJob();
  const saveMutation = useSaveJob();
  const removeSaveMutation = useRemoveSavedJob();
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasApplied, setHasApplied] = useState<boolean>(
    Boolean(job.hasApplied)
  );
  const [isSaved, setIsSaved] = useState(Boolean(job.isSaved));
  const [savedJobId, setSavedJobId] = useState<string | null>(
    job.savedJobId ?? null
  );

  useEffect(() => {
    if (!user) {
      setHasApplied(Boolean(job.hasApplied));
      setIsSaved(Boolean(job.isSaved));
      setSavedJobId(job.savedJobId ?? null);
      return;
    }
    const applied =
      job.hasApplied ||
      user.applications?.some((application) => application.jobId === job.id);
    setHasApplied(Boolean(applied));

    const savedRecord =
      user.savedJobs?.find(
        (saved) =>
          saved.jobId === job.id ||
          saved.job?.id === job.id ||
          saved.id === job.savedJobId
      ) || null;
    const isCurrentlySaved = Boolean(savedRecord) || Boolean(job.isSaved);
    setIsSaved(isCurrentlySaved);
    setSavedJobId(savedRecord?.id ?? job.savedJobId ?? null);
  }, [user, job.id, job.hasApplied, job.isSaved, job.savedJobId]);

  const handleApply = async () => {
    if (!user) {
      showToast("info", jobCardT("researcherRequired"));
      return;
    }
    if (role === "recruiter") {
      showToast("info", jobCardT("recruiterCannotApply"));
      return;
    }
    if (hasApplied) {
      showToast("info", jobCardT("alreadyApplied"));
      return;
    }
    if (!user.resumeUrl) {
      showToast("info", jobCardT("resumeRequired"));
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
      showToast("success", jobCardT("appliedSuccess"));
    } catch (error: any) {
      console.error("Failed to apply", error);
      showToast(
        "error",
        error?.response?.data?.message || jobCardT("appliedFailed")
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      showToast("info", jobCardT("researcherRequired"));
      return;
    }
    if (role === "recruiter") {
      showToast("info", jobCardT("recruiterCannotApply"));
      return;
    }
    setIsSaving(true);
    try {
      if (isSaved && savedJobId) {
        await removeSaveMutation.mutateAsync(savedJobId);
        setIsSaved(false);
        setSavedJobId(null);
        showToast("success", jobCardT("unsavedSuccess"));
      } else {
        const saved = await saveMutation.mutateAsync(job.id);
        setIsSaved(true);
        setSavedJobId(saved?.id ?? null);
        showToast("success", jobCardT("savedSuccess"));
      }
      refreshUser();
    } catch (error: any) {
      console.error("Failed to toggle saved job", error);
      showToast(
        "error",
        error?.response?.data?.message || jobCardT("saveFailed")
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="mb-4 flex gap-3">
            <Badge variant="default">{job.job_type}</Badge>
            <Badge variant="secondary">{job.location}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{job.company}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("posted", { time: job.posted })}
          </p>
        </div>

        {/* Key Details */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded-lg bg-accent/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("payRange")}
            </p>
            <p className="text-lg font-semibold text-foreground">
              {job.pay_range}
            </p>
          </div>
          <div className="space-y-2 rounded-lg bg-accent/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("workingHours")}
            </p>
            <p className="text-sm font-medium text-foreground">
              {job.working_hours}
            </p>
          </div>
          <div className="space-y-2 rounded-lg bg-accent/30 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("experienceRequired")}
            </p>
            <p className="text-sm font-medium text-foreground">
              {job.experience_required}
            </p>
          </div>
        </div>

        {/* Job Scope */}
        <div className="space-y-3 border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-foreground">
            {t("jobDescription")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {job.job_scope}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
          <Button
            variant={isSaved ? "secondary" : "outline"}
            className="flex-1 bg-transparent gap-2"
            onClick={handleSaveToggle}
            disabled={isSaving}
          >
            {isSaving ? (
              jobCardT("saving")
            ) : (
              <span className="inline-flex items-center gap-2 text-sm">
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                {isSaved ? jobCardT("unsave") : t("saveJob")}
              </span>
            )}
          </Button>
          <Button
            className="flex-1"
            onClick={handleApply}
            disabled={isApplying || hasApplied}
          >
            {hasApplied
              ? jobCardT("alreadyApplied")
              : isApplying
              ? jobCardT("applying")
              : t("applyNow")}
          </Button>
        </div>
      </div>
    </div>
  );
}
