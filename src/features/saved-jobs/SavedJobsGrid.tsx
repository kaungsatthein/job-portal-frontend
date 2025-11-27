"use client";

import Link from "next/link";
import { JobCard } from "@/features/job/components/JobCard";
import type { Job } from "@/features/job/type";

export const SavedJobsGrid = ({
  locale,
  jobs,
}: {
  locale: string;
  jobs: Job[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/${locale}/jobs/${job.id}`}
          className="block"
          prefetch={false}
        >
          <JobCard job={job} />
        </Link>
      ))}
    </div>
  );
};
