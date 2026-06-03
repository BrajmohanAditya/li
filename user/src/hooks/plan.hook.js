import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createPlanApi, deletePlanApi, getAllPlansApi, getPlansByLibraryApi } from "../api/plan.api";
import { toast } from "sonner";

export const createPlanHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlanApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Plan created successfully!");
      // Assuming you might want to invalidate a query for getting plans later
      queryClient.invalidateQueries({ queryKey: ["get-plans"] });
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to create plan. Please check your connection.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const deletePlanHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlanApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Plan deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-plans"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to delete plan.";
      toast.error(message);
    },
  });
};

export const getPlansHook = (libraryId) => {
  return useQuery({
    queryKey: ["get-plans", libraryId],
    queryFn: () => libraryId ? getPlansByLibraryApi(libraryId) : getAllPlansApi(),
  });
};
