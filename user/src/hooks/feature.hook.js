import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    createFeatureApi, 
    getAllFeaturesApi, 
    getFeatureByIdApi, 
    updateFeatureApi, 
    deleteFeatureApi, 
    getFeaturesByLibraryIdApi 
} from "../api/fearures.api";
import { toast } from "sonner";

export const createFeatureHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeatureApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Feature created successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-features"] }); 
      queryClient.invalidateQueries({ queryKey: ["get-features-by-library"] });
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to create feature. Please check your connection.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const getAllFeaturesHook = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-features"],
    queryFn: getAllFeaturesApi,
    enabled: !!token,
  });
};

export const getFeatureByIdHook = (id) => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-feature", id],
    queryFn: () => getFeatureByIdApi(id),
    enabled: !!token && !!id,
  });
};

export const updateFeatureHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFeatureApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Feature updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-features"] });
      queryClient.invalidateQueries({ queryKey: ["get-feature"] });
      queryClient.invalidateQueries({ queryKey: ["get-features-by-library"] });
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to update feature.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const deleteFeatureHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFeatureApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Feature deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-features"] });
      queryClient.invalidateQueries({ queryKey: ["get-features-by-library"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to delete feature.";
      toast.error(message);
    },
  });
};

export const getFeaturesByLibraryIdHook = (libraryId) => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-features-by-library", libraryId],
    queryFn: () => getFeaturesByLibraryIdApi(libraryId),
    enabled: !!token && !!libraryId,
  });
};
