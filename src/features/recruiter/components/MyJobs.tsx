"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth";
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
import {
  Briefcase,
  Globe2,
  Search,
  UploadCloud,
  Users,
  Trash2,
} from "lucide-react";
import { deleteJobPosting } from "@/features/job/services/job-postings";
import { updateApplicationStatus } from "@/features/job/services/job-applications";
import { showToast } from "@/lib";

type Applicant = {
  id?: string;
  researcherId?: string;
  name: string;
  role: string;
  experience: string;
  appliedAt: string;
  status: "submitted" | "reviewed" | "accepted" | "rejected";
  resumeUrl?: string | null;
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

const statusStyles: Record<Applicant["status"], string> = {
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  reviewed: "bg-slate-100 text-slate-700 border-slate-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const normalizeStatus = (status?: string): Applicant["status"] => {
  const value = status?.toLowerCase();
  if (value === "submitted") return "submitted";
  if (value === "reviewed" || value === "reviewing") return "reviewed";
  if (value === "accepted" || value === "shortlisted") return "accepted";
  if (value === "rejected") return "rejected";
  return "submitted";
};

const MyJobs = () => {
  const t = useTranslations("RecruiterMyJobs");
  const { user } = useAuth();
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<RecruiterJob | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isLiveData = Boolean(user?.jobPosts && user.jobPosts.length > 0);

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

  useEffect(() => {
    if (user?.jobPosts && user.jobPosts.length > 0) {
      const mapped: RecruiterJob[] = user.jobPosts.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company?.name || "Untitled company",
        location: job.location || "Not specified",
        job_type: job.jobType || "fulltime",
        posted: new Date(job.createdAt).toLocaleDateString(),
        applicants:
          job.applications?.map((application, index) => ({
            id: application.id,
            researcherId: application.researcherId,
            name:
              (application as any)?.researcher?.name ||
              application.researcherId?.slice(0, 8) ||
              `Applicant ${index + 1}`,
            role: (application as any)?.researcher?.headline || "Researcher",
            experience: (application as any)?.researcher?.experience || "",
            appliedAt: new Date(application.createdAt).toLocaleDateString(),
            status: normalizeStatus(application.status),
            resumeUrl: (application as any)?.researcher?.resumeUrl,
          })) || [],
      }));
      setJobs(mapped);
    }
  }, [user]);

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

  const handleStatusChange = async (
    jobId: string,
    applicant: Applicant,
    status: Applicant["status"]
  ) => {
    const prevJobs = jobs;
    const updateApplicants = (list: Applicant[]) =>
      list.map((item) =>
        item.id
          ? item.id === applicant.id
            ? { ...item, status }
            : item
          : item.name === applicant.name
          ? { ...item, status }
          : item
      );

    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              applicants: updateApplicants(job.applicants),
            }
          : job
      )
    );

    setSelectedJob((prev) => {
      if (!prev || prev.id !== jobId) return prev;
      return {
        ...prev,
        applicants: updateApplicants(prev.applicants),
      };
    });

    if (!isLiveData) {
      showToast("info", t("demoUpdate"));
      return;
    }

    if (!applicant.id) {
      showToast("error", t("statusUpdateFailed"));
      return;
    }

    try {
      await updateApplicationStatus(applicant.id, status);
      showToast("success", t("statusUpdated"));
    } catch (error: any) {
      console.error("Failed to update status", error);
      setJobs(prevJobs);
      const prevSelected = prevJobs.find((job) => job.id === jobId) || null;
      setSelectedJob(prevSelected);
      showToast(
        "error",
        error?.response?.data?.message || t("statusUpdateFailed")
      );
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!isLiveData) {
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      setSelectedJob(null);
      showToast("info", t("demoDelete"));
      return;
    }
    try {
      await deleteJobPosting(jobId);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      setSelectedJob(null);
      showToast("success", t("deleteSuccess"));
    } catch (error: any) {
      console.error("Failed to delete job", error);
      showToast("error", error?.response?.data?.message || t("deleteFailed"));
    }
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
              {isLiveData ? t("liveBadge") : t("demoBadge")}
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
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                    <Users className="h-4 w-4" />
                    <span>
                      {t("applicantsCount", { count: job.applicants.length })}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(job.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
                          {applicant.resumeUrl && (
                            <a
                              href={applicant.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-primary underline"
                            >
                              {t("viewResume")}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
                        <Select
                          defaultValue={applicant.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              selectedJob.id,
                              applicant,
                              value as Applicant["status"]
                            )
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className={`rounded-full border-none ${
                              statusStyles[applicant.status] ??
                              "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            <SelectValue aria-label={applicant.status}>
                              <span className=" font-semibold">
                                {t(`status.${applicant.status}`)}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">
                              {t("status.submitted")}
                            </SelectItem>
                            <SelectItem value="reviewed">
                              {t("status.reviewed")}
                            </SelectItem>
                            <SelectItem value="accepted">
                              {t("status.accepted")}
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
