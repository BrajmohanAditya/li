import React, { useState } from 'react';
import { Plus, Search, LayoutGrid, List, Loader2, ChevronDown, CheckCircle2, Layers, XCircle } from 'lucide-react';
import { getAllLibrariesHook } from '../../hooks/library.hook';
import { getSheetByIdHook, createSheetHook, deleteSheetHook, updateSheetHook } from '../../hooks/seat.create.hook';
import CreateSheetModal from '../../components/CreateSheetModal';
import EditSheetModal from '../../components/EditSheetModal';

const CreateSeatPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sheetSearchTerm, setSheetSearchTerm] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSheet, setEditingSheet] = useState(null);

  const { mutate: createSheet, isPending: isCreating } = createSheetHook();
  const { mutate: deleteSheet } = deleteSheetHook();
  const { mutate: updateSheet, isPending: isUpdating } = updateSheetHook();
  const { data: sheetsData, isLoading: isLoadingSheets } = getSheetByIdHook(selectedLibrary);
  const allSheets = Array.isArray(sheetsData) ? sheetsData : (sheetsData?.sheets || []);

  const handleCreateSubmit = (data, resetForm) => {
    createSheet(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        resetForm();
      }
    });
  };

  const handleEditSubmit = (payload) => {
    updateSheet(payload, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setEditingSheet(null);
      }
    });
  };

  const { data: librariesData, isLoading: isLoadingLibraries } = getAllLibrariesHook();
  const libraries = librariesData?.data || [];
  
  const selectedLibraryObj = libraries.find(lib => lib.id === selectedLibrary);

  // Filter sheets for the sheet search term (API already filters by library)
  const filteredSheets = allSheets.filter(sheet => {
    if (sheetSearchTerm) {
      return sheet.sheetNumber?.toLowerCase().includes(sheetSearchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sheets Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage individual sheets across different library spaces.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Sheet
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-indigo-50/50 rounded-2xl shadow-sm border border-indigo-50 p-6">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
          <Search className="w-4 h-4 text-slate-500" />
          Search Sheet by ID or Number
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter Sheet ID (e.g., bc3a7750-97cb-473a-a243-91fcb3492a40)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm whitespace-nowrap">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {/* Select Library Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <label className="block text-sm font-bold text-slate-700 mb-3">
          Select Library
        </label>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            {isLoadingLibraries ? (
              <div className="w-full flex items-center justify-center py-3 bg-slate-50 border border-gray-200 rounded-xl">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              </div>
            ) : (
              <>
                <select
                  value={selectedLibrary}
                  onChange={(e) => setSelectedLibrary(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all shadow-sm"
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
          
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                viewMode === 'grid' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'bg-slate-50 text-slate-400 border border-transparent hover:bg-slate-100 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                viewMode === 'list' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                  : 'bg-slate-50 text-slate-400 border border-transparent hover:bg-slate-100 hover:text-slate-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Sheets Display Section */}
      {selectedLibrary && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Sheets in {selectedLibraryObj?.name || 'Library'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Total Sheets: {filteredSheets.length}
              </p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sheets..."
                value={sheetSearchTerm}
                onChange={(e) => setSheetSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 text-slate-700 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {isLoadingSheets ? (
             <div className="flex justify-center items-center py-12">
               <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
             </div>
          ) : filteredSheets.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
              {filteredSheets.map(sheet => (
                <div key={sheet.id} className={`group bg-white hover:bg-slate-500 p-4 border-2 ${sheet.isAvailable ? 'border-emerald-300' : 'border-red-300'} rounded-2xl flex flex-col items-center justify-center relative shadow-sm transition-colors overflow-hidden cursor-pointer`}>
                  {/* Status Icon */}
                  <div className={`absolute top-2 right-2 ${sheet.isAvailable ? 'text-emerald-500' : 'text-red-500'} group-hover:text-slate-700 transition-colors`}>
                    {sheet.isAvailable ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  
                  {/* Main Icon */}
                  <div className={`w-12 h-12 ${sheet.isAvailable ? 'bg-emerald-500 group-hover:bg-emerald-800' : 'bg-red-500 group-hover:bg-red-800'} rounded-xl flex items-center justify-center mb-3 text-white shadow-sm transition-colors`}>
                    <Layers className="w-6 h-6" />
                  </div>
                  
                  {/* Sheet Number */}
                  <h3 className="font-bold text-slate-800 group-hover:text-slate-900 text-lg transition-colors">{sheet.sheetNumber}</h3>
                  
                  {/* Availability */}
                  <p className={`text-xs font-semibold ${sheet.isAvailable ? 'text-emerald-500 group-hover:text-emerald-800' : 'text-red-500 group-hover:text-red-800'} mt-0.5 transition-colors`}>
                    {sheet.isAvailable ? 'Free' : 'Booked'}
                  </p>

                  {/* Hover Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSheet(sheet);
                        setIsEditModalOpen(true);
                      }}
                      className="bg-white text-indigo-600 font-medium text-xs px-3 py-1.5 rounded shadow-sm hover:bg-indigo-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete sheet ${sheet.sheetNumber}?`)) {
                          deleteSheet(sheet.id);
                        }
                      }}
                      className="bg-white text-red-500 font-medium text-xs px-3 py-1.5 rounded shadow-sm hover:bg-red-50 transition-colors"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No sheets found in this library. Click "Create Sheet" to add some!
            </div>
          )}
        </div>
      )}

      <CreateSheetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isPending={isCreating}
      />

      <EditSheetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        isPending={isUpdating}
        sheet={editingSheet}
      />
    </div>
  );
};

export default CreateSeatPage;
