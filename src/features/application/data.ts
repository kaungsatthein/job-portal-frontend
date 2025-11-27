export type Stage =
  | "applied"
  | "reviewing"
  | "interview"
  | "offer"
  | "declined";

export type Actor = "recruiter" | "researcher" | "system";

export type TimelineEntry = {
  title: string;
  description: string;
  time: string;
  actor: Actor;
  state: "done" | "active";
};

export type NextStep = {
  owner: Exclude<Actor, "system">;
  label: string;
  due: string;
};

export type RawApplication = {
  id: string;
  jobId: string;
  status: string;
  createdAt: string;
  job?: {
    id: string;
    title?: string;
    description?: string;
    jobType?: string;
    location?: string;
    salaryRange?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    company?: { name?: string } | null;
    recruiter?: { name?: string } | null;
  } | null;
};

export type Application = {
  id: string;
  role: string;
  company: string;
  location: string;
  stage: Stage;
  lastUpdate: string;
  recruiter: string;
  summary: string;
  nextStep: NextStep;
  timeline: TimelineEntry[];
  rawStatus: string;
  createdAt: string;
  jobDescription: string;
  jobType: string;
  salaryRange: string;
  jobId: string;
  jobStatus: string;
};

const statusToStageMap: Record<string, Stage> = {
  submitted: "applied",
  reviewing: "reviewing",
  reviewed: "reviewing",
  interview: "interview",
  interviewing: "interview",
  accepted: "offer",
  offer: "offer",
  rejected: "declined",
  declined: "declined",
};

const stageSummaries: Record<Stage, string> = {
  applied: "Your application was submitted and is waiting for review.",
  reviewing: "Recruiter is reviewing your application.",
  interview: "Interview process is in progress.",
  offer: "An offer is ready for your review.",
  declined: "This application has been closed.",
};

const stageNextSteps: Record<Stage, NextStep> = {
  applied: {
    owner: "recruiter",
    label: "Recruiter will review your application and respond.",
    due: "Soon",
  },
  reviewing: {
    owner: "recruiter",
    label: "Recruiter is reviewing your profile and will update you.",
    due: "1-3 days",
  },
  interview: {
    owner: "researcher",
    label: "Prepare and confirm the upcoming interview schedule.",
    due: "This week",
  },
  offer: {
    owner: "researcher",
    label: "Review the offer details and respond to the recruiter.",
    due: "3 days",
  },
  declined: {
    owner: "researcher",
    label: "Review recruiter feedback and explore other openings.",
    due: "Anytime",
  },
};

const formatRelativeTime = (dateString?: string | null) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60 * 1000) return "Just now";
  if (diffMs < 60 * 60 * 1000) {
    const minutes = Math.max(1, Math.floor(diffMs / (60 * 1000)));
    return `${minutes}m ago`;
  }
  if (diffMs < 24 * 60 * 60 * 1000) {
    const hours = Math.max(1, Math.floor(diffMs / (60 * 60 * 1000)));
    return `${hours}h ago`;
  }
  const days = Math.max(1, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
};

const mapStatusToStage = (status?: string | null): Stage => {
  if (!status) return "applied";
  const key = status.toLowerCase();
  return statusToStageMap[key] ?? "applied";
};

const buildTimeline = (
  stage: Stage,
  createdAt: string,
  updatedAt: string | undefined | null,
  jobTitle: string,
  company: string
): TimelineEntry[] => {
  const timeline: TimelineEntry[] = [
    {
      title: "Application submitted",
      description: `You applied for ${jobTitle} at ${company}.`,
      time: formatDateTime(createdAt),
      actor: "researcher",
      state: "done",
    },
  ];

  const recruiterReviewEntry: TimelineEntry = {
    title: "Recruiter review",
    description: "Recruiter will review your profile and share updates.",
    time: formatRelativeTime(updatedAt ?? createdAt),
    actor: "recruiter",
    state: stage === "applied" ? "active" : "done",
  };

  timeline.push(recruiterReviewEntry);

  if (stage === "reviewing") {
    timeline.push({
      title: "Awaiting recruiter decision",
      description: "Once finished reviewing, they will contact you.",
      time: "In progress",
      actor: "recruiter",
      state: "active",
    });
  }

  if (stage === "interview") {
    timeline.push({
      title: "Interview process",
      description: "Interview is scheduled or being arranged.",
      time: "Upcoming",
      actor: "system",
      state: "active",
    });
  }

  if (stage === "offer") {
    timeline.push({
      title: "Offer shared",
      description: "Recruiter prepared an offer for you.",
      time: formatRelativeTime(updatedAt),
      actor: "recruiter",
      state: "done",
    });
    timeline.push({
      title: "Review offer",
      description: "Review the offer details and respond.",
      time: "Awaiting your response",
      actor: "researcher",
      state: "active",
    });
  }

  if (stage === "declined") {
    timeline.push({
      title: "Application closed",
      description: "Recruiter decided not to move forward.",
      time: formatRelativeTime(updatedAt ?? createdAt),
      actor: "recruiter",
      state: "done",
    });
  }

  return timeline;
};

export const transformApplication = (application: RawApplication): Application => {
  const stage = mapStatusToStage(application.status);
  const job = application.job ?? null;
  const role = job?.title ?? "Untitled role";
  const company = job?.company?.name ?? "Unknown company";
  const location = job?.location ?? "Not specified";
  const recruiter = job?.recruiter?.name ?? "Hiring team";
  const summary = stageSummaries[stage];
  const nextStep = stageNextSteps[stage];
  const lastUpdate = formatRelativeTime(job?.updatedAt ?? application.createdAt);
  const timeline = buildTimeline(
    stage,
    application.createdAt,
    job?.updatedAt ?? job?.createdAt,
    role,
    company
  );

  return {
    id: application.id,
    role,
    company,
    location,
    stage,
    lastUpdate,
    recruiter,
    summary,
    nextStep,
    timeline,
    rawStatus: application.status,
    createdAt: application.createdAt,
    jobDescription: job?.description ?? "No description provided.",
    jobType: job?.jobType ?? "Not specified",
    salaryRange: job?.salaryRange ?? "Not specified",
    jobId: job?.id ?? application.jobId,
    jobStatus: job?.status ?? "pending",
  };
};

export const transformApplications = (
  applications: RawApplication[] | undefined | null
): Application[] => {
  if (!Array.isArray(applications)) {
    return [];
  }
  return applications.map(transformApplication);
};
