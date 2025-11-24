"use server";

import apiInstance from "@/lib/api-config/instance";
import { JobPosting, JobPostingsResponse } from "../type";

export const fetchJobPostings = async (): Promise<JobPosting[]> => {
  const response = await apiInstance.get<JobPostingsResponse>("/job-postings");
  return response.data.data;
};
