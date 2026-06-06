import React, { useState } from 'react';
import { X, ChevronDown, Star } from 'lucide-react';
import { createFeedbackHook } from '../hooks/feedback.hook';
import { getAllStudentsHook } from '../hooks/add.student.hook';
import { getAllLibrariesHook } from '../hooks/library.hook';
import { toast } from 'sonner';

const AddFeedbackModal = ({ isOpen = true, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const { data: studentsResponse } = getAllStudentsHook();
  const students = studentsResponse?.data?.students || studentsResponse?.data || studentsResponse || [];

  const { data: librariesResponse } = getAllLibrariesHook();
  const libraries = librariesResponse?.data || librariesResponse || [];

  const { mutate: submitFeedback, isPending } = createFeedbackHook();

  const handleSubmit = () => {
    if (!selectedUser) return toast.error("Please select a user");
    if (!rating) return toast.error("Please provide a rating");
    if (!feedbackText.trim()) return toast.error("Please provide feedback");
    if (!selectedLibrary) return toast.error("Please select a library");

    submitFeedback({
      userId: selectedUser,
      libraryId: selectedLibrary,
      rating,
      message: feedbackText
    }, {
      onSuccess: () => {
        setRating(0);
        setSelectedUser('');
        setFeedbackText('');
        setSelectedLibrary('');
        onClose();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl font-sans">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Add New Feedback</h2>
            <p className="text-sm text-slate-500 mt-1">Share user experience about the library</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors mt-1"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* User Select */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Select User *
            </label>
            <div className="relative">
              <select 
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-sm transition-all"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">-- Select a User --</option>
                {Array.isArray(students) && students.map((user) => (
                  <option key={user._id || user.id} value={user._id || user.id}>{user.name || user.fullName || user.email}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none stroke-[2.5]" />
            </div>
            <p className="text-xs text-slate-400 mt-2">Select the user who is giving feedback</p>
          </div>
          
          {/* Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-200 fill-slate-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">Click on stars to rate</p>
          </div>
          
          {/* Feedback Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Your Feedback *
            </label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 min-h-[120px] resize-none text-sm transition-all placeholder:text-slate-400"
              placeholder="Share your experience about this library..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
          
          {/* Library */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Library *
            </label>
            <div className="relative">
              <select 
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium text-sm transition-all"
                value={selectedLibrary}
                onChange={(e) => setSelectedLibrary(e.target.value)}
              >
                <option value="">-- Select Library --</option>
                {Array.isArray(libraries) && libraries.map((lib) => (
                  <option key={lib._id || lib.id} value={lib._id || lib.id}>{lib.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none stroke-[2.5]" />
            </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 flex justify-between gap-4 border-t border-slate-100 flex-shrink-0">
          <button 
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-3 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-bold text-sm shadow-md shadow-purple-500/20 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isPending ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddFeedbackModal;
