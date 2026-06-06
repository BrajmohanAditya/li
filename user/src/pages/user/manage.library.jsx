import React, { useState } from 'react';
import { BookOpen, Plus, Search, Filter, ChevronDown, Eye, Pencil, Trash2, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import CreateLibraryModal from '../../components/CreateLibraryModal';
import ViewLibraryModal from '../../components/ViewLibraryModal';
import EditLibraryModal from '../../components/EditLibraryModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { createLibraryHook, getAllLibrariesHook, getAllLibrariesInDetailsHook, updateLibraryHook, deleteLibraryHook } from '../../hooks/library.hook';

const ManageLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // View & Edit & Delete modal state
  const [viewLibrary, setViewLibrary] = useState(null);
  const [editLibrary, setEditLibrary] = useState(null);
  const [deleteModalData, setDeleteModalData] = useState({ isOpen: false, id: null, name: '' });

  const { mutate: createLibrary, isPending: isCreating } = createLibraryHook();
  const { mutate: updateLibrary, isPending: isUpdating } = updateLibraryHook();
  const { mutate: deleteLibrary, isPending: isDeleting } = deleteLibraryHook();
  const { data: librariesInDetailsData, isLoading: isLoadingInDetails, isError: isErrorInDetails } = getAllLibrariesInDetailsHook();

  const libraries = librariesInDetailsData?.data?.data || librariesInDetailsData?.data || [];
  const isLoading = isLoadingInDetails;
  const isError = isErrorInDetails;

  // Filter libraries based on search term
  const filteredLibraries = libraries.filter((lib) => {
    const matchesSearch =
      lib.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lib.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lib.city?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = (id, name) => {
    setDeleteModalData({ isOpen: true, id, name });
  };

  const confirmDelete = () => {
    if (deleteModalData.id) {
      deleteLibrary(deleteModalData.id, {
        onSuccess: () => {
          setDeleteModalData({ isOpen: false, id: null, name: '' });
        }
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Libraries Network</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor all registered library spaces across your network
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Library
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4" />
          <input
            type="text"
            placeholder="Search by name, address, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/20">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Libraries Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <p className="text-sm font-medium">Loading libraries...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <p className="text-sm font-medium">Failed to load libraries. Please check your connection.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredLibraries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <BookOpen className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No libraries found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm ? "Try a different search term" : "Click 'Add New Library' to get started"}
            </p>
          </div>
        )}

        {/* Table - Desktop & Mobile */}
        {!isLoading && !isError && filteredLibraries.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Library</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLibraries.map((lib) => (
                    <tr key={lib.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      {/* Library Name + ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-brand-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {lib.name?.charAt(0)?.toUpperCase() || 'L'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{lib.name}</p>
                            <p className="text-xs text-gray-400 font-mono">ID: {lib.id?.slice(0, 7)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1.5 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <div>
                            <p>{lib.city}</p>
                            <p className="text-xs text-gray-400">ZIP: {lib.zip}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{lib.phone}</span>
                          </div>
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">{lib.email}</p>
                        </div>
                      </td>

                      {/* Hours */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{lib.openingTime} - {lib.closingTime}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                          ACTIVE
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setViewLibrary(lib)}
                            className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditLibrary(lib)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(lib.id, lib.name)}
                            disabled={isDeleting}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredLibraries.map((lib) => (
                <div key={lib.id} className="p-4 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-brand-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {lib.name?.charAt(0)?.toUpperCase() || 'L'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{lib.name}</p>
                        <p className="text-xs text-gray-400 font-mono">ID: {lib.id?.slice(0, 7)}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                      ACTIVE
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{lib.city}, {lib.zip}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{lib.openingTime} - {lib.closingTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 col-span-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{lib.phone}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button 
                      onClick={() => setViewLibrary(lib)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button 
                      onClick={() => setEditLibrary(lib)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(lib.id, lib.name)}
                      disabled={isDeleting}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{filteredLibraries.length}</span> of <span className="font-semibold text-gray-700">{libraries.length}</span> libraries
              </p>
            </div>
          </>
        )}
      </div>

      {/* Create Library Modal */}
      <CreateLibraryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => {
          createLibrary(data, {
            onSuccess: () => {
              setIsModalOpen(false);
            }
          });
        }}
      />

      {/* View Library Modal */}
      <ViewLibraryModal 
        isOpen={!!viewLibrary} 
        onClose={() => setViewLibrary(null)} 
        library={viewLibrary}
      />

      {/* Edit Library Modal */}
      <EditLibraryModal 
        isOpen={!!editLibrary} 
        onClose={() => setEditLibrary(null)} 
        library={editLibrary}
        isPending={isUpdating}
        onSubmit={(payload) => {
          updateLibrary(payload, {
            onSuccess: () => {
              setEditLibrary(null);
            }
          });
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalData.isOpen}
        onClose={() => setDeleteModalData({ isOpen: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        title="Delete Library"
        message="Are you sure you want to delete this library? All associated sheets, plans, and bookings might be affected. This action cannot be undone."
        itemName={deleteModalData.name}
        isPending={isDeleting}
      />
    </div>
  );
};

export default ManageLibrary;
