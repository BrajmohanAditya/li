import React from 'react';
import { X, MapPin, Phone, Mail, Clock, Globe, FileText, Compass } from 'lucide-react';

const ViewLibraryModal = ({ isOpen, onClose, library }) => {
  if (!isOpen || !library) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg">
              {library.name?.charAt(0)?.toUpperCase() || 'L'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{library.name}</h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {library.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* Images */}
          {library.images && library.images.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Images</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {library.images.map((img, index) => (
                  <a key={index} href={img} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <img 
                      src={img} 
                      alt={`${library.name} - ${index + 1}`}
                      className="h-32 w-48 rounded-xl object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="192" height="128" fill="none"><rect width="192" height="128" rx="12" fill="%23f1f5f9"/><text x="96" y="60" text-anchor="middle" fill="%2394a3b8" font-size="13" font-family="sans-serif">Image not</text><text x="96" y="80" text-anchor="middle" fill="%2394a3b8" font-size="13" font-family="sans-serif">accessible</text></svg>')}`;
                      }}
                    />
                  </a>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">💡 Click an image to open the S3 URL in a new tab</p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Address */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl col-span-2">
              <MapPin className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</p>
                <p className="text-sm text-gray-800">{library.address}</p>
                <p className="text-sm text-gray-600">{library.city}, {library.state} {library.zip}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm text-gray-800">{library.phone}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-gray-800 break-all">{library.email}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Hours</p>
                <p className="text-sm text-gray-800">{library.openingTime} - {library.closingTime}</p>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Globe className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Website</p>
                <a 
                  href={library.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-brand-600 hover:underline break-all"
                >
                  {library.website}
                </a>
              </div>
            </div>

            {/* Coordinates */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl col-span-2">
              <Compass className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Coordinates</p>
                <p className="text-sm text-gray-800">
                  Lat: {library.latitude} &nbsp;|&nbsp; Lng: {library.longitude}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl col-span-2">
              <FileText className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{library.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLibraryModal;
