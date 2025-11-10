"use client";

import { useState } from "react";
import { Job } from "../type";
import { JobCard } from "./JobCard";
import { JobDetailCard } from "./JobDetailCard";

interface JobListProps {
  jobs: Job[];
}

export const JobList = ({ jobs }: JobListProps) => {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(1);

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  return (
    <div className="flex gap-2 w-full h-[calc(100vh-4rem)] mb-14">
      {/* list */}
      <div className="w-[40%] h-full overflow-y-auto">
        <div className="w-full h-[100vh] p-4 pt-0 space-y-2">
          <label className="font-semibold text-xl">Available Jobs</label>
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
      {selectedJob ? (
        <JobDetailCard job={selectedJob} />
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Select a job to view details</p>
        </div>
      )}
    </div>
  );
};
