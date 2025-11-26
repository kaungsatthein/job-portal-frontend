"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Briefcase, Globe2, Search, UploadCloud, Users } from "lucide-react";

type Applicant = {
  name: string;
  role: string;
  experience: string;
  appliedAt: string;
  status: "reviewing" | "shortlisted" | "rejected";
};

type RecruiterJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  posted: string;
  applicants: Applicant[];
};

const demoJobs: RecruiterJob[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Aurora Labs",
    location: "Remote (GMT+7)",
    job_type: "Full-time",
    posted: "2d ago",
    applicants: [
      {
        name: "Maya Chen",
        role: "Frontend Engineer @ Pulse",
        experience: "5 yrs • React / Next.js",
        appliedAt: "2d ago",
        status: "shortlisted",
      },
      {
        name: "Richard Lee",
        role: "UI Engineer @ Vertex",
        experience: "4 yrs • Tailwind / Accessibility",
        appliedAt: "1d ago",
        status: "reviewing",
      },
      {
        name: "Nandar Win",
        role: "Frontend Developer @ Wave",
        experience: "3 yrs • TypeScript / Storybook",
        appliedAt: "6h ago",
        status: "reviewing",
      },
    ],
  },
  {
    id: "2",
    title: "Product Designer (B2B SaaS)",
    company: "NimbusHQ",
    location: "Singapore • Hybrid",
    job_type: "Hybrid",
    posted: "5h ago",
    applicants: [
      {
        name: "Sarah Tan",
        role: "Senior Product Designer @ Flow",
        experience: "6 yrs • Design systems",
        appliedAt: "3h ago",
        status: "shortlisted",
      },
      {
        name: "Aung Htet",
        role: "Product Designer @ ShopLink",
        experience: "4 yrs • B2B dashboards",
        appliedAt: "4h ago",
        status: "reviewing",
      },
    ],
  },
  {
    id: "3",
    title: "Technical Recruiter (APAC)",
    company: "Vertex Talent",
    location: "Yangon",
    job_type: "On-site",
    posted: "1w ago",
    applicants: [
      {
        name: "Thiri Moe",
        role: "Talent Partner @ Spark",
        experience: "4 yrs • Tech roles",
        appliedAt: "3d ago",
        status: "reviewing",
      },
      {
        name: "Daniel Wong",
        role: "Recruiter @ Horizon",
        experience: "5 yrs • Regional hiring",
        appliedAt: "5d ago",
        status: "rejected",
      },
    ],
  },
  {
    id: "4",
    title: "Backend Engineer (Node.js)",
    company: "BrightForge",
    location: "Remote",
    job_type: "Remote",
    posted: "3d ago",
    applicants: [
      {
        name: "Luis Ortega",
        role: "Backend Engineer @ Scale",
        experience: "6 yrs • Node / Postgres",
        appliedAt: "2d ago",
        status: "reviewing",
      },
    ],
  },
  {
    id: "5",
    title: "Marketing Manager",
    company: "Northwind Co.",
    location: "Singapore • Hybrid",
    job_type: "Hybrid",
    posted: "4d ago",
    applicants: [],
  },
  {
    id: "6",
    title: "Data Analyst",
    company: "InsightWorks",
    location: "Remote",
    job_type: "Remote",
    posted: "1d ago",
    applicants: [
      {
        name: "Emily Stone",
        role: "Data Analyst @ Clarity",
        experience: "3 yrs • SQL / Looker",
        appliedAt: "10h ago",
        status: "shortlisted",
      },
      {
        name: "Min Ko",
        role: "BI Analyst @ WaveMoney",
        experience: "4 yrs • PowerBI",
        appliedAt: "8h ago",
        status: "reviewing",
      },
    ],
  },
  {
    id: "7",
    title: "Customer Success Lead",
    company: "NimbusHQ",
    location: "Bangkok • Hybrid",
    job_type: "Hybrid",
    posted: "6d ago",
    applicants: [
      {
        name: "Grace Lee",
        role: "CSM @ Pilot",
        experience: "5 yrs • Enterprise",
        appliedAt: "2d ago",
        status: "reviewing",
      },
    ],
  },
  {
    id: "8",
    title: "Mobile Engineer (React Native)",
    company: "Aurora Labs",
    location: "Remote",
    job_type: "Remote",
    posted: "1d ago",
    applicants: [
      {
        name: "Aye Chan",
        role: "Mobile Engineer @ Grab",
        experience: "5 yrs • RN / Expo",
        appliedAt: "1d ago",
        status: "shortlisted",
      },
      {
        name: "Jonathan Park",
        role: "Mobile Dev @ Nova",
        experience: "3 yrs • RN / CI/CD",
        appliedAt: "16h ago",
        status: "reviewing",
      },
    ],
  },
  {
    id: "9",
    title: "QA Engineer",
    company: "BrightForge",
    location: "Yangon",
    job_type: "On-site",
    posted: "2w ago",
    applicants: [
      {
        name: "Thiha Tun",
        role: "QA Analyst @ Wave",
        experience: "4 yrs • Cypress / Playwright",
        appliedAt: "5d ago",
        status: "reviewing",
      },
    ],
  },
];

const statusStyles: Record<Applicant["status"], string> = {
  reviewing: "bg-slate-100 text-slate-700 border-slate-200",
  shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const MyJobs = () => {
  const t = useTranslations("RecruiterMyJobs");
  const [jobs, setJobs] = useState<RecruiterJob[]>(demoJobs);
  const [selectedJob, setSelectedJob] = useState<RecruiterJob | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const initials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AP";

  const totalApplicants = useMemo(
    () => jobs.reduce((total, job) => total + job.applicants.length, 0),
    [jobs]
  );

  useEffect(() => {
    setSearchTerm("");
  }, [selectedJob]);

  const filteredApplicants = useMemo(() => {
    if (!selectedJob) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return selectedJob.applicants;
    return selectedJob.applicants.filter(
      (applicant) =>
        applicant.name.toLowerCase().includes(term) ||
        applicant.role.toLowerCase().includes(term)
    );
  }, [searchTerm, selectedJob]);

  const handleStatusChange = (
    jobId: string,
    applicantName: string,
    status: Applicant["status"]
  ) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              applicants: job.applicants.map((applicant) =>
                applicant.name === applicantName
                  ? { ...applicant, status }
                  : applicant
              ),
            }
          : job
      )
    );

    setSelectedJob((prev) => {
      if (!prev || prev.id !== jobId) return prev;
      return {
        ...prev,
        applicants: prev.applicants.map((applicant) =>
          applicant.name === applicantName
            ? { ...applicant, status }
            : applicant
        ),
      };
    });
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full border-dashed">
              {t("demoBadge")}
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {t("applicantsCount", { count: totalApplicants })}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="group flex h-full flex-col rounded-xl border border-border/70 bg-card/70 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <UploadCloud className="h-4 w-4 text-primary" />
                  <span>{t("uploadedLabel")}</span>
                </div>
                <Badge variant="secondary" className="rounded-full text-[11px]">
                  {job.posted}
                </Badge>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-sm font-semibold text-foreground line-clamp-2">
                  {job.title}
                </p>
                <p className="text-xs text-muted-foreground">{job.company}</p>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Globe2 className="h-4 w-4" />
                <span>{job.location}</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.job_type}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <Users className="h-4 w-4" />
                  <span>
                    {t("applicantsCount", { count: job.applicants.length })}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog
        open={Boolean(selectedJob)}
        onOpenChange={(open) => !open && setSelectedJob(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">
                  {selectedJob.title}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedJob.company} • {selectedJob.location}
                </p>
              </DialogHeader>

              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UploadCloud className="h-4 w-4 text-primary" />
                  <span>{t("dialogSubtitle")}</span>
                </div>
                <Badge variant="outline" className="rounded-full">
                  {t("applicantsCount", {
                    count: selectedJob.applicants.length,
                  })}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
                {filteredApplicants.length === 0 ? (
                  <div className="flex items-center justify-center rounded-lg border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
                    {selectedJob.applicants.length === 0
                      ? t("noApplicants")
                      : t("noSearchResults")}
                  </div>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <div
                      key={applicant.name}
                      className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-card/70 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {initials(applicant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {applicant.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {applicant.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {applicant.experience}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
                        <Select
                          defaultValue={applicant.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              selectedJob.id,
                              applicant.name,
                              value as Applicant["status"]
                            )
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className={`rounded-full border-none  ${
                              statusStyles[applicant.status]
                            }`}
                          >
                            <SelectValue aria-label={applicant.status}>
                              <span className=" font-semibold">
                                {t(`status.${applicant.status}`)}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reviewing">
                              {t("status.reviewing")}
                            </SelectItem>
                            <SelectItem value="shortlisted">
                              {t("status.shortlisted")}
                            </SelectItem>
                            <SelectItem value="rejected">
                              {t("status.rejected")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <span>
                          {t("appliedAt", { time: applicant.appliedAt })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyJobs;
