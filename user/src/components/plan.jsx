import React from 'react';
import { X, Clock, ChevronDown, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { getAllLibrariesHook } from '../hooks/library.hook';
import { createPlanHook } from '../hooks/plan.hook';

const CreatePlanModal = ({ isOpen, onClose }) => {
  const { data: librariesData, isLoading: isLoadingLibraries } = getAllLibrariesHook();
  const libraries = librariesData?.data || [];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      planType: "MONTH",
      duration: 1
    }
  });
  const { mutate: createPlan, isPending } = createPlanHook();

  const onSubmit = (data) => {
    const payload = {
      libraryId: data.libraryId,
      planName: data.name,
      type: data.planType || "MONTH",
      duration: data.duration ? data.duration.toString() : "1",
      durationValue: data.duration || 1,
      startTime: data.startTime,
      endTime: data.endTime,
      price: data.price
    };

    createPlan(payload, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Create New Plan</h2>
            <p className="text-sm text-slate-500 mt-1">Define subscription plan details</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="create-plan-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Library */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Library <span className="text-blue-500">*</span>
              </label>
              <div className="relative">
                <select 
                  {...register("libraryId", { required: true })}
                  defaultValue="" 
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    {isLoadingLibraries ? 'Loading libraries...' : 'Choose a library'}
                  </option>
                  {libraries.map((lib) => (
                    <option key={lib.id} value={lib.id}>
                      {lib.name} {lib.city ? `- ${lib.city}` : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Plan Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Plan Name <span className="text-blue-500">*</span>
              </label>
              <input 
                type="text" 
                {...register("name", { required: true })}
                placeholder="e.g., Basic Monthly, Premium Yearly"
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Plan Type & Duration */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Plan Type <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    {...register("planType", { required: true })}
                    defaultValue="MONTH" 
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all cursor-pointer"
                  >
                    <option value="HOURS">Hour(s)</option>
                    <option value="DAYS">Day(s)</option>
                    <option value="MONTH">Month(s)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Duration Value <span className="text-blue-500">*</span>
                </label>
                <input 
                  type="number" 
                  {...register("duration", { required: true, valueAsNumber: true })}
                  defaultValue={1}
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Time Slot <span className="text-blue-500">*</span>
              </label>
              <input 
                type="text" 
                {...register("timeSlot", { required: true })}
                placeholder="e.g., Morning (6:00 AM - 12:00 PM)"
                className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Start & End Time */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Start Time <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="time" 
                    {...register("startTime", { required: true })}
                    defaultValue="09:00"
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all"
                    style={{ colorScheme: "light" }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  End Time <span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="time" 
                    {...register("endTime", { required: true })}
                    defaultValue="17:00"
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all"
                    style={{ colorScheme: "light" }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Price (₹) <span className="text-blue-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-medium">$</span>
                </div>
                <input 
                  type="number" 
                  {...register("price", { required: true, valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:font-normal"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center gap-4 bg-white shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="create-plan-form"
            disabled={isPending}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            Create Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanModal;
