import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Settings, Key, MessageSquare, Loader2, Save, Library as LibraryIcon, ChevronDown } from 'lucide-react';
import { 
  getAllSettingsHook, 
  createSettingHook, 
  updateSettingHook 
} from '../../hooks/setting.hook';
import { getAllLibrariesHook } from '../../hooks/library.hook';

const SettingsPage = () => {
  const { data: librariesData, isLoading: isLoadingLibraries } = getAllLibrariesHook();
  const libraries = librariesData?.data || [];

  const { data: settingsResponse, isLoading: isLoadingSettings } = getAllSettingsHook();
  const { mutate: createSetting, isPending: isCreating } = createSettingHook();
  const { mutate: updateSetting, isPending: isUpdating } = updateSettingHook();
  
  const [existingSettingId, setExistingSettingId] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      libraryId: '',
      razorpayKeyId: '',
      razorpayKeySecret: '',
      smsNotificationEnabled: false
    }
  });

  useEffect(() => {
    if (settingsResponse?.data) {
      // Handle both array and single object responses safely
      const settingsData = Array.isArray(settingsResponse.data) 
        ? settingsResponse.data[0] 
        : settingsResponse.data;
      
      if (settingsData) {
        setExistingSettingId(settingsData.id);
        reset({
          libraryId: settingsData.libraryId || '',
          razorpayKeyId: settingsData.razorpayKeyId || '',
          razorpayKeySecret: settingsData.razorpayKeySecret || '',
          smsNotificationEnabled: settingsData.smsNotificationEnabled || false
        });
      }
    }
  }, [settingsResponse, reset]);

  const onSubmit = (data) => {
    if (existingSettingId) {
      updateSetting({ id: existingSettingId, data });
    } else {
      createSetting(data);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-sm font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  const isPending = isCreating || isUpdating;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-brand-600 p-3 rounded-xl shadow-sm text-white shrink-0">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your payment gateways and notification preferences.</p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          
          {/* General Configuration */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <LibraryIcon className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-800">General Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Select Library <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    {...register("libraryId", { required: true })}
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none transition-all cursor-pointer"
                  >
                    <option value="" disabled>
                      {isLoadingLibraries ? 'Loading libraries...' : 'Choose a library'}
                    </option>
                    {libraries.map((lib) => (
                      <option key={lib.id} value={lib.id}>
                        {lib.name} {lib.city ? `- ${lib.city}` : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Assign these settings to a specific library</p>
              </div>
            </div>
          </div>

          {/* Payment Gateway Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Key className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-800">Razorpay Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key ID
                </label>
                <input 
                  type="text" 
                  {...register("razorpayKeyId")}
                  placeholder="rzp_live_xxxxxxxxxx"
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:font-normal"
                />
                <p className="text-xs text-slate-400 mt-1.5">Enter your Razorpay Key ID.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key Secret
                </label>
                <input 
                  type="password" 
                  {...register("razorpayKeySecret")}
                  placeholder="••••••••••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:font-normal"
                />
                <p className="text-xs text-slate-400 mt-1.5">Keep this secret key secure and do not share it.</p>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">SMS Notifications</h3>
                <p className="text-xs text-slate-500 mt-1">Enable or disable SMS alerts for users</p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  {...register("smsNotificationEnabled")}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
