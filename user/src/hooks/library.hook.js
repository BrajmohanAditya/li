import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLibraryApi, getAllLibrariesApi, getAllLibrariesApiInDetails, updateLibraryApi, deleteLibraryApi } from "../api/library.api";
import { toast } from "sonner";

export const createLibraryHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLibraryApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Library created successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-libraries"] }); 
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to create library. Please check your connection.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const getAllLibrariesHook = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-libraries"],
    queryFn: getAllLibrariesApi,
    enabled: !!token,
  });
};

export const getAllLibrariesInDetailsHook = (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-libraries-details", page, limit],
    queryFn: () => getAllLibrariesApiInDetails(page, limit),
    enabled: !!token,
  });
};

export const updateLibraryHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLibraryApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Library updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-libraries"] });
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to update library.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const deleteLibraryHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLibraryApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Library deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-libraries"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to delete library.";
      toast.error(message);
    },
  });
};
