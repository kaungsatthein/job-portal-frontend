import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobDetailCardProps {
  job: {
    title: string;
    company: string;
    job_type: string;
    location: string;
    pay_range: string;
    experience_required: string;
    working_hours: string;
    posted: string;
    job_scope: string;
  };
}

export function JobDetailCard({ job }: JobDetailCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="mb-4 flex gap-3">
            <Badge variant="default">{job.job_type}</Badge>
            <Badge variant="secondary">{job.location}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{job.company}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Posted {job.posted}
          </p>
        </div>

        {/* Key Details */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded-lg bg-accent/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pay Range
            </p>
            <p className="text-lg font-semibold text-foreground">
              {job.pay_range}
            </p>
          </div>
          <div className="space-y-2 rounded-lg bg-accent/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Working Hours
            </p>
            <p className="text-sm font-medium text-foreground">
              {job.working_hours}
            </p>
          </div>
          <div className="space-y-2 rounded-lg bg-accent/30 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Experience Required
            </p>
            <p className="text-sm font-medium text-foreground">
              {job.experience_required}
            </p>
          </div>
        </div>

        {/* Job Scope */}
        <div className="space-y-3 border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-foreground">
            Job Description
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {job.job_scope}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 border-t border-border pt-6">
          <Button variant="outline" className="flex-1 bg-transparent">
            Save Job
          </Button>
          <Button className="flex-1">Apply Now</Button>
        </div>
      </div>
    </div>
  );
}
