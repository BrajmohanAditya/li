import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom component to handle map clicks
const LocationPicker = ({ position, setPosition, setValue }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setValue('latitude', parseFloat(lat.toFixed(7)));
      setValue('longitude', parseFloat(lng.toFixed(7)));
    },
  });
  return position === null ? null : <Marker position={position} />;
};

// Component to smoothly pan the map to a new position
const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
};

const EditLibraryModal = ({ isOpen, onClose, onSubmit, library, isPending }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [position, setPosition] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Default map center
  const defaultCenter = [28.6139, 77.2090];

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
        latitude: library.latitude || '',
        longitude: library.longitude || ''
      });
      if (library.latitude && library.longitude) {
        setPosition([library.latitude, library.longitude]);
      } else {
        setPosition(null);
      }
    }
  }, [library, isOpen, reset]);

  if (!isOpen || !library) return null;

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          setValue('latitude', parseFloat(lat.toFixed(7)));
          setValue('longitude', parseFloat(lng.toFixed(7)));
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not access your location. Please check browser permissions.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Library Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Library Name</label>
                <input 
                  {...register("name", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>

              {/* Email */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email"
                  {...register("email", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>

              {/* Phone */}
              <div className="col-span-2">
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
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input 
                  {...register("address", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>

              {/* City */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input 
                  {...register("city", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>

              {/* State */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input 
                  {...register("state", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>

              {/* Zip */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip</label>
                <input 
                  {...register("zip", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>

              {/* Opening Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                <input 
                  type="time"
                  {...register("openingTime", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>
              
              {/* Closing Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                <input 
                  type="time"
                  {...register("closingTime", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>

              {/* Coordinates */}
              <div className="col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Location on Map</label>
                  <button 
                    type="button" 
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    className="mt-2 sm:mt-0 flex items-center justify-center gap-2 text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50"
                  >
                    <Navigation className="w-4 h-4" />
                    {isLocating ? "Locating..." : "Use Current Location"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">Click on the map or use your current location to update Latitude and Longitude.</p>
                <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 mb-4 z-10 relative">
                  {isOpen && (
                    <MapContainer center={position || defaultCenter} zoom={position ? 13 : 4} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationPicker position={position} setPosition={setPosition} setValue={setValue} />
                      <MapUpdater position={position} />
                    </MapContainer>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input 
                      type="number"
                      step="any"
                      {...register("latitude", { required: true, valueAsNumber: true })} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none" 
                      placeholder="40.7128"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input 
                      type="number"
                      step="any"
                      {...register("longitude", { required: true, valueAsNumber: true })} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none" 
                      placeholder="-74.0060"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input 
                  type="url"
                  {...register("website", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
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
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditLibraryModal;
