import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addStudentApi, getAllStudentsApi, deleteStudentApi } from "../api/add.student.api";
import { toast } from "sonner";

export const addStudentHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStudentApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Student added successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-students"] });
    },
    onError: (error) => {
      let message =
        error.response?.data?.message ||
        "Failed to add student. Please check your connection.";
      if (Array.isArray(message)) {
        message = message[0];
      }
      toast.error(message);
    },
  });
};

export const getAllStudentsHook = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-students"],
    queryFn: getAllStudentsApi,
    enabled: !!token,
  });
};

export const deleteStudentHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudentApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Student deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-students"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to delete student.";
      toast.error(message);
    },
  });
};
