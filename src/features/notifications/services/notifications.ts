import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiInstance from "@/lib/api-config/instance";

export type NotificationPayload = {
  type: string;
  message: string;
  userId: string;
  applicationId?: string | null;
};

export type NotificationItemResponse = {
  id: string;
  type: string;
  message: string;
  userId: string;
  applicationId?: string | null;
  createdAt: string;
  readAt?: string | null;
};

const fetchNotificationsRequest = async (): Promise<
  NotificationItemResponse[]
> => {
  const response = await apiInstance.get("/notifications/me");
  const data = response.data?.data ?? response.data;
  return Array.isArray(data) ? data : [];
};

const createNotificationRequest = async (payload: NotificationPayload) => {
  const response = await apiInstance.post("/notifications", payload);
  return response.data?.data ?? response.data;
};

const fetchNotificationRequest = async (id: string) => {
  const response = await apiInstance.get(`/notifications/${id}`);
  return response.data?.data ?? response.data;
};

const markNotificationReadRequest = async (id: string) => {
  const response = await apiInstance.patch(`/notifications/${id}/read`);
  return response.data?.data ?? response.data;
};

export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationsRequest,
  });

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNotificationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useNotification = (id: string) =>
  useQuery({
    queryKey: ["notifications", id],
    queryFn: () => fetchNotificationRequest(id),
    enabled: Boolean(id),
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationReadRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
