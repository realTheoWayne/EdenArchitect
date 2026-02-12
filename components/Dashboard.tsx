import React from 'react';
import { CloudSun, Moon, Droplets, LayoutGrid, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { GardenSettings, ViewMode } from '../types';

interface DashboardProps {
  settings: GardenSettings;
  almanac: any;
  today: string;
  onNavigate: (view: ViewMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ settings, almanac, today, onNavigate }) => {
  // Safe helpers for optional data
  const forecast = almanac?.weatherForecast || "Loading forecast...";
  const moonPhase = almanac?.moonPhase || "Loading...";
  const plantingDays = Array.isArray(almanac?.bestPlantingDays) 
    ? almanac.bestPlantingDays.join(', ') 
    : "Loading...";

  return (
    <div className="h-full overflow-y-auto p-8 max-w-6xl mx-auto animate-fadeIn">
        <div className="text-center mb-10">
            <h1 className="text-5xl font-serif font-bold text-emerald-900 mb-4">Eden Architect</h1>
            <p className="text-emerald-700/80 text-lg">Welcome to your digital garden in Zone {settings?.zone || '...'}.</p>
        </div>

        <div className="mb-12 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-3xl p-6 shadow-sm border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md text-amber-500">
                    <CloudSun size={32} />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-xl text-emerald-900">Garden Almanac</h3>
                    <p className="text-emerald-700 text-sm">Today: {today} • Zone {settings?.zone}</p>
                </div>
            </div>
            <div className="flex-1 md:border-l border-emerald-200 md:pl-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
                <div>
                    <div className="text-xs uppercase font-bold text-emerald-400 mb-1">Forecast</div>
                    <p className="text-emerald-800 font-medium text-sm">{forecast}</p>
                </div>
                <div>
                    <div className="text-xs uppercase font-bold text-emerald-400 mb-1 flex items-center gap-1 justify-center md:justify-start"><Moon size={12}/> Moon Phase</div>
                    <p className="text-emerald-800 font-medium text-sm">{moonPhase}</p>
                </div>
                <div>
                    <div className="text-xs uppercase font-bold text-emerald-400 mb-1 flex items-center gap-1 justify-center md:justify-start"><Droplets size={12}/> Plant Now</div>
                    <p className="text-emerald-800 font-medium text-sm">{plantingDays}</p>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <button onClick={() => onNavigate('planner')} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <LayoutGrid size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3">Visual Planner</h3>
                <p className="text-stone-500">Design your beds and layout.</p>
            </button>
            <button onClick={() => onNavigate('calendar')} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
                <div className="w-16 h-16 bg-orange-100 text-orange-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <CalendarIcon size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3">Planting Calendar</h3>
                <p className="text-stone-500">Track sow and harvest dates.</p>
            </button>
            <button onClick={() => onNavigate('consultant')} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left group">
                <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <MessageSquare size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-3">AI Consultant</h3>
                <p className="text-stone-500">Get expert advice instantly.</p>
            </button>
        </div>
    </div>
  );
};

export default Dashboard;
