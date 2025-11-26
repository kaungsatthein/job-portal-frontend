"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Job } from "../type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Briefcase, MapPin, Banknote, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const t = useTranslations("JobCard");

  const hasWorkingHours =
    Boolean(job.working_hours) && job.working_hours !== "Not specified";
  const statusKey = job.status?.toLowerCase() ?? "";

  const companyInitials = useMemo(() => {
    return (
      job.company
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("")
        .trim() || "JP"
    );
  }, [job.company]);

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
        <Button variant="secondary" size="sm" className="rounded-full gap-2">
          <Bookmark className="h-4 w-4" />
          {t("save")}
        </Button>
      </div>
    </div>
  );
};
