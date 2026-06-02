import React, { useState } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';
import { getAllLibrariesHook } from '../hooks/library.hook';

const CreateSheetModal = ({ isOpen, onClose, onSubmit, isPending }) => {
  const [formData, setFormData] = useState({
    name: '',
    sheetCount: '',
    libraryId: ''
  });

  const { data: librariesData, isLoading: isLoadingLibraries } = getAllLibrariesHook();
  const libraries = librariesData?.data || [];

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      sheetCount: Number(formData.sheetCount) // Convert to number for backend DTO
    }, () => {
      setFormData({ name: '', sheetCount: '', libraryId: '' });
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-slate-800">Create New Sheet Collection</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Collection Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Collection Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter collection name (e.g., Row A, Section 1)"
                className="w-full bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Number of Sheets */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Number of Sheets <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="sheetCount"
                min="1"
                required
                value={formData.sheetCount}
                onChange={handleChange}
                placeholder="Enter number of sheets (e.g., 5, 10, 20)"
                className="w-full bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <p className="text-xs text-gray-400 mt-2">
                This will create individual sheets (a1, a2, a3...)
              </p>
            </div>

            {/* Select Library */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Select Library <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {isLoadingLibraries ? (
                  <div className="w-full flex items-center justify-center py-3 bg-slate-50 border border-gray-200 rounded-xl">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                  </div>
                ) : (
                  <>
                    <select
                      name="libraryId"
                      required
                      value={formData.libraryId}
                      onChange={handleChange}
                      className="w-full appearance-none bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
                    >
                      <option value="" disabled>Select a library...</option>
                      {libraries.map((lib) => (
                        <option key={lib.id} value={lib.id}>
                          {lib.name} - {lib.city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Sheets"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSheetModal;
