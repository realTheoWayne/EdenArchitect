import React from 'react';
import { GardenElement } from '../../types';
import { Copy, Trash2, Snowflake, MoveUp, MoveDown, Ban, Leaf, Umbrella, Box, Wind } from 'lucide-react';

interface ElementPropertiesProps {
  element: GardenElement;
  onUpdate: (updates: Partial<GardenElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveLayer: (dir: 'up' | 'down') => void;
  currentDate: string;
}

const PROTECTION_OPTIONS = [
    { value: 'none', label: 'None', icon: <Ban size={16}/> },
    { value: 'mulch', label: 'Mulch', icon: <Leaf size={16}/> },
    { value: 'cloche', label: 'Cloche', icon: <Umbrella size={16}/> },
    { value: 'cold_frame', label: 'Cold Frame', icon: <Box size={16}/> },
    { value: 'fleece', label: 'Fleece', icon: <Wind size={16}/> },
];

const ElementProperties: React.FC<ElementPropertiesProps> = ({ 
  element, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onMoveLayer,
  currentDate 
}) => {
  return (
    <div className="absolute bottom-6 right-6 bg-white p-5 rounded-3xl shadow-2xl border border-stone-100 w-72 animate-slideUp z-40 print:hidden">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                <div className="overflow-hidden">
                    <h3 className="font-bold text-stone-800 font-serif text-lg leading-none truncate w-32" title={element.name}>{element.name}</h3>
                    <p className="text-xs text-stone-400 uppercase tracking-wider font-bold truncate">{element.subType?.replace('_', ' ') || element.type}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={onDuplicate} className="w-8 h-8 flex items-center justify-center text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-full transition-colors shrink-0" title="Duplicate">
                    <Copy size={18} />
                </button>
                <button onClick={onDelete} className="w-8 h-8 flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors shrink-0" title="Delete">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
        
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Width (ft)</label>
                    <input 
                        type="number" 
                        min="1"
                        value={element.width} 
                        onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                </div>
                <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Length (ft)</label>
                    <input 
                        type="number" 
                        min="1"
                        value={element.height} 
                        onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                </div>
            </div>

            {(element.type === 'bed' || element.type === 'plant') && (
                <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                     <label className="text-[10px] uppercase font-bold text-stone-400 block mb-2 flex items-center gap-1"><Snowflake size={10}/> Winter Protection</label>
                     <div className="grid grid-cols-3 gap-2">
                         {PROTECTION_OPTIONS.map(opt => (
                             <button
                                key={opt.value}
                                onClick={() => onUpdate({ winterProtection: opt.value as any })}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all
                                    ${element.winterProtection === opt.value || (!element.winterProtection && opt.value === 'none') 
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                                        : 'bg-white border-stone-200 text-stone-500 hover:border-emerald-200 hover:text-emerald-600'}
                                `}
                                title={opt.label}
                             >
                                {opt.icon}
                                <span className="mt-1 text-[9px] font-medium leading-tight text-center">{opt.label}</span>
                             </button>
                         ))}
                     </div>
                </div>
            )}

            {(element.type === 'structure' || element.type === 'bed') && (
                <div className="bg-stone-50 p-2 rounded-xl border border-stone-100 flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-stone-400">Custom Color</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="color"
                            value={element.color?.startsWith('#') ? element.color : '#ffffff'}
                            onChange={(e) => onUpdate({ color: e.target.value })}
                            className="w-8 h-8 rounded-full cursor-pointer border-2 border-stone-200"
                        />
                        {element.color?.startsWith('#') && (
                            <button onClick={() => onUpdate({ color: '' })} className="text-xs text-stone-400 hover:text-stone-600">Reset</button>
                        )}
                    </div>
                </div>
            )}

            {element.type === 'plant' && (
                <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Planting Date</label>
                    <input 
                        type="date"
                        value={element.plantingDate || currentDate}
                        onChange={(e) => onUpdate({ plantingDate: e.target.value })}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                </div>
            )}

            <div className="flex gap-2">
                <button onClick={() => onMoveLayer('up')} className="flex-1 flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold py-2 rounded-lg">
                    <MoveUp size={14}/> Bring Fwd
                </button>
                <button onClick={() => onMoveLayer('down')} className="flex-1 flex items-center justify-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold py-2 rounded-lg">
                    <MoveDown size={14}/> Send Bwd
                </button>
            </div>
        </div>
    </div>
  );
};

export default ElementProperties;
