import React, { useState } from 'react';
import { Package, Plus, Search, Filter, ChevronDown, Trash2, Edit2 } from 'lucide-react';
import CreatePlanModal from '../../components/plan';
import { getAllLibrariesHook } from '../../hooks/library.hook';
import { getPlansHook, deletePlanHook } from '../../hooks/plan.hook';

const SubscriptionPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: librariesData } = getAllLibrariesHook();
  const libraries = librariesData?.data || [];

  const { data: plansData, isLoading: isLoadingPlans } = getPlansHook(selectedLibrary);
  console.log("Plans Data API Response:", plansData);
  const plans = Array.isArray(plansData) ? plansData : (Array.isArray(plansData?.data) ? plansData.data : []);
  const { mutate: deletePlan } = deletePlanHook();

  const filteredPlans = plans.filter(plan => 
    plan.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.libraryId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-xl shadow-sm flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Subscription Plans</h1>
            <p className="text-slate-500 text-sm mt-1">Create and manage library subscription plans with time slots</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Plan
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Search className="w-3.5 h-3.5" /> Search Plans
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors outline-none"
                placeholder="Search by plan name or library..."
              />
            </div>
          </div>

          {/* Plan Type */}
          <div className="w-full md:w-48">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Filter className="w-3.5 h-3.5" /> Plan Type
            </label>
            <div className="relative">
              <select className="appearance-none block w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-colors outline-none cursor-pointer">
                <option>All Types</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Slot Type */}
          <div className="w-full md:w-48">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Filter className="w-3.5 h-3.5" /> Slot Type
            </label>
            <div className="relative">
              <select className="appearance-none block w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-colors outline-none cursor-pointer">
                <option>All Slots</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Library */}
          <div className="w-full md:w-48">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Filter className="w-3.5 h-3.5" /> Library
            </label>
            <div className="relative">
              <select 
                value={selectedLibrary}
                onChange={(e) => setSelectedLibrary(e.target.value)}
                className="appearance-none block w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-colors outline-none cursor-pointer"
              >
                <option value="">All Libraries</option>
                {libraries.map(lib => (
                  <option key={lib.id} value={lib.id}>{lib.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">S.No</th>
                <th className="px-6 py-4 font-bold">Plan Name</th>
                <th className="px-6 py-4 font-bold">Library</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Slot</th>
                <th className="px-6 py-4 font-bold">Time</th>
                <th className="px-6 py-4 font-bold">Duration</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingPlans ? (
                <tr>
                  <td colSpan="9">
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                      <h3 className="text-lg font-semibold text-slate-700 mb-1">Loading plans...</h3>
                    </div>
                  </td>
                </tr>
              ) : filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan="9">
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                      <div className="mb-4 text-slate-300">
                        <Package className="w-16 h-16" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-1">No plans found</h3>
                      <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan, index) => (
                  <tr key={plan.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{plan.planName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{plan.libraryId?.name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{plan.type?.toLowerCase()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{plan.timeSlot || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {plan.startTime} - {plan.endTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{plan.durationValue} {plan.type?.toLowerCase()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{plan.price}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this plan?")) {
                              deletePlan(plan.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreatePlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SubscriptionPlans;
