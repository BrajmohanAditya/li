import React, { useState, useEffect } from 'react';
import { X, Layers, Loader2 } from 'lucide-react';

const EditSheetModal = ({ isOpen, onClose, onSubmit, isPending, sheet }) => {
  const [formData, setFormData] = useState({
    sheetNumber: '',
    isAvailable: true
  });

  useEffect(() => {
    if (sheet) {
      setFormData({
        sheetNumber: sheet.sheetNumber || '',
        isAvailable: sheet.isAvailable !== undefined ? sheet.isAvailable : true
      });
    }
  }, [sheet]);

  if (!isOpen || !sheet) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: sheet.id, data: formData });
  };

  const shortId = sheet.id ? sheet.id.substring(0, 8) : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-4">
            <h2 className="text-xl font-bold text-slate-800">Edit Sheet</h2>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6">
            {/* Sheet Info Block */}
            <div className="bg-brand-50/50 rounded-2xl p-6 flex flex-col items-center justify-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3 shadow-md">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{sheet.sheetNumber}</h3>
              <p className="text-xs text-slate-400 mt-1 tracking-wide">ID: {shortId}</p>
            </div>

            <div className="space-y-5">
              {/* Status Toggle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    formData.isAvailable 
                      ? 'bg-emerald-100/70 text-emerald-700 hover:bg-emerald-200/70' 
                      : 'bg-rose-100/70 text-rose-700 hover:bg-rose-200/70'
                  }`}
                >
                  {formData.isAvailable ? 'Mark as Occupied' : 'Mark as Free'}
                </button>
              </div>

              {/* Sheet Number Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Sheet Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.sheetNumber}
                  onChange={(e) => setFormData({ ...formData, sheetNumber: e.target.value })}
                  className="w-full bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || (formData.sheetNumber === sheet.sheetNumber && formData.isAvailable === sheet.isAvailable)}
                className="flex items-center justify-center bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 shadow-[0_4px_14px_0_rgba(244,63,94,0.39)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.23)] hover:-translate-y-0.5 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSheetModal;
