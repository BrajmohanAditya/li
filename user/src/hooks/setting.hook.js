import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  createSettingApi, 
  getAllSettingsApi, 
  getSettingByIdApi, 
  updateSettingApi, 
  deleteSettingApi 
} from "../api/setting.api";

export const createSettingHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSettingApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Settings saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-settings"] });
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to save settings.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const getAllSettingsHook = () => {
  return useQuery({
    queryKey: ["get-settings"],
    queryFn: getAllSettingsApi,
    retry: false,
  });
};

export const getSettingByIdHook = (id) => {
  return useQuery({
    queryKey: ["get-setting-by-id", id],
    queryFn: () => getSettingByIdApi(id),
    enabled: !!id,
  });
};

export const updateSettingHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettingApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-settings"] });
      // Invalidate specific setting as well if id is available
      // queryClient.invalidateQueries({ queryKey: ["get-setting-by-id", data.data.id] });
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to update settings.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const deleteSettingHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSettingApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Settings deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-settings"] });
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to delete settings.";
      toast.error(message);
    },
  });
};
