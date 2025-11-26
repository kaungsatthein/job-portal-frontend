"use client";

import { useEffect, useRef, useState } from "react";
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
type JobType = "fulltime" | "parttime" | "contract";
type ListedDate = "all" | "24h" | "3d" | "7d" | "30d";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function JobFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const skipNextPush = useRef(false);
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sortBy") as SortOption) ?? "relevance"
  );
  const [jobType, setJobType] = useState<JobType | null>(
    (searchParams.get("jobType") as JobType) ?? null
  );
  const [listedDate, setListedDate] = useState<ListedDate>(
    (searchParams.get("listedDate") as ListedDate) ?? "all"
  );
  const isFirstRender = useRef(true);
  const router = useRouter();
  const t = useTranslations("JobFilter");

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (sortBy === "relevance") {
      params.delete("sortBy");
    } else {
      params.set("sortBy", sortBy);
    }

    if (jobType) {
      params.set("jobType", jobType);
    } else {
      params.delete("jobType");
    }

    if (listedDate !== "all") {
      params.set("listedDate", listedDate);
    } else {
      params.delete("listedDate");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }, [jobType, listedDate, pathname, sortBy]);

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["sortBy", "jobType", "listedDate", "what", "where"].forEach((key) =>
      params.delete(key)
    );

    setSortBy("relevance");
    setJobType(null);
    setListedDate("all");

    skipNextPush.current = true;

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const jobTypeLabels: Record<JobType, string> = {
    fulltime: t("fullTime"),
    parttime: t("partTime"),
    contract: t("contract"),
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
            className="flex items-center justify-between rounded-md border-border bg-background hover:bg-accent text-foreground w-full sm:w-auto"
          >
            {jobType ? jobTypeLabels[jobType] : t("jobType")}
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
            className="flex items-center justify-between rounded-md border-border bg-background hover:bg-accent text-foreground w-full sm:w-auto"
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
