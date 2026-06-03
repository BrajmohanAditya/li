import React, { useState } from 'react';
import { Book, ChevronDown, Search, Star, Trash2, Edit, Loader2, Sparkles, Plus } from 'lucide-react';
import { getAllLibrariesHook } from '../../hooks/library.hook';
import { getFeaturesByLibraryIdHook, deleteFeatureHook, createFeatureHook } from '../../hooks/feature.hook';
import AddFeatureModal from '../../components/AddFeatureModal';

const FeaturesManagement = () => {
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch libraries
  const { data: librariesData, isLoading: isLoadingLibraries, isError: isLibrariesError } = getAllLibrariesHook();
  const libraries = librariesData?.data || [];

  // Fetch features for selected library
  const { data: featuresData, isLoading: isLoadingFeatures } = getFeaturesByLibraryIdHook(selectedLibrary);
  // Assuming the API returns an array or an object containing features
  const features = Array.isArray(featuresData) ? featuresData : (featuresData?.data || []);

  const { mutate: deleteFeature, isPending: isDeleting } = deleteFeatureHook();
  const { mutate: createFeature, isPending: isAdding } = createFeatureHook();

  const handleAddSubmit = (data) => {
    createFeature(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      }
    });
  };

  const selectedLibraryObj = libraries.find(lib => lib.id === selectedLibrary);
  const libraryName = selectedLibraryObj?.name || 'Selected Library';

  // Filter features based on search term
  const filteredFeatures = features.filter((feature) => {
    const term = searchTerm.toLowerCase();
    const featureNameValue = feature.featureName || feature.name || feature.feature || '';
    return featureNameValue.toLowerCase().includes(term);
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the feature "${name}"?`)) {
      deleteFeature(id);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner Section */}
      <div className="bg-gradient-to-r from-[#1A1C2E] to-[#3B3A6F] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">Premium Features</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Features Management</h1>
          <p className="text-sm text-gray-300/80">
            Manage amenities and premium features across different library spaces
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-medium transition-all backdrop-blur-sm border border-white/5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Feature
        </button>
      </div>

      {/* Select Library Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Book className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Select Library</h2>
        </div>
        
        <div className="relative">
          {isLoadingLibraries ? (
            <div className="w-full flex items-center justify-center py-3 bg-slate-50 border border-gray-200 rounded-xl">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            </div>
          ) : isLibrariesError ? (
            <div className="w-full py-3 px-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              Failed to load libraries. Please check your connection.
            </div>
          ) : (
            <>
              <select
                value={selectedLibrary}
                onChange={(e) => {
                  setSelectedLibrary(e.target.value);
                  setSearchTerm('');
                }}
                className="w-full appearance-none bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all shadow-sm"
              >
                <option value="" disabled>Choose a library...</option>
                {libraries.map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    📚 {lib.name} {lib.city ? `- ${lib.city}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </>
          )}
        </div>
      </div>

      {/* Features List Section */}
      {selectedLibrary && (
        <div className="space-y-4">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500" />
                Features in {libraryName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Total Features: {features.length}
              </p>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-xl text-sm transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
            {isLoadingFeatures ? (
               <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                 <Loader2 className="w-10 h-10 animate-spin mb-3 text-indigo-500" />
                 <p className="text-sm font-medium">Loading features...</p>
               </div>
            ) : filteredFeatures.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                 <Star className="w-12 h-12 mb-3 opacity-30" />
                 <p className="text-sm font-medium">No features found for this library</p>
               </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">S.No</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Feature</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Library ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Library Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Feature ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeatures.map((feature, index) => (
                      <tr key={feature.id || index} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200 shrink-0">
                              <Star className="w-5 h-5 fill-current" />
                            </div>
                            <span className="font-bold text-slate-800 capitalize">{feature.featureName || feature.name || feature.feature}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md">
                            {feature.libraryId ? `${feature.libraryId.substring(0, 8)}...` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 capitalize">{libraryName}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md">
                            {feature.id ? `${feature.id.substring(0, 8)}...` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {feature.createdAt ? new Date(feature.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                              title="Edit Feature"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(feature.id, feature.featureName || feature.name || feature.feature)}
                              disabled={isDeleting}
                              className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete Feature"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Feature Modal */}
      <AddFeatureModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        libraries={libraries}
        onSubmit={handleAddSubmit}
        isPending={isAdding}
      />
    </div>
  );
};

export default FeaturesManagement;
