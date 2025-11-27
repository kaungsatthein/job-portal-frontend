import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiInstance from "@/lib/api-config/instance";

const saveJobRequest = async (jobId: string) => {
  const response = await apiInstance.post(`/user/saved-jobs/${jobId}`);
  return response.data?.data ?? response.data;
};

const removeSavedJobRequest = async (savedJobId: string) => {
  const response = await apiInstance.delete(`/user/saved-jobs/${savedJobId}`);
  return response.data?.data ?? response.data;
};

export const fetchSavedJobs = async () => {
  const response = await apiInstance.get("/user/saved-jobs");
  return response.data?.savedJobs ?? response.data?.data ?? response.data;
};

export const useSaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveJobRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useRemoveSavedJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeSavedJobRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};
