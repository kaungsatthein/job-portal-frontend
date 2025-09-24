import React from "react";
import { Job } from "../type";
import { JobCard } from "./JobCard";

interface JobListProps {
  jobs: Job[];
}

export const JobList = ({ jobs }: JobListProps) => {
  return (
    <div className="flex gap-2 w-full h-[calc(100vh-4rem)]">
      {/* list */}
      <div className="w-[40%] h-full overflow-y-auto">
        <div className="w-full h-[100vh] p-4 space-y-2">
          {jobs?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
      {/* list detail */}
      <div className="w-[60%] h-full bg-red-300">
        <div className="w-full h-full"></div>
      </div>
    </div>
  );
};
