import { JobDetailCard } from "@/features/job";
import { fetchJobPosting } from "@/features/job/services/job-postings";
import { fetchSavedJobs } from "@/features/job/services/saved-jobs";
import { Job, JobPosting } from "@/features/job/type";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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

const mapJobPostingToJob = (posting: JobPosting): Job => ({
  id: posting.id,
  title: posting.title,
  company:
    posting.company?.name || posting.recruiter?.name || "Unknown Company",
  location: posting.location || "Not specified",
  pay_range: posting.salaryRange || "Not specified",
  job_type: formatJobType(posting.jobType),
  experience_required: "Not specified",
  working_hours: "Not specified",
  posted: formatPostedTime(posting.createdAt),
  job_scope: posting.description || "No description provided.",
  status: posting.status,
  companyIndustry: posting.company?.industryId,
  applicationsCount: posting.applications?.length ?? 0,
  isSaved: Boolean((posting as any)?.isSaved),
});

export default async function JobDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;

  try {
    const jobPosting = await fetchJobPosting(id);
    let savedId: string | null = null;
    try {
      const savedResponse = await fetchSavedJobs();
      const savedRecords = Array.isArray(savedResponse)
        ? savedResponse
        : Array.isArray(savedResponse?.savedJobs)
        ? savedResponse.savedJobs
        : Array.isArray(savedResponse?.data)
        ? savedResponse.data
        : [];
      const savedRecord =
        savedRecords.find(
          (record: any) =>
            record?.id === jobPosting.id ||
            record?.jobId === jobPosting.id ||
            record?.job?.id === jobPosting.id
        ) || null;
      if (savedRecord) {
        savedId = savedRecord.id || savedRecord.jobId || jobPosting.id;
      }
    } catch (error: any) {
      if (error?.response?.status !== 401) {
        console.error("Failed to fetch saved jobs", error);
      }
    }

    const job: Job = {
      ...mapJobPostingToJob(jobPosting),
      isSaved: Boolean(savedId),
      savedJobId: savedId || undefined,
    };

    return (
      <div className="mx-4 lg:mx-8 my-6 space-y-4">
        <Link
          href={`/${locale}/jobs`}
          className="inline-flex gap-1 items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to jobs</span>
        </Link>
        <JobDetailCard job={job} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch job posting", error);
    notFound();
  }
}
