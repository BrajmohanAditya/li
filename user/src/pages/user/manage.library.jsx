import React, { useState } from 'react';
import { BookOpen, Plus, Search, Filter, ChevronDown } from 'lucide-react';
import CreateLibraryModal from '../../components/CreateLibraryModal';
import { createLibraryHook } from '../../hooks/library.hook';

const ManageLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: createLibrary, isPending } = createLibraryHook();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
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
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
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
            <select className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer">
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
      
      {/* Future List/Table will go here */}
      <div className="mt-8">
        {/* Empty state or table placeholder */}
      </div>

      <CreateLibraryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => {
          createLibrary(data, {
            onSuccess: () => {
              setIsModalOpen(false); // Close the modal upon successful creation
            }
          });
        }}
      />
    </div>
  );
};

export default ManageLibrary;
