import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronDown, Loader2 } from 'lucide-react';

const AddFeatureModal = ({ isOpen, onClose, libraries = [], onSubmit, isPending }) => {
  const [featureName, setFeatureName] = useState('');
  const [selectedLibraryId, setSelectedLibraryId] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFeatureName('');
      setSelectedLibraryId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!featureName.trim() || !selectedLibraryId) return;

    onSubmit({
      featureName: featureName,
      libraryId: selectedLibraryId
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm shadow-purple-200 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Add New Feature</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
          {/* Feature Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Feature Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
              placeholder="e.g., WiFi, Parking, Restaurant"
              className="w-full bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 transition-all outline-none"
            />
          </div>

          {/* Select Library */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Select Library <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={selectedLibraryId}
                onChange={(e) => setSelectedLibraryId(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-xl px-4 py-3 pr-10 text-sm text-slate-700 transition-all outline-none cursor-pointer"
              >
                <option value="" disabled>Select a library...</option>
                {libraries.map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    📚 {lib.name} {lib.city ? `- ${lib.city}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 my-6 -mx-6"></div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !featureName.trim() || !selectedLibraryId}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Feature
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeatureModal;
