import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

const EditLibraryModal = ({ isOpen, onClose, onSubmit, library, isPending }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Pre-fill form when library data changes
  useEffect(() => {
    if (library && isOpen) {
      reset({
        name: library.name || '',
        email: library.email || '',
        phone: library.phone || '',
        address: library.address || '',
        city: library.city || '',
        state: library.state || '',
        zip: library.zip || '',
        openingTime: library.openingTime || '',
        closingTime: library.closingTime || '',
        website: library.website || '',
        description: library.description || '',
      });
    }
  }, [library, isOpen, reset]);

  if (!isOpen || !library) return null;

  const handleFormSubmit = (data) => {
    onSubmit({ id: library.id, data });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Library</h2>
            <p className="text-sm text-gray-500 mt-1">Update the details of <span className="font-medium text-gray-700">{library.name}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
          <form id="edit-library-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            
            {/* Existing Images Preview */}
            {library.images && library.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Images (Read Only)</label>
                <div className="flex gap-3 overflow-x-auto pb-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  {library.images.map((img, index) => (
                    <a key={index} href={img} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <img 
                        src={img} 
                        alt={`${library.name} - ${index + 1}`}
                        className="h-24 w-36 rounded-lg object-cover border border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="144" height="96" fill="none"><rect width="144" height="96" rx="8" fill="%23f1f5f9"/><text x="72" y="45" text-anchor="middle" fill="%2394a3b8" font-size="11" font-family="sans-serif">Image not</text><text x="72" y="60" text-anchor="middle" fill="%2394a3b8" font-size="11" font-family="sans-serif">accessible</text></svg>')}`;
                        }}
                      />
                    </a>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">To change images, you currently need to recreate the library. Edit functionality for images is not supported by the backend yet.</p>
              </div>
            )}
            
            {/* Library Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Library Name</label>
              <input 
                {...register("name", { required: true })} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email"
                {...register("email", { required: true })} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input 
                type="text"
                {...register("phone", { 
                  required: true,
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone must be exactly 10 digits"
                  }
                })} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message || "Invalid phone"}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input 
                {...register("address", { required: true })} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input 
                {...register("city", { required: true })} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input 
                {...register("state", { required: true })} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
              />
            </div>

            {/* Zip */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zip</label>
              <input 
                {...register("zip", { required: true })} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
              />
            </div>

            {/* Opening & Closing Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                <input 
                  type="time"
                  {...register("openingTime", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                <input 
                  type="time"
                  {...register("closingTime", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input 
                type="url"
                {...register("website", { required: true })} 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                {...register("description", { 
                  required: true,
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters"
                  }
                })} 
                rows="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none" 
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="edit-library-form"
            disabled={isPending}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditLibraryModal;
