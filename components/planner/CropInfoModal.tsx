import React from 'react';
import { Crop, CropVariety } from '../../types';
import { X, Calendar, Maximize2, Heart, Skull, Bug, MessageSquare, ChevronDown, Snowflake } from 'lucide-react';

interface CropInfoModalProps {
  crop: Crop;
  selectedVariety: CropVariety | null;
  onSelectVariety: (variety: CropVariety | null) => void;
  onClose: () => void;
  onAskAI?: (prompt: string) => void;
}

const CropInfoModal: React.FC<CropInfoModalProps> = ({ crop, selectedVariety, onSelectVariety, onClose, onAskAI }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 print:hidden" onClick={onClose}>
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-fadeIn ring-4 ring-rose-400 ring-offset-4 ring-offset-stone-100" 
          onClick={e => e.stopPropagation()}
        >
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4 w-full">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0">
                        {crop.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-serif text-2xl font-bold text-stone-800">{crop.name}</h3>
                        
                        <div className="mt-1 relative inline-block">
                            {crop.varieties && crop.varieties.length > 0 ? (
                                <div className="relative group">
                                    <select 
                                        className="appearance-none bg-blue-50 border border-blue-200 text-blue-800 font-serif italic text-sm py-1 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer w-full max-w-[200px] truncate"
                                        value={selectedVariety?.name || 'Generic'}
                                        onChange={(e) => {
                                            const v = crop.varieties?.find(v => v.name === e.target.value);
                                            onSelectVariety(v || null);
                                        }}
                                    >
                                        {crop.varieties.map(v => (
                                            <option key={v.name} value={v.name}>{v.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-emerald-600 italic font-serif px-2 py-1 border border-transparent">{crop.botanicalName}</p>
                            )}
                        </div>
                        {selectedVariety && <div className="text-[10px] text-stone-400 font-serif italic ml-1 mt-0.5">{crop.botanicalName}</div>}
                        {crop.coldHardy && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full self-start">
                                <Snowflake size={10} /> Cold Hardy
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={20}/></button>
            </div>

            <p className="text-stone-600 leading-relaxed mb-6 bg-stone-50 p-3 rounded-xl italic">
                "{selectedVariety?.description || crop.description}"
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-50 p-3 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-stone-400 mb-1">Days to Maturity</div>
                    <div className="text-stone-800 font-bold flex items-center gap-2"><Calendar size={14} className="text-emerald-500"/> {selectedVariety?.daysToMaturity || crop.daysToMaturity} days</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-stone-400 mb-1">Spacing</div>
                    <div className="text-stone-800 font-bold flex items-center gap-2"><Maximize2 size={14} className="text-emerald-500"/> {selectedVariety?.spacing || crop.spacing}" apart</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                   <div className="w-6 shrink-0 pt-0.5 text-emerald-500"><Heart size={18} /></div>
                   <div>
                       <h4 className="font-bold text-stone-800 text-sm">Companions</h4>
                       <p className="text-sm text-stone-500">{crop.companions.join(', ')}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <div className="w-6 shrink-0 pt-0.5 text-rose-500"><Skull size={18} /></div>
                   <div>
                       <h4 className="font-bold text-stone-800 text-sm">Bad Neighbors</h4>
                       <p className="text-sm text-stone-500">{crop.antagonists?.join(', ') || 'None'}</p>
                   </div>
                </div>
                 <div className="flex gap-2">
                   <div className="w-6 shrink-0 pt-0.5 text-amber-500"><Bug size={18} /></div>
                   <div>
                       <h4 className="font-bold text-stone-800 text-sm">Pests & Diseases</h4>
                       <p className="text-sm text-stone-500">
                           {[...(crop.pests || []), ...(crop.resistance || [])].join(', ') || 'None listed'}
                       </p>
                   </div>
                </div>
            </div>

            {onAskAI && (
                <button 
                    onClick={() => onAskAI(`Tell me more about growing ${crop.name}, specifically the ${selectedVariety?.name || ''} variety.`)}
                    className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                    <MessageSquare size={18} /> Ask AI Expert
                </button>
            )}
        </div>
    </div>
  );
};

export default CropInfoModal;
