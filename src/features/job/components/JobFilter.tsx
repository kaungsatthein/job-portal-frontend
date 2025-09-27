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

type SortOption = "relevance" | "date";
type JobType = "all" | "full-time" | "part-time" | "contract" | "internship";
type ListedDate = "all" | "24h" | "3d" | "7d" | "30d";

export function JobFilter() {
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [jobType, setJobType] = useState<JobType>("all");
  const [listedDate, setListedDate] = useState<ListedDate>("all");

  const resetFilters = () => {
    setSortBy("relevance");
    setJobType("all");
    setListedDate("all");
  };

  const jobTypeLabels: Record<JobType, string> = {
    all: "Job type",
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
  };

  const listedDateLabels: Record<ListedDate, string> = {
    all: "Listed date",
    "24h": "Last 24 hours",
    "3d": "Last 3 days",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
  };

  return (
    <div className="flex items-center gap-2">
      {/* Sort by section */}
      <div className="flex items-center">
        <span className="text-sm  text-foreground">Sort by:</span>
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
            Relevance
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
            Date
          </Button>
        </div>
      </div>

      {/* Job type dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"sm"}
            variant="outline"
            className="flex items-center rounded-full border-border bg-background hover:bg-accent text-foreground"
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
            className="flex items-center  rounded-full border-border bg-background hover:bg-accent text-foreground"
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
      <Button variant="link" onClick={resetFilters} className="py-0 px-1">
        Reset all filters
      </Button>
    </div>
  );
}
