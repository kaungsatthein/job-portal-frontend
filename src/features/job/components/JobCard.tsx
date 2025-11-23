"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Job } from "../type";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const t = useTranslations("JobCard");

  return (
    <div
      className="w-full space-y-3 rounded-md p-4 active:border-primary select shadow-lg hover:shadow-xl bg-card"
      key={job?.id}
    >
      <Badge>{t("new")}</Badge>
      <p className="font-semibold">{job.title}</p>
      <p className="text-sm font-medium">{job.company}</p>
      <p>{job.location}</p>
      <div className="flex gap-2 items-center">
        <Badge variant={"outline"}>{job.pay_range}</Badge>
        <Badge variant={"outline"}>{job.job_type}</Badge>
        <Badge variant={"outline"}>{job.experience_required}</Badge>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <p>{job.working_hours}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <p>{t("posted", { time: job.posted })}</p>
        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
        <p>{job.job_scope}</p>
      </div>
      <div className="flex justify-between items-end">
        <p className="text-xs">{t("posted", { time: job.posted })}</p>
        <Button variant={"outline"} className="tex-sm rounded-2xl gap-1">
          <Bookmark /> {t("save")}
        </Button>
      </div>
    </div>
  );
};
