import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBookingApi, getAllBookingsApi, getBookingByIdApi, getBookingsByLibraryApi, updateBookingApi, deleteBookingApi } from "../api/book.seat.api";
import { toast } from "sonner";

export const createBookingHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBookingApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Booking created successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-bookings"] });
    },
    onError: (error) => {
      let message = error.response?.data?.message || "Failed to create booking.";
      if (Array.isArray(message)) message = message[0];
      toast.error(message);
    },
  });
};

export const getAllBookingsHook = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-bookings"],
    queryFn: getAllBookingsApi,
    enabled: !!token,
  });
};

export const getBookingByIdHook = (id) => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-booking", id],
    queryFn: () => getBookingByIdApi(id),
    enabled: !!token && !!id,
  });
};

export const getBookingsByLibraryHook = (libraryId) => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-bookings-by-library", libraryId],
    queryFn: () => getBookingsByLibraryApi(libraryId),
    enabled: !!token && !!libraryId,
  });
};

export const updateBookingHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBookingApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Booking updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-bookings"] });
    },
    onError: (error) => {
      let message = error.response?.data?.message || "Failed to update booking.";
      if (Array.isArray(message)) message = message[0];
      toast.error(message);
    },
  });
};

export const deleteBookingHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBookingApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Booking deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-bookings"] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete booking.";
      toast.error(message);
    },
  });
};
