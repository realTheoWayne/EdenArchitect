import React, { useState } from 'react';
import { MONTHS, INITIAL_CROPS } from '../constants';
import { Crop, CustomScheduleItem, GardenElement, GardenSettings } from '../types';
import { Plus, X, Sprout, Snowflake, ThermometerSnowflake, Printer } from 'lucide-react';

interface CalendarViewProps {
  customItems: CustomScheduleItem[];
  setCustomItems: React.Dispatch<React.SetStateAction<CustomScheduleItem[]>>;
  gardenElements?: GardenElement[];
  settings: GardenSettings;
}

const CalendarView: React.FC<CalendarViewProps> = ({ customItems, setCustomItems, gardenElements = [], settings }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<CustomScheduleItem>>({
    startMonth: 3,
    endMonth: 6,
    type: 'sow',
    color: 'bg-indigo-500'
  });

  // Calculate frost months indices
  const firstFrostDate = new Date(settings.firstFrostDate);
  const lastFrostDate = new Date(settings.lastFrostDate);
  const firstFrostMonth = firstFrostDate.getMonth();
  const lastFrostMonth = lastFrostDate.getMonth();

  // Extract planted crops from the planner
  const plannedCrops = gardenElements
    .filter(el => el.type === 'plant' && el.cropId)
    .map(el => {
        const crop = INITIAL_CROPS.find(c => c.id === el.cropId);
        if (!crop || !el.plantingDate) return null;
        
        const plantDate = new Date(el.plantingDate);
        const plantMonthIndex = plantDate.getMonth();
        // Estimate harvest month
        const harvestDate = new Date(plantDate);
        harvestDate.setDate(harvestDate.getDate() + crop.daysToMaturity);
        const harvestMonthIndex = harvestDate.getMonth();

        return {
            elementId: el.id,
            name: crop.name,
            icon: crop.icon,
            plantingDate: el.plantingDate,
            startMonth: plantMonthIndex,
            endMonth: harvestMonthIndex,
            isNextYear: harvestDate.getFullYear() > plantDate.getFullYear(),
            coldHardy: crop.coldHardy,
            winterProtection: el.winterProtection
        };
    })
    .filter(Boolean) as any[];

  const handleAddItem = () => {
    if (newItem.title && newItem.startMonth !== undefined && newItem.endMonth !== undefined) {
      const item: CustomScheduleItem = {
        id: Math.random().toString(36).substr(2, 9),
        title: newItem.title,
        startMonth: Number(newItem.startMonth),
        endMonth: Number(newItem.endMonth),
        type: newItem.type as any,
        color: newItem.color || 'bg-gray-500'
      };
      setCustomItems([...customItems, item]);
      setShowAddForm(false);
      setNewItem({ startMonth: 3, endMonth: 6, type: 'sow', color: 'bg-indigo-500' });
    }
  };

  const removeCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto h-full overflow-y-auto print:h-auto print:overflow-visible">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-800 font-bold mb-2">Planting Calendar</h2>
          <div className="flex items-center gap-4 text-sm text-stone-600">
             <span className="flex items-center gap-1"><Snowflake size={14} className="text-blue-400"/> Cold Hardy</span>
             <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-50 border border-blue-100"></div> Frost Risk Period</span>
          </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => window.print()} 
                className="flex items-center justify-center p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors print:hidden"
                title="Print Calendar"
            >
                <Printer size={20} />
            </button>
            <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium print:hidden"
            >
            <Plus size={18} /> Add Custom Task
            </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow border border-stone-200 animate-fadeIn print:hidden">
           <h3 className="font-bold text-stone-800 mb-4">Add Custom Schedule</h3>
           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
             <input 
               type="text" 
               placeholder="Crop / Task Name"
               className="border border-stone-300 rounded px-3 py-2"
               value={newItem.title || ''}
               onChange={e => setNewItem({...newItem, title: e.target.value})}
             />
             <select 
                className="border border-stone-300 rounded px-3 py-2"
                value={newItem.type}
                onChange={e => setNewItem({...newItem, type: e.target.value as any})}
             >
               <option value="sow">Sow</option>
               <option value="transplant">Transplant</option>
               <option value="harvest">Harvest</option>
               <option value="care">Care</option>
             </select>
             <div className="flex items-center gap-2">
               <span className="text-sm text-stone-500">Start:</span>
               <select 
                  className="border border-stone-300 rounded px-3 py-2 flex-1"
                  value={newItem.startMonth}
                  onChange={e => setNewItem({...newItem, startMonth: Number(e.target.value)})}
               >
                 {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
               </select>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-sm text-stone-500">End:</span>
               <select 
                  className="border border-stone-300 rounded px-3 py-2 flex-1"
                  value={newItem.endMonth}
                  onChange={e => setNewItem({...newItem, endMonth: Number(e.target.value)})}
               >
                 {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
               </select>
             </div>
             <div className="flex gap-2">
               <button onClick={handleAddItem} className="flex-1 bg-emerald-600 text-white rounded font-medium">Add</button>
               <button onClick={() => setShowAddForm(false)} className="px-3 text-stone-500 hover:bg-stone-100 rounded">Cancel</button>
             </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden relative">
        {/* Frost Background Layer */}
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none z-0 pl-[25%]">
            {MONTHS.map((_, i) => {
                const isWinter = i <= lastFrostMonth || i >= firstFrostMonth;
                return (
                    <div key={i} className={`h-full ${isWinter ? 'bg-blue-50/50' : 'bg-transparent'}`}></div>
                );
            })}
        </div>

        {/* Header Row */}
        <div className="grid grid-cols-12 border-b border-stone-200 bg-stone-50 sticky top-0 z-10 relative">
          <div className="col-span-3 p-4 font-semibold text-stone-700 border-r border-stone-200 bg-stone-50">Crop / Task</div>
          <div className="col-span-9 grid grid-cols-12">
            {MONTHS.map((month, idx) => (
              <div key={idx} className="p-4 text-center text-xs font-bold text-stone-500 uppercase tracking-wider border-l border-stone-100">
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* My Plan Section (Auto-filled) */}
        {plannedCrops.length > 0 && (
            <div className="bg-emerald-50/30 border-b border-emerald-100 relative z-10">
                <div className="px-4 py-2 font-serif font-bold text-emerald-800 text-sm uppercase tracking-widest flex items-center gap-2 bg-emerald-50/80">
                    <Sprout size={14}/> My Active Plan
                </div>
                {plannedCrops.map((item, idx) => (
                    <div key={`${item.elementId}-${idx}`} className="grid grid-cols-12 border-t border-emerald-100 hover:bg-emerald-100/30 transition-colors">
                        <div className="col-span-3 p-3 flex items-center gap-3 border-r border-emerald-200/50 relative">
                            <span className="text-xl">{item.icon}</span>
                            <div>
                                <div className="font-bold text-emerald-900 text-xs flex items-center gap-1">
                                    {item.name}
                                    {item.coldHardy && <Snowflake size={10} className="text-blue-400" />}
                                </div>
                                <div className="text-[10px] text-emerald-700">Planted: {item.plantingDate}</div>
                                {item.winterProtection && item.winterProtection !== 'none' && (
                                    <div className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded inline-block mt-0.5 capitalize">
                                        Protected: {item.winterProtection.replace('_', ' ')}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-span-9 grid grid-cols-12 relative h-full items-center">
                            {MONTHS.map((_, i) => <div key={i} className="h-full border-l border-emerald-100/30 absolute" style={{left: `${(i/12)*100}%`}}></div>)}
                            
                            {/* Growth Bar */}
                            <div 
                                className="col-span-12 h-6 relative mx-1"
                            >
                                <div 
                                    className="absolute h-4 top-1 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-90 shadow-sm border border-emerald-500"
                                    style={{
                                        left: `${(item.startMonth / 12) * 100}%`,
                                        width: `${Math.max(1, ((item.endMonth - item.startMonth + (item.isNextYear ? 12 : 0) + 1) / 12) * 100)}%`
                                    }}
                                    title={`Growing: ${item.name}`}
                                >
                                    <div className="w-full h-full flex items-center justify-end pr-2">
                                        <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse" title="Harvest Window"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* General Guide Crops */}
        <div className="bg-stone-50 px-4 py-2 font-serif font-bold text-stone-500 text-sm uppercase tracking-widest border-b border-stone-200 relative z-10">
            General Guide
        </div>
        <div className="divide-y divide-stone-100 relative z-10">
          {INITIAL_CROPS.map((crop) => (
            <div key={crop.id} className="grid grid-cols-12 hover:bg-stone-50/50 transition-colors group">
              <div className="col-span-3 p-4 flex items-center gap-3 border-r border-stone-200">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner bg-stone-100`}>
                  {crop.icon}
                </div>
                <div>
                  <div className="font-bold text-stone-800 text-sm flex items-center gap-1">
                      {crop.name}
                      {crop.coldHardy && (
                        <span title="Cold Hardy Crop">
                          <Snowflake size={12} className="text-blue-400" />
                        </span>
                      )}
                  </div>
                  <div className="text-xs text-stone-500">{crop.daysToMaturity}d</div>
                </div>
              </div>
              <div className="col-span-9 grid grid-cols-12 relative h-full items-center">
                {MONTHS.map((_, idx) => (
                  <div key={idx} className="h-full border-l border-stone-100 absolute" style={{ left: `${(idx / 12) * 100}%` }}></div>
                ))}
                <CropBar crop={crop} />
              </div>
            </div>
          ))}

          {/* Custom Items */}
          {customItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 hover:bg-stone-50/50 transition-colors group">
              <div className="col-span-3 p-4 flex items-center justify-between border-r border-stone-200">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-700">
                       {item.title.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-stone-800 text-sm">{item.title}</div>
                      <div className="text-xs text-stone-500 capitalize">{item.type}</div>
                    </div>
                 </div>
                 <button onClick={() => removeCustomItem(item.id)} className="text-stone-300 hover:text-red-500 print:hidden"><X size={16}/></button>
              </div>
              <div className="col-span-9 grid grid-cols-12 relative h-full items-center">
                {MONTHS.map((_, idx) => (
                  <div key={idx} className="h-full border-l border-stone-100 absolute" style={{ left: `${(idx / 12) * 100}%` }}></div>
                ))}
                <div className="col-span-12 h-8 relative mx-1">
                   <div 
                      className={`absolute h-6 top-1 rounded-md opacity-80 border shadow-sm flex items-center px-2 text-[10px] text-white overflow-hidden whitespace-nowrap
                        ${item.type === 'sow' ? 'bg-blue-500 border-blue-600' : 
                          item.type === 'harvest' ? 'bg-orange-500 border-orange-600' : 
                          item.type === 'transplant' ? 'bg-green-500 border-green-600' : 'bg-stone-500 border-stone-600'}
                      `}
                      style={{
                        left: `${(item.startMonth / 12) * 100}%`,
                        width: `${((item.endMonth - item.startMonth + 1) / 12) * 100}%`
                      }}
                    >
                      {item.title}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CropBar: React.FC<{ crop: Crop }> = ({ crop }) => {
  return (
    <div className="col-span-12 h-8 relative mx-1">
      {/* Sow Indoors */}
      {crop.sowIndoorsStart !== undefined && crop.sowIndoorsEnd !== undefined && (
        <div 
          className="absolute h-4 top-1 rounded-l-md bg-blue-400 opacity-30 border-blue-500 border-l border-t border-b"
          style={{
            left: `${(crop.sowIndoorsStart / 12) * 100}%`,
            width: `${((crop.sowIndoorsEnd - crop.sowIndoorsStart + 1) / 12) * 100}%`
          }}
          title="Sow Indoors"
        />
      )}
      {/* Sow Outdoors/Transplant */}
      {(crop.sowOutdoorsStart !== undefined || crop.transplantStart !== undefined) && (
        <div 
          className="absolute h-4 top-1 bg-green-500 opacity-60 border-green-600 border"
          style={{
            left: `${((crop.sowOutdoorsStart ?? crop.transplantStart ?? 0) / 12) * 100}%`,
            width: `${(((crop.sowOutdoorsEnd ?? crop.transplantEnd ?? 0) - (crop.sowOutdoorsStart ?? crop.transplantStart ?? 0) + 1) / 12) * 100}%`
          }}
          title="Plant Out"
        />
      )}
      {/* Harvest */}
      {crop.harvestStart !== undefined && crop.harvestEnd !== undefined && (
        <div 
          className="absolute h-4 top-1 rounded-r-md bg-orange-400 opacity-60 border-orange-500 border-r border-t border-b"
          style={{
            left: `${(crop.harvestStart / 12) * 100}%`,
            width: `${((crop.harvestEnd - crop.harvestStart + 1) / 12) * 100}%`
          }}
          title="Harvest"
        />
      )}
    </div>
  );
};

export default CalendarView;
