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
}

export const fetchJobPostings = async ({
  search,
  jobType,
  startDate,
  endDate,
  page = 1,
  limit = 10,
}: FetchJobPostingsParams): Promise<JobPosting[]> => {
  const response = await apiInstance.get<JobPostingsResponse>(
    "/job-postings",
    {
      params: {
        status: "pending",
        search,
        jobType,
        startDate,
        endDate,
        page,
        limit,
      },
    }
  );
  return response.data.data;
};

export const fetchJobPosting = async (id: string): Promise<JobPosting> => {
  const response = await apiInstance.get<JobPostingResponse>(
    `/job-postings/${id}`
  );
  return response.data.data;
};
