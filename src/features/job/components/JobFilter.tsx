"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

type SortOption = "relevance" | "date";
type JobType = "all" | "full-time" | "part-time" | "contract" | "internship";
type ListedDate = "all" | "24h" | "3d" | "7d" | "30d";

export function JobFilter() {
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [jobType, setJobType] = useState<JobType>("all");
  const [listedDate, setListedDate] = useState<ListedDate>("all");
  const t = useTranslations("JobFilter");

  const resetFilters = () => {
    setSortBy("relevance");
    setJobType("all");
    setListedDate("all");
  };

  const jobTypeLabels: Record<JobType, string> = {
    all: t("jobType"),
    "full-time": t("fullTime"),
    "part-time": t("partTime"),
    contract: t("contract"),
    internship: t("internship"),
  };

  const listedDateLabels: Record<ListedDate, string> = {
    all: t("listedDate"),
    "24h": t("last24h"),
    "3d": t("last3d"),
    "7d": t("last7d"),
    "30d": t("last30d"),
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Sort by section */}
      <div className="flex items-center gap-1">
        <span className="text-sm text-foreground">{t("sortBy")}</span>
        <div className="flex items-center">
          <Button
            variant={"link"}
            size="sm"
            onClick={() => setSortBy("relevance")}
            className={`text-sm py-0 px-1 ${
              sortBy === "relevance"
                ? "text-primary"
                : "text-muted-foreground/50"
            }`}
          >
            {t("relevance")}
          </Button>
          <span className="text-muted-foreground">/</span>
          <Button
            variant={"link"}
            size="sm"
            onClick={() => setSortBy("date")}
            className={`text-sm py-0 px-1 ${
              sortBy === "date" ? "text-primary" : "text-muted-foreground/50"
            }`}
          >
            {t("date")}
          </Button>
        </div>
      </div>

      {/* Job type dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"sm"}
            variant="outline"
            className="flex items-center justify-between rounded-full border-border bg-background hover:bg-accent text-foreground w-full sm:w-auto"
          >
            {jobTypeLabels[jobType]}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {Object.entries(jobTypeLabels).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setJobType(key as JobType)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Listed date dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"sm"}
            variant="outline"
            className="flex items-center justify-between rounded-full border-border bg-background hover:bg-accent text-foreground w-full sm:w-auto"
          >
            {listedDateLabels[listedDate]}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {Object.entries(listedDateLabels).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setListedDate(key as ListedDate)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset filters */}
      <Button
        variant="link"
        onClick={resetFilters}
        className="py-0 px-1 w-full sm:w-auto"
      >
        {t("reset")}
      </Button>
    </div>
  );
}
