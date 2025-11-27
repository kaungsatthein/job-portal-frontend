import { SavedJobsGrid } from "@/features/saved-jobs";
import { fetchSavedJobs } from "@/features/job/services/saved-jobs";
import { Job } from "@/features/job/type";
import { getTranslations } from "next-intl/server";
import { randomUUID } from "crypto";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const SavedJobsPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations("SavedJobs");

  const formatJobType = (jobType: string) => {
    if (!jobType) return "Not specified";
    return jobType
      .replace(/[_-]/g, " ")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .replace(/(^|\s)\S/g, (match) => match.toUpperCase());
  };

  const formatPostedTime = (createdAt: string) => {
    const parsedDate = new Date(createdAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    const diffMs = Date.now() - parsedDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
      const safeHours = diffHours <= 0 ? 1 : diffHours;
      return `${safeHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    return parsedDate.toLocaleDateString();
  };

  type SavedJobSource = {
    id?: string;
    title?: string;
    company?: { name?: string; industryId?: string } | null;
    recruiter?: { name?: string } | null;
    location?: string;
    salaryRange?: string;
    jobType?: string;
    description?: string;
    status?: string;
    createdAt?: string;
    applications?: Array<{ researcherId?: string; jobId?: string }> | null;
  };

  const mapJobPostingToJob = (
    posting: SavedJobSource,
    fallbackId: string,
    hasApplied?: boolean,
    savedId?: string
  ): Job => ({
    id: posting.id || fallbackId,
    title: posting.title || "Untitled job",
    company:
      posting.company?.name || posting.recruiter?.name || "Unknown Company",
    location: posting.location || "Not specified",
    pay_range: posting.salaryRange || "Not specified",
    job_type: formatJobType(posting.jobType || ""),
    experience_required: "Not specified",
    working_hours: "Not specified",
    posted: posting.createdAt
      ? formatPostedTime(posting.createdAt)
      : "Recently",
    job_scope: posting.description || "No description provided.",
    status: posting.status,
    companyIndustry: posting.company?.industryId,
    applicationsCount: posting.applications?.length ?? 0,
    hasApplied,
    isSaved: true,
    savedJobId: savedId ?? fallbackId,
  });

  let jobs: Job[] = [];
  let unauthorized = false;

  try {
    const savedResponse = await fetchSavedJobs();
    const records = Array.isArray(savedResponse)
      ? savedResponse
      : Array.isArray(savedResponse?.savedJobs)
      ? savedResponse.savedJobs
      : Array.isArray(savedResponse?.data)
      ? savedResponse.data
      : [];
    jobs =
      records
        ?.map((record: any) => {
          const source: SavedJobSource = record as SavedJobSource;
          const fallbackId = record?.id || randomUUID();
          const jobData = mapJobPostingToJob(
            source,
            fallbackId,
            false,
            record?.id
          );
          return jobData;
        })
        .filter(Boolean) ?? [];
  } catch (error: any) {
    if (error?.response?.status === 401) {
      unauthorized = true;
    } else {
      console.error("Failed to fetch saved jobs", error);
    }
  }

  return (
    <div className="mx-4 my-6 lg:mx-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground lg:text-2xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("subtitle", { count: jobs.length })}
        </p>
      </div>
      <div className="mt-4">
        {unauthorized ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            {t("loginPrompt")}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            {t("empty")}
          </div>
        ) : (
          <SavedJobsGrid locale={locale} jobs={jobs} />
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
