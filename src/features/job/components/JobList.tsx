"use client";

import { useEffect, useState } from "react";
import { Job } from "../type";
import { JobCard } from "./JobCard";
import { JobDetailCard } from "./JobDetailCard";
import { useTranslations } from "next-intl";

interface JobListProps {
  jobs: Job[];
}

export const JobList = ({ jobs }: JobListProps) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const t = useTranslations("JobList");

  useEffect(() => {
    if (jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    } else {
      setSelectedJobId(null);
    }
  }, [jobs]);

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-2 w-full lg:h-[calc(100vh-4rem)] mb-14">
      {/* list */}
      <div className="w-full lg:w-[40%] lg:h-full overflow-y-auto">
        <div className="w-full h-[100vh] p-4 pt-0 space-y-2 ">
          <label className="font-semibold text-xl">{t("available")}</label>
          <div className=" mt-2 flex flex-col gap-4">
            {jobs?.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`w-full text-left transition-all ${
                  selectedJobId === job.id
                    ? "border rounded-md"
                    : "hover:shadow-md"
                }`}
              >
                <JobCard key={job.id} job={job} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* list detail */}
      <div className="w-full lg:w-[58%]">
        {selectedJob ? (
          <JobDetailCard job={selectedJob} />
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">{t("selectPrompt")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
