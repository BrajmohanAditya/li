import React, { useState } from "react";
import {
  Calendar,
  CheckCircle,
  CreditCard,
  BookOpen,
  Book,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { getAllLibrariesHook } from "../../hooks/library.hook";
import { getAllStudentsHook } from "../../hooks/add.student.hook.js";
import { getSheetByIdHook } from "../../hooks/seat.create.hook";
import { createBookingHook, getAllBookingsHook } from "../../hooks/book.seat.hook";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const SeatManagement = () => {
  const [selectedLibrary, setSelectedLibrary] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSheet, setSelectedSheet] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  // Fetch libraries from the database
  const { data: librariesData, isLoading, isError } = getAllLibrariesHook();
  const libraries = librariesData?.data || [];

  // Fetch students
  const { data: studentsData } = getAllStudentsHook();
  const students = studentsData?.data || [];

  // Fetch sheets
  const { data: sheetsData } = getSheetByIdHook(selectedLibrary);
  const allSheets = Array.isArray(sheetsData)
    ? sheetsData
    : sheetsData?.sheets || [];
  const librarySheets = allSheets.filter((s) => s.isAvailable);

  // Fetch plans dynamically
  const { data: plansData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["get-plans", selectedLibrary],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${baseUrl}/library-price/library/${selectedLibrary}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      return res.data;
    },
    enabled: !!selectedLibrary,
  });
  const plans = Array.isArray(plansData) ? plansData : plansData?.data || [];

  const { mutate: createBooking, isPending: isBooking } = createBookingHook();

  // Fetch all bookings for stats
  const { data: bookingsData } = getAllBookingsHook();
  const allBookings = bookingsData?.data || bookingsData || [];
  const bookingsList = Array.isArray(allBookings) ? allBookings : [];

  // Compute stats
  const totalBookings = bookingsList.length;
  const activeBookings = bookingsList.filter(b => b.status === 'ACTIVE' || b.status === 'active' || b.isActive).length;
  const totalRevenue = bookingsList.reduce((sum, b) => sum + (Number(b.amount || b.price || b.totalAmount || 0)), 0);
  const sheetsBooked = bookingsList.filter(b => b.sheetId || b.sheet).length;

  const handleBookSeat = (e) => {
    e.preventDefault();
    if (
      !selectedStudent ||
      !selectedLibrary ||
      !selectedSheet ||
      !selectedPlan
    ) {
      return;
    }

    createBooking(
      {
        userId: selectedStudent,
        libraryId: selectedLibrary,
        sheetId: selectedSheet,
        planId: selectedPlan,
      },
      {
        onSuccess: () => {
          setSelectedStudent("");
          setSelectedSheet("");
          setSelectedPlan("");
        },
      },
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Booking Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor and manage all seat bookings across libraries.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Total Bookings
            </p>
            <p className="text-3xl font-bold text-slate-800">{totalBookings}</p>
          </div>
          <div className="p-3 bg-brand-500 rounded-xl shadow-sm">
            <Calendar className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Active Bookings
            </p>
            <p className="text-3xl font-bold text-slate-800">{activeBookings}</p>
          </div>
          <div className="p-3 bg-emerald-500 rounded-xl shadow-sm">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-slate-800">₹{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-amber-500 rounded-xl shadow-sm">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Sheets Booked */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Sheets Booked
            </p>
            <p className="text-3xl font-bold text-slate-800">{sheetsBooked}</p>
          </div>
          <div className="p-3 bg-brand-600 rounded-xl shadow-sm">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Select Library Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-800">Select Library</h2>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="w-full flex items-center justify-center py-3 bg-slate-50 border border-gray-200 rounded-xl">
              <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
            </div>
          ) : isError ? (
            <div className="w-full py-3 px-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              Failed to load libraries. Please check your connection.
            </div>
          ) : (
            <>
              <select
                value={selectedLibrary}
                onChange={(e) => {
                  setSelectedLibrary(e.target.value);
                  setSelectedSheet("");
                  setSelectedPlan("");
                }}
                className="w-full appearance-none bg-slate-50 border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer transition-all"
              >
                <option value="" disabled>
                  Choose a library...
                </option>
                {libraries.map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    {lib.name} - {lib.city}
                    {lib.state ? `, ${lib.state}` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </>
          )}
        </div>
      </div>

      {/* Booking Form Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-brand-600" /> Book a Seat
        </h2>
        <form
          onSubmit={handleBookSeat}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Select Student */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Select Student
            </label>
            <div className="relative">
              <select
                required
                disabled={!selectedLibrary}
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                <option value="" disabled>
                  {!selectedLibrary
                    ? "Select a library first"
                    : "Choose a student..."}
                </option>
                {students.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Select Plan */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Select Plan
            </label>
            <div className="relative">
              <select
                required
                disabled={!selectedLibrary || isLoadingPlans}
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                <option value="" disabled>
                  {!selectedLibrary
                    ? "Select a library first"
                    : isLoadingPlans
                      ? "Loading plans..."
                      : "Choose a plan..."}
                </option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name || plan.planType} - ₹{plan.price}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Select Seat */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Select Seat
            </label>
            <div className="relative">
              <select
                required
                disabled={!selectedLibrary}
                value={selectedSheet}
                onChange={(e) => setSelectedSheet(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                <option value="" disabled>
                  {!selectedLibrary
                    ? "Select a library first"
                    : "Choose an available seat..."}
                </option>
                {librarySheets.map((sheet) => (
                  <option key={sheet.id} value={sheet.id}>
                    {sheet.sheetNumber}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-3 flex justify-end mt-4">
            <button
              type="submit"
              disabled={isBooking || !selectedLibrary}
              className="bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 shadow-[0_4px_14px_0_rgba(244,63,94,0.39)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.23)] hover:-translate-y-0.5 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isBooking && <Loader2 className="w-5 h-5 animate-spin" />}
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeatManagement;
