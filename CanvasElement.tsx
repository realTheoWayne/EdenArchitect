import React, { memo } from 'react';
import { GardenElement, Crop } from '../../types';
import { INITIAL_CROPS, GRID_SIZE } from '../../constants';
import { Sun, CloudSun, Cloud, Leaf, Umbrella, Box, Wind } from 'lucide-react';

interface CanvasElementProps {
  element: GardenElement;
  isSelected: boolean;
  viewportScale: number;
  currentDate: string;
  onMouseDown: (e: React.MouseEvent, id: string, mode?: 'drag' | 'resize') => void;
  onTouchStart: (e: React.TouchEvent, id: string, mode?: 'drag' | 'resize') => void;
}

const CanvasElement: React.FC<CanvasElementProps> = ({ 
  element, 
  isSelected, 
  viewportScale, 
  currentDate,
  onMouseDown, 
  onTouchStart 
}) => {
  const isZone = element.type === 'zone';
  const isPlant = element.type === 'plant';

  // Styles
  let style: React.CSSProperties = {
    position: 'absolute',
    left: element.x * GRID_SIZE,
    top: element.y * GRID_SIZE,
    width: element.width * GRID_SIZE,
    height: element.height * GRID_SIZE,
    zIndex: isZone ? 5 : (isPlant ? 20 : 10), // Base Z-index, PlannerCanvas handles layering via array order usually, but this helps visual separation types
    transition: isSelected ? 'none' : 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  if (isZone) {
    if (element.sunlight === 'full') {
        style.backgroundColor = 'rgba(253, 224, 71, 0.2)';
        style.borderColor = 'rgba(234, 179, 8, 0.5)';
    } else if (element.sunlight === 'partial') {
        style.backgroundColor = 'rgba(253, 186, 116, 0.2)';
        style.borderColor = 'rgba(249, 115, 22, 0.5)';
    } else {
        style.backgroundColor = 'rgba(147, 197, 253, 0.2)';
        style.borderColor = 'rgba(59, 130, 246, 0.5)';
    }
    style.borderStyle = 'dashed';
    style.borderWidth = Math.max(2, 2 / viewportScale);
  } else {
      if (viewportScale < 0.6) {
          style.borderWidth = 4 / viewportScale;
      }
  }

  // --- Helpers ---
  const getPlantIcon = (el: GardenElement, crop: Crop) => {
    if (!el.plantingDate) return crop.icon;
    const planted = new Date(el.plantingDate).getTime();
    const current = new Date(currentDate).getTime();
    const daysElapsed = (current - planted) / (1000 * 60 * 60 * 24);
    
    if (daysElapsed < 0) return '🌰'; 
    if (daysElapsed < crop.daysToMaturity * 0.2) return '🌱'; 
    if (daysElapsed < crop.daysToMaturity * 0.8) return '🌿'; 
    return crop.icon;
  };

  const renderContent = () => {
    // Protection Overlay
    const protectionOverlay = element.winterProtection && element.winterProtection !== 'none' ? (
        <div className={`absolute inset-0 pointer-events-none rounded-sm z-10 flex items-center justify-center
            ${element.winterProtection === 'mulch' ? 'bg-[#3e2b22]/40 backdrop-sepia' : 
              element.winterProtection === 'cloche' ? 'bg-white/30 backdrop-blur-sm border-2 border-white/50 rounded-full' :
              element.winterProtection === 'cold_frame' ? 'bg-blue-100/20 backdrop-blur-sm border-2 border-stone-300' :
              'bg-white/40 backdrop-blur-[1px]'}
        `}>
           {element.winterProtection === 'cloche' && <div className="w-2 h-2 rounded-full bg-white/60 absolute top-1"></div>}
           <div className="absolute bottom-1 right-1 text-white opacity-80 drop-shadow-md">
                {element.winterProtection === 'mulch' && <Leaf size={10} />}
                {element.winterProtection === 'cloche' && <Umbrella size={10} />}
                {element.winterProtection === 'cold_frame' && <Box size={10} />}
                {element.winterProtection === 'fleece' && <Wind size={10} />}
           </div>
        </div>
    ) : null;

    if (element.type === 'zone') {
        const icons: any = { full: <Sun />, partial: <CloudSun />, shade: <Cloud /> };
        return <div className="opacity-50 text-stone-800 scale-75 md:scale-100 origin-center">{icons[element.sunlight || 'full']}</div>;
    }

    if (element.type === 'plant') {
        const crop = INITIAL_CROPS.find(c => c.id === element.cropId);
        if (!crop) return null;
        return (
            <div className="flex flex-col items-center animate-bounce-slight pointer-events-none w-full h-full justify-center relative" title={`Planted: ${element.plantingDate}`}>
                <span className="text-3xl filter drop-shadow-md transform transition-transform z-0">
                    {getPlantIcon(element, crop)}
                </span>
                {protectionOverlay}
            </div>
        );
    }

    const spriteMap: any = {
        house: { icon: '🏡', color: 'bg-rose-100', border: 'border-rose-300' },
        shed: { icon: '🛖', color: 'bg-amber-100', border: 'border-amber-300' },
        garage: { icon: '🚘', color: 'bg-stone-200', border: 'border-stone-400' },
        playground: { icon: '🛝', color: 'bg-lime-100', border: 'border-lime-300' },
        path: { icon: '🪨', color: 'bg-stone-300', border: 'border-stone-400' },
        fence: { icon: '🚧', color: 'bg-orange-200', border: 'border-orange-400' },
        basic_tree: { icon: '🌳', color: 'bg-emerald-100', border: 'border-emerald-300' },
        
        raised_bed: { icon: null, color: 'bg-[#8B5A2B]', border: 'border-[#5D3A1A]', texture: true },
        ground_bed: { icon: null, color: 'bg-[#5c4033]', border: 'border-stone-600', dirt: true },
        pot: { icon: '🪴', color: 'bg-orange-600', border: 'border-orange-800' },
        greenhouse: { icon: null, color: 'bg-blue-50/50', border: 'border-blue-200' }
    };

    const sprite = spriteMap[element.subType || ''] || { icon: '📦', color: element.color || 'bg-gray-200', border: 'border-gray-400' };
    const customStyle = element.color && element.color.startsWith('#') ? { backgroundColor: element.color } : {};
    const baseColorClass = element.color && element.color.startsWith('#') ? '' : sprite.color;

    if (element.subType === 'raised_bed') {
        return (
            <div className={`w-full h-full ${baseColorClass} ${sprite.border} border-4 rounded shadow-sm relative overflow-hidden flex items-center justify-center`} style={customStyle}>
                <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)'}}></div>
                <div className="absolute inset-0 flex flex-col divide-y divide-[#5D3A1A]/30 pointer-events-none">
                    <div className="flex-1"></div><div className="flex-1"></div><div className="flex-1"></div>
                </div>
                {protectionOverlay}
            </div>
        );
    }

    if (element.subType === 'greenhouse') {
        return (
            <div className={`w-full h-full ${baseColorClass} ${sprite.border} border-2 rounded-lg relative overflow-hidden backdrop-blur-sm shadow-md`} style={customStyle}>
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5 bg-blue-300/30 p-0.5">
                    <div className="bg-white/40"></div><div className="bg-white/40"></div><div className="bg-white/40"></div><div className="bg-white/40"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-50">🏠</div>
            </div>
        );
    }

    if (element.subType === 'pot') {
        return (
            <div className={`w-full h-full rounded-full ${baseColorClass} ${sprite.border} border-4 shadow-lg flex items-center justify-center relative`} style={customStyle}>
                <div className="w-[70%] h-[70%] rounded-full bg-[#3e2b22] shadow-inner"></div>
                {protectionOverlay}
            </div>
        );
    }

    if (element.subType === 'basic_tree') {
        return (
            <div className={`w-full h-full rounded-full ${baseColorClass} ${sprite.border} border-4 shadow-lg flex items-center justify-center overflow-hidden`} style={customStyle}>
                 <span className="text-xl filter drop-shadow-md select-none">{sprite.icon}</span>
            </div>
        );
    }

    if (element.subType === 'ground_bed') {
        return (
            <div className={`w-full h-full ${baseColorClass} rounded-sm border-2 border-dashed ${sprite.border} opacity-90 relative`} style={customStyle}>
                 <div className="w-full h-full opacity-20" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
                 {protectionOverlay}
            </div>
        );
    }

    // Default Structure
    return (
        <div className={`w-full h-full ${baseColorClass} ${sprite.border} border-b-4 rounded-xl shadow-lg flex flex-col items-center justify-center relative`} style={customStyle}>
            <span className="text-4xl filter drop-shadow-md select-none">{sprite.icon}</span>
            {element.width > 2 && <span className="text-[10px] font-bold text-stone-700 mt-1 uppercase tracking-wider bg-white/50 px-1 rounded select-none">{element.name}</span>}
        </div>
    );
  };

  return (
    <div
        onMouseDown={(e) => onMouseDown(e, element.id)}
        onTouchStart={(e) => onTouchStart(e, element.id)}
        style={style}
        className={`flex items-center justify-center select-none ${isSelected ? 'ring-2 ring-emerald-400 shadow-xl' : ''} ${isSelected ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
    >
        {renderContent()}
        
        {isSelected && !isPlant && (
            <div 
                className="absolute bottom-0 right-0 bg-white border-2 border-emerald-500 rounded-full cursor-se-resize flex items-center justify-center z-50 shadow-md hover:scale-125 transition-transform print:hidden"
                onMouseDown={(e) => onMouseDown(e, element.id, 'resize')}
                onTouchStart={(e) => onTouchStart(e, element.id, 'resize')}
                style={{ 
                    width: `${Math.max(16, 24/viewportScale)}px`, 
                    height: `${Math.max(16, 24/viewportScale)}px`,
                    transform: 'translate(30%, 30%)'
                }}
            >
                <div className="bg-emerald-500 rounded-full" style={{ width: '40%', height: '40%' }}></div>
            </div>
        )}

        {isSelected && (
        <div 
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur text-stone-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm whitespace-nowrap z-[60] border border-stone-200 print:hidden pointer-events-none"
            style={{ transform: `scale(${1/viewportScale}) translate(-50%, -100%)`, transformOrigin: 'bottom center' }}
        >
            {element.width}ft x {element.height}ft
        </div>
        )}
    </div>
  );
};

export default memo(CanvasElement);
