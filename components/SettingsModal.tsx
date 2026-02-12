import React from 'react';
import { MapPin } from 'lucide-react';
import { GardenSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GardenSettings;
  onSave: (newSettings: GardenSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof GardenSettings, value: any) => {
    onSave({ ...settings, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fadeIn border border-white/50">
        <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Garden Profile</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-stone-500 mb-1 ml-1 flex items-center gap-2"><MapPin size={14}/> Hardiness Zone</label>
            <div className="flex gap-2">
                <input 
                type="text" 
                value={settings.zone}
                onChange={(e) => handleChange('zone', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g. 6b"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-500 mb-1 ml-1 flex items-center gap-2">
                Soil Type
            </label>
            <select 
              value={settings.soilType}
              onChange={(e) => handleChange('soilType', e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="loam">Loam</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="silt">Silt</option>
              <option value="peat">Peat</option>
              <option value="chalk">Chalk</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-stone-500 mb-1 ml-1">Avg. Humidity (%)</label>
                <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={settings.averageHumidity || ''}
                    onChange={(e) => handleChange('averageHumidity', Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                    placeholder="e.g. 60"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-stone-500 mb-1 ml-1">Soil pH</label>
                <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="14"
                    value={settings.soilPh || ''}
                    onChange={(e) => handleChange('soilPh', Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                    placeholder="e.g. 6.5"
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-stone-500 mb-1 ml-1">Width (ft)</label>
                <input 
                    type="number" 
                    value={settings.width}
                    onChange={(e) => handleChange('width', Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-stone-500 mb-1 ml-1">Length (ft)</label>
                <input 
                    type="number" 
                    value={settings.height}
                    onChange={(e) => handleChange('height', Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3"
                />
             </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
