import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  createFeedbackApi, 
  getAllFeedbacksApi, 
  getFeedbackByIdApi, 
  updateFeedbackApi, 
  deleteFeedbackApi, 
  getFeedbacksByLibraryApi 
} from "../api/feedback.api";
import { toast } from "sonner";

export const createFeedbackHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFeedbackApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Feedback submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-feedbacks"] }); 
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to submit feedback. Please try again.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const getAllFeedbacksHook = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-feedbacks"],
    queryFn: getAllFeedbacksApi,
    enabled: !!token,
  });
};

export const getFeedbackByIdHook = (id) => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-feedback", id],
    queryFn: () => getFeedbackByIdApi(id),
    enabled: !!token && !!id,
  });
};

export const updateFeedbackHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFeedbackApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Feedback updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["get-feedback"] });
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to update feedback.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const deleteFeedbackHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFeedbackApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Feedback deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-feedbacks"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to delete feedback.";
      toast.error(message);
    },
  });
};

export const getFeedbacksByLibraryHook = (libraryId) => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-feedbacks-by-library", libraryId],
    queryFn: () => getFeedbacksByLibraryApi(libraryId),
    enabled: !!token && !!libraryId,
  });
};
