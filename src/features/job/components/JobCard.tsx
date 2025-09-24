import React from "react";
import { Job } from "../type";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

interface JobCardProps {
  job: Job;
}

const JobDetailwithBg = ({
  detail,
  className,
}: {
  detail: string;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "p-1.5 rounded-sm text-primary max-w-max text-xs bg-gray-300",
        className
      )}
    >
      {detail}
    </p>
  );
};

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <div
      className="w-full space-y-2 rounded-md p-4 border active:border-green-300 select h-[310px] shadow-lg hover:shadow-xl"
      key={job?.id}
    >
      <p className="bg-blue-200 p-1.5 rounded-sm text-primary max-w-max text-xs">
        New to you
      </p>
      <p className="font-semibold">{job.title}</p>
      <p className="text-sm font-medium">{job.company}</p>
      <p>{job.location}</p>
      <div className="flex gap-2 items-center">
        <JobDetailwithBg detail={job.pay_range} />
        <JobDetailwithBg detail={job.job_type} />
        <JobDetailwithBg
          detail={job.experience_required}
          className="bg-green-200"
        />
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <p>{job.working_hours}</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <p>{job.posted}</p>
        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
        <p>{job.job_scope}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs">Posted {job.posted}</p>
        <Button variant={"outline"} className="tex-sm rounded-2xl gap-1">
          <Bookmark className="text-green-600" /> Save
        </Button>
      </div>
    </div>
  );
};
