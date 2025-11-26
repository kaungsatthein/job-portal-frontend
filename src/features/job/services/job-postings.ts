"use server";

import apiInstance from "@/lib/api-config/instance";
import { JobPosting, JobPostingResponse, JobPostingsResponse } from "../type";

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
      status: "pending",
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
