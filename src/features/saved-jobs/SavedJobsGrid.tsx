"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { JobCard } from "@/features/job/components/JobCard";
import type { Job } from "@/features/job/type";

export const demoSavedJobs: Job[] = [
  {
    id: "sj-1",
    title: "Senior Frontend Engineer",
    company: "Aurora Labs",
    location: "Remote • GMT+7",
    pay_range: "$120k - $150k",
    job_type: "Full-time",
    experience_required: "5+ years",
    working_hours: "Flexible",
    posted: "2d ago",
    job_scope: "Lead frontend initiatives across design system and web app UI.",
    status: "active",
    companyIndustry: "technology",
    applicationsCount: 24,
  },
  {
    id: "sj-2",
    title: "Product Designer (B2B SaaS)",
    company: "NimbusHQ",
    location: "Singapore • Hybrid",
    pay_range: "$90k - $110k",
    job_type: "Hybrid",
    experience_required: "4+ years",
    working_hours: "Standard",
    posted: "1d ago",
    job_scope: "Design enterprise dashboards and evolve the component library.",
    status: "active",
    companyIndustry: "technology",
    applicationsCount: 12,
  },
  {
    id: "sj-3",
    title: "Data Analyst",
    company: "Vertex Talent",
    location: "Yangon • On-site",
    pay_range: "1,800,000 - 2,200,000 MMK",
    job_type: "On-site",
    experience_required: "3+ years",
    working_hours: "Mon-Fri",
    posted: "3d ago",
    job_scope: "Own reporting, SQL dashboards, and ad-hoc insights.",
    status: "active",
    companyIndustry: "technology",
    applicationsCount: 8,
  },
  {
    id: "sj-4",
    title: "Mobile Engineer (React Native)",
    company: "Aurora Labs",
    location: "Remote",
    pay_range: "$100k - $130k",
    job_type: "Remote",
    experience_required: "4+ years",
    working_hours: "Flexible",
    posted: "5d ago",
    job_scope: "Ship mobile features and collaborate with product/design.",
    status: "active",
    companyIndustry: "technology",
    applicationsCount: 17,
  },
];

export const SavedJobsGrid = ({ locale }: { locale: string }) => {
  const t = useTranslations("SavedJobs");
  const jobs = useMemo(() => demoSavedJobs, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">
          {t("subtitle", { count: jobs.length })}
        </p>
      </div>
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
    </div>
  );
};
