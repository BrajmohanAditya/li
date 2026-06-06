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

const CreateLibraryModal = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [position, setPosition] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Default map center (New Delhi, India)
  const defaultCenter = [28.6139, 77.2090];

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    // Convert FileList to a plain Array BEFORE calling reset().
    // FileList is a live DOM reference — reset() clears the file input,
    // which empties the FileList before the async API call can read it.
    const formData = {
      ...data,
      image: data.image ? Array.from(data.image) : [],
    };
    onSubmit(formData);
    reset();
    setPosition(null);
    onClose();
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Add New Library</h2>
            <p className="text-sm text-gray-500 mt-1">Enter the details of the new library space.</p>
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
          <form id="library-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Library Name</label>
                <input 
                  {...register("name", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                  placeholder="e.g. Central City Library"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email"
                  {...register("email", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                  placeholder="contact@library.com"
                />
              </div>

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
                  placeholder="1234567890"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message || "Invalid phone number"}</p>}
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input 
                  {...register("address", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                  placeholder="123 Main St"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input 
                  {...register("city", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                  placeholder="New York"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input 
                  {...register("state", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                  placeholder="NY"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip</label>
                <input 
                  {...register("zip", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                  placeholder="10001"
                />
              </div>

              {/* Times */}
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
                <p className="text-xs text-gray-500 mb-3">Click on the map or use your current location to set Latitude and Longitude.</p>
                <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 mb-4 z-10 relative">
                  {isOpen && (
                    <MapContainer center={defaultCenter} zoom={4} style={{ height: '100%', width: '100%' }}>
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
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input 
                  type="url"
                  {...register("website", { required: true })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" 
                  placeholder="https://example.com"
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
                      message: "Description must be at least 10 characters long"
                    }
                  })} 
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none" 
                  placeholder="A brief description of the library (at least 10 chars)..."
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Library Images</label>
                <input 
                  type="file"
                  multiple
                  accept="image/*"
                  {...register("image", { required: "Please select at least one image" })} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" 
                />
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
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
            form="library-form"
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            Create Library
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateLibraryModal;
