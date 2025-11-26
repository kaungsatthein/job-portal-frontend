import { Separator } from "@/components/ui/separator";
import { JobFilter, JobList, JobSearchBar } from "@/features/job";
import { fetchJobPostings } from "@/features/job/services/job-postings";
import { Job, JobPosting } from "@/features/job/type";

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
});

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    what?: string;
    where?: string;
    jobType?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
  }>;
}) {
  const params = await searchParams;
  const { what, where, jobType, startDate, endDate } = params;
  console.log("jobType :>> ", jobType);

  let jobs: Job[] = [];

  try {
    const jobPostings = await fetchJobPostings({
      search: what,
      jobType,
      startDate,
      endDate,
      location: where,
    });
    console.log("jobPostingsss :>> ", jobPostings);
    jobs = jobPostings?.data?.map(mapJobPostingToJob) ?? [];
  } catch (error) {
    console.error("Failed to fetch job postings", error);
  }

  return (
    <div className="mt-5">
      <div className="mx-4 lg:mx-8">
        <JobSearchBar what={what} where={where} />
      </div>
      <div className="mt-3 mb-5 lg:mx-8 mx-4">
        <JobFilter />
      </div>
      <Separator className="my-8" />
      <JobList jobs={jobs} />
    </div>
  );
}
