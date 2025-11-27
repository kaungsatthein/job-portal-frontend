import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiInstance from "@/lib/api-config/instance";

export type CreateApplicationPayload = {
  researcherId: string;
  jobId: string;
  status: "submitted";
};

const applyToJobRequest = async (payload: CreateApplicationPayload) => {
  const response = await apiInstance.post("/applications", payload);
  return response.data?.data ?? response.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: "submitted" | "reviewed" | "accepted" | "rejected"
) => {
  const response = await apiInstance.patch(
    `/applications/${applicationId}/status`,
    { status }
  );
  return response.data?.data ?? response.data;
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyToJobRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};
