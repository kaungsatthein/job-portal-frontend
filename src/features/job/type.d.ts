export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  pay_range: string;
  job_type: string;
  experience_required: string;
  working_hours: string;
  posted: string;
  job_scope: string;
  status?: string;
  companyIndustry?: string;
  applicationsCount?: number;
}

export interface Recruiter {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  companyId: string;
  resumeUrl: string | null;
  birthDate: string | null;
  nrc: string | null;
  status: string;
  google_id: string | null;
  google_email: string | null;
  avatar_url: string | null;
  provider: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  researcherId: string;
  jobId: string;
  status: string;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  recruiterId: string;
  companyId: string;
  title: string;
  description: string;
  jobType: string;
  location: string;
  salaryRange: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  recruiter: Recruiter;
  company: Company;
  applications: JobApplication[];
}

export interface CreateJobPostingPayload {
  recruiterId: string;
  companyId: string;
  title: string;
  description: string;
  jobType: string;
  location: string;
  salaryRange: string;
  status: string;
}

export interface JobPostingsResponse {
  statusCode: number;
  message: string;
  data: JobPosting[];
  timestamp: string;
}

export interface JobPostingResponse {
  statusCode: number;
  message: string;
  data: JobPosting;
  timestamp: string;
}

export interface DeleteJobPostingResponse {
  statusCode: number;
  message: string;
  timestamp: string;
}
