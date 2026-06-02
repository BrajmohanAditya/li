import React, { useState } from 'react';
import { Calendar, CheckCircle, CreditCard, BookOpen, Book, ChevronDown, Loader2 } from 'lucide-react';
import { getAllLibrariesHook } from '../../hooks/library.hook';

const SeatManagement = () => {
  const [selectedLibrary, setSelectedLibrary] = useState('');
  
  // Fetch libraries from the database
  const { data: librariesData, isLoading, isError } = getAllLibrariesHook();
  const libraries = librariesData?.data || [];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Booking Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor and manage all seat bookings across libraries.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Bookings</p>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>
          <div className="p-3 bg-indigo-500 rounded-xl shadow-sm">
            <Calendar className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Active Bookings</p>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>
          <div className="p-3 bg-emerald-500 rounded-xl shadow-sm">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-800">₹0.00</p>
          </div>
          <div className="p-3 bg-amber-500 rounded-xl shadow-sm">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Sheets Booked */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sheets Booked</p>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>
          <div className="p-3 bg-blue-600 rounded-xl shadow-sm">
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
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            </div>
          ) : isError ? (
            <div className="w-full py-3 px-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              Failed to load libraries. Please check your connection.
            </div>
          ) : (
            <>
              <select
                value={selectedLibrary}
                onChange={(e) => setSelectedLibrary(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
              >
                <option value="" disabled>Choose a library...</option>
                {libraries.map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    {lib.name} - {lib.city}{lib.state ? `, ${lib.state}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatManagement;
