import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLibraryApi } from "../api/library.api";
import { toast } from "sonner";

export const createLibraryHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLibraryApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Library created successfully!");
      // Tells React Query to refetch the libraries list so the new library shows up immediately (when we implement the list)
      queryClient.invalidateQueries({ queryKey: ["get-libraries"] }); 
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to create library. Please check your connection.";
      
      // NestJS ValidationPipe often returns an array of messages
      if (Array.isArray(message)) {
        message = message[0];
      }
      
      toast.error(message);
    },
  });
};
