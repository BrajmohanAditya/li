import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSheetApi, getAllSheetsApi, getSheetByIdApi, updateSheetApi, deleteSheetApi } from "../api/seat.create.api";
import { toast } from "sonner";

export const createSheetHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSheetApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Seat created successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-sheets"] });
    },
    onError: (error) => {
      let message = error.response?.data?.message || "Failed to create seat.";
      if (Array.isArray(message)) message = message[0];
      toast.error(message);
    },
  });
};

export const getAllSheetsHook = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-sheets"],
    queryFn: getAllSheetsApi,
    enabled: !!token,
  });
};

export const getSheetByIdHook = (id) => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-sheet", id],
    queryFn: () => getSheetByIdApi(id),
    enabled: !!token && !!id,
  });
};

export const updateSheetHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSheetApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Seat updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-sheets"] });
      // Invalidate specific sheet query if needed
      queryClient.invalidateQueries({ queryKey: ["get-sheet"] });
    },
    onError: (error) => {
      let message = error.response?.data?.message || "Failed to update seat.";
      if (Array.isArray(message)) message = message[0];
      toast.error(message);
    },
  });
};

export const deleteSheetHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSheetApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Seat deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-sheets"] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete seat.";
      toast.error(message);
    },
  });
};
