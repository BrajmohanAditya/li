import React, { useState } from 'react';
import { Settings, Plus, X, Key, MessageSquare, Library as LibraryIcon, Loader2, Trash2, Pencil } from 'lucide-react';
import SettingComponent from '../../components/setting';
import { getAllSettingsHook, deleteSettingHook } from '../../hooks/setting.hook';
import { getAllLibrariesHook } from '../../hooks/library.hook';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const SettingsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    settingId: null,
    libraryName: ''
  });

  // Fetch settings and libraries to display
  const { data: settingsResponse, isLoading: isSettingsLoading } = getAllSettingsHook();
  const { data: librariesResponse, isLoading: isLibrariesLoading } = getAllLibrariesHook();
  const { mutate: deleteSetting, isPending: isDeleting } = deleteSettingHook();

  const settings = Array.isArray(settingsResponse?.data) ? settingsResponse.data : (settingsResponse?.data ? [settingsResponse.data] : []);
  const libraries = librariesResponse?.data || [];

  const getLibraryName = (libraryId) => {
    const lib = libraries.find((l) => l.id === libraryId);
    return lib ? lib.name : 'Unknown Library';
  };

  const handleEditClick = (setting) => {
    setEditingSetting(setting);
    setShowForm(true);
  };

  const handleDeleteClick = (setting) => {
    setDeleteModalState({
      isOpen: true,
      settingId: setting.id,
      libraryName: getLibraryName(setting.libraryId)
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.settingId) {
      deleteSetting(deleteModalState.settingId, {
        onSettled: () => {
          setDeleteModalState({ isOpen: false, settingId: null, libraryName: '' });
        }
      });
    }
  };

  const closeFormModal = () => {
    setShowForm(false);
    setTimeout(() => setEditingSetting(null), 300); // Clear state after animation
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-brand-600 p-3 rounded-xl shadow-sm text-white shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
            <p className="text-slate-500 text-sm mt-1">
              Configure your payment gateways and notification preferences.
            </p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setEditingSetting(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create Setting
        </button>
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        {isSettingsLoading || isLibrariesLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : settings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Settings Configured</h3>
            <p className="text-slate-500 mt-2">Click the Create Setting button to configure a new library setting.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.map((setting) => (
              <div key={setting.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 hover:border-purple-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <LibraryIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 truncate max-w-[200px]">{getLibraryName(setting.libraryId)}</h3>
                      <p className="text-xs text-slate-500">Library Setting</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEditClick(setting)}
                      disabled={isDeleting && deleteModalState.settingId === setting.id}
                      title="Edit setting"
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(setting)}
                      disabled={isDeleting && deleteModalState.settingId === setting.id}
                      title="Delete setting"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Key className="w-4 h-4" />
                      <span>Razorpay Key</span>
                    </div>
                    <span className="font-medium text-slate-800 truncate max-w-[120px]" title={setting.razorpayKeyId}>
                      {setting.razorpayKeyId ? 'Configured' : 'Not Configured'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MessageSquare className="w-4 h-4" />
                      <span>SMS Notifications</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${setting.smsNotificationEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {setting.smsNotificationEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conditionally render the setting component in a modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b border-gray-100 rounded-t-2xl">
              <h2 className="text-lg font-bold text-slate-800">
                {editingSetting ? 'Edit System Settings' : 'Create System Settings'}
              </h2>
              <button
                onClick={closeFormModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              <SettingComponent 
                initialData={editingSetting} 
                onClose={closeFormModal} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, settingId: null, libraryName: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Setting"
        message="Are you sure you want to delete the configuration for this library? This will remove the Razorpay integration and SMS notification preferences."
        itemName={`Settings for: ${deleteModalState.libraryName}`}
        isPending={isDeleting}
      />
    </div>
  );
};

export default SettingsPage;
