import apiInstance from "@/lib/api-config/instance";
import {
  JobPosting,
  JobPostingResponse,
  JobPostingsResponse,
  CreateJobPostingPayload,
  DeleteJobPostingResponse,
} from "../type";

interface FetchJobPostingsParams {
  search?: string;
  jobType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  location?: string;
}

export const fetchJobPostings = async ({
  search,
  jobType,
  startDate,
  endDate,
  page = 1,
  limit = 10,
  location,
}: FetchJobPostingsParams): Promise<JobPostingsResponse> => {
  const response = await apiInstance.get("/job-postings", {
    params: {
      status: "open",
      search,
      jobType,
      startDate,
      endDate,
      page,
      limit,
      location,
    },
  });
  return response.data.data;
};

export const fetchJobPosting = async (id: string): Promise<JobPosting> => {
  const response = await apiInstance.get<JobPostingResponse>(
    `/job-postings/${id}`
  );
  return response.data.data;
};

export const createJobPosting = async (
  payload: CreateJobPostingPayload
): Promise<JobPosting> => {
  const response = await apiInstance.post<JobPostingResponse>(
    "/job-postings",
    payload
  );
  return response.data.data;
};

export const deleteJobPosting = async (id: string) => {
  const response = await apiInstance.delete<DeleteJobPostingResponse>(
    `/job-postings/${id}`
  );
  return response.data;
};
