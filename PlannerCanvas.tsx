import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GardenElement, Crop, CropVariety } from '../types';
import { GRID_SIZE, INITIAL_CROPS } from '../constants';
import { Box, Home, Flower2, Sun, Cuboid, Undo, Redo, ZoomIn, ZoomOut, Move, Warehouse, Minimize2, Circle as CircleIcon, Trees, GripHorizontal, CloudSun, Cloud, Info, Snowflake, Focus } from 'lucide-react';

import Garden3DView from './Garden3DView';
import CanvasElement from './planner/CanvasElement';
import ElementProperties from './planner/ElementProperties';
import CropInfoModal from './planner/CropInfoModal';

// --- UI Components ---
const ToolbarButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all text-sm shrink-0 whitespace-nowrap
        ${active ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'}
      `}
    >
      {icon}
      {label}
    </button>
);

const ElementButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; color: string }> = ({ onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all shadow-sm group text-left"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm ${color} group-hover:scale-110 transition-transform`}>
        <span className="text-lg">{icon}</span>
    </div>
    <span className="font-medium text-stone-700 text-sm group-hover:text-emerald-800">{label}</span>
  </button>
);

interface PlannerCanvasProps {
  elements: GardenElement[];
  setElements: React.Dispatch<React.SetStateAction<GardenElement[]>>;
  currentDate: string;
  onAskAI?: (question: string) => void;
}

export const PlannerCanvas: React.FC<PlannerCanvasProps> = ({ elements, setElements, currentDate, onAskAI }) => {
  // --- State ---
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [activeTab, setActiveTab] = useState<'structures' | 'beds' | 'plants' | 'zones'>('beds');
  const [show3D, setShow3D] = useState(false);
  
  // Modals
  const [viewCrop, setViewCrop] = useState<Crop | null>(null);
  const [viewVariety, setViewVariety] = useState<CropVariety | null>(null);

  // Interaction Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ 
    isDragging: boolean; 
    isResizing: boolean; 
    isPanning: boolean;
    startX: number; 
    startY: number;
    initialVP: {x:number, y:number};
    initialEl: {x:number, y:number, w:number, h:number} | null 
  }>({ 
    isDragging: false, isResizing: false, isPanning: false, 
    startX: 0, startY: 0, initialVP: {x:0,y:0}, initialEl: null 
  });
  
  // Track space key state for panning
  const isSpacePressedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressedRef.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') isSpacePressedRef.current = false;
    };
    const handleBlur = () => {
        isSpacePressedRef.current = false;
        // Also reset drag state on blur to be safe
        dragRef.current = { isDragging: false, isResizing: false, isPanning: false, startX: 0, startY: 0, initialVP: {x:0,y:0}, initialEl: null };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // History
  const [history, setHistory] = useState<GardenElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize History
  useEffect(() => {
    if (history.length === 0 && elements.length >= 0) {
        setHistory([elements]);
        setHistoryIndex(0);
    }
  }, []); // Run once

  const commitToHistory = (newElements: GardenElement[]) => {
      const newHist = history.slice(0, historyIndex + 1);
      newHist.push(newElements);
      setHistory(newHist);
      setHistoryIndex(newHist.length - 1);
      setElements(newElements);
  };

  const undo = () => {
      if (historyIndex > 0) {
          setHistoryIndex(prev => prev - 1);
          setElements(history[historyIndex - 1]);
      }
  };

  const redo = () => {
      if (historyIndex < history.length - 1) {
          setHistoryIndex(prev => prev + 1);
          setElements(history[historyIndex + 1]);
      }
  };

  // --- Actions ---
  const centerView = () => {
      setViewport({ x: 0, y: 0, scale: 1 });
  };

  const addElement = (type: GardenElement['type'], subType?: any, crop?: Crop) => {
    // Center of viewport logic
    const viewportCenterX = -viewport.x / viewport.scale + (canvasRef.current?.clientWidth || 800) / (2 * viewport.scale);
    const viewportCenterY = -viewport.y / viewport.scale + (canvasRef.current?.clientHeight || 600) / (2 * viewport.scale);
    const gridX = Math.round(viewportCenterX / GRID_SIZE);
    const gridY = Math.round(viewportCenterY / GRID_SIZE);

    let w = 4, h = 4;
    if (type === 'plant') { w=1; h=1; }
    else if (subType === 'house') { w=20; h=15; }
    else if (subType === 'shed') { w=8; h=6; }
    else if (subType === 'raised_bed') { w=4; h=8; }
    else if (subType === 'pot') { w=2; h=2; }
    else if (subType === 'path') { w=2; h=4; }
    else if (subType === 'basic_tree') { w=5; h=5; }

    const newEl: GardenElement = {
      id: crypto.randomUUID(),
      type, subType,
      name: crop?.name || (subType ? subType.replace('_', ' ') : type),
      x: gridX - Math.floor(w/2),
      y: gridY - Math.floor(h/2),
      width: w, height: h,
      rotation: 0,
      plantingDate: type === 'plant' ? currentDate : undefined,
      cropId: crop?.id,
      color: type === 'structure' ? ['#fecaca', '#fed7aa', '#d9f99d', '#bfdbfe'][Math.floor(Math.random()*4)] : undefined
    };

    const next = [...elements, newEl];
    commitToHistory(next);
    setSelectedId(newEl.id);
  };

  const updateElement = (id: string, updates: Partial<GardenElement>, commit = true) => {
      const next = elements.map(el => el.id === id ? { ...el, ...updates } : el);
      if (commit) commitToHistory(next);
      else setElements(next);
  };

  const deleteSelected = () => {
      if (!selectedId) return;
      commitToHistory(elements.filter(e => e.id !== selectedId));
      setSelectedId(null);
  };

  // --- Interaction Handlers (Window Level) ---
  const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!dragRef.current.isDragging && !dragRef.current.isResizing && !dragRef.current.isPanning) return;

      const { isPanning, isDragging, isResizing, startX, startY, initialVP, initialEl } = dragRef.current;
      const zoom = viewport.scale;

      if (isPanning) {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          setViewport({ ...viewport, x: initialVP.x + dx, y: initialVP.y + dy });
          return;
      }

      if (selectedId && initialEl) {
          // Convert screen delta to grid units
          const screenDx = e.clientX - startX;
          const screenDy = e.clientY - startY;
          const gridDx = screenDx / (GRID_SIZE * zoom);
          const gridDy = screenDy / (GRID_SIZE * zoom);

          if (isDragging) {
              updateElement(selectedId, {
                  x: initialEl.x + gridDx,
                  y: initialEl.y + gridDy
              }, false); // Don't commit yet
          } else if (isResizing) {
              updateElement(selectedId, {
                  width: Math.max(1, Math.round(initialEl.w + gridDx)),
                  height: Math.max(1, Math.round(initialEl.h + gridDy))
              }, false);
          }
      }
  }, [selectedId, viewport, elements]); 

  const handleMouseUp = useCallback(() => {
      if (dragRef.current.isDragging || dragRef.current.isResizing) {
          if (selectedId) {
              setElements(prevElements => {
                  const el = prevElements.find(e => e.id === selectedId);
                  if (el) {
                      const snapped = prevElements.map(e => e.id === selectedId ? { ...e, x: Math.round(e.x), y: Math.round(e.y) } : e);
                      return snapped;
                  }
                  return prevElements;
              });
              
              const el = elements.find(e => e.id === selectedId);
              if (el) {
                  const snapped = elements.map(e => e.id === selectedId ? { ...e, x: Math.round(e.x), y: Math.round(e.y) } : e);
                  commitToHistory(snapped);
              }
          }
      }
      dragRef.current = { isDragging: false, isResizing: false, isPanning: false, startX: 0, startY: 0, initialVP: {x:0,y:0}, initialEl: null };
  }, [selectedId, elements]);

  // Attach window listeners when dragging starts
  useEffect(() => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      }
  }, [handleMouseMove, handleMouseUp]);


  const onMouseDown = (e: React.MouseEvent, id?: string, type?: 'resize' | 'drag') => {
    // 0 = Left click, 1 = Middle click
    const isMiddleClick = e.button === 1;
    const isSpacePressed = isSpacePressedRef.current;

    if (isMiddleClick || isSpacePressed || (!id && !type)) {
        dragRef.current.isPanning = true;
        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
        dragRef.current.initialVP = { ...viewport };
        return;
    }

    if (id) {
        e.stopPropagation();
        setSelectedId(id);
        const el = elements.find(el => el.id === id);
        if (!el) return;

        dragRef.current.startX = e.clientX;
        dragRef.current.startY = e.clientY;
        dragRef.current.initialEl = { x: el.x, y: el.y, w: el.width, h: el.height };
        
        if (type === 'resize') dragRef.current.isResizing = true;
        else dragRef.current.isDragging = true;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
          e.preventDefault(); // Prevent browser zoom
          const scaleAmount = -e.deltaY * 0.001;
          const newScale = Math.min(Math.max(0.2, viewport.scale + scaleAmount), 3);
          setViewport(prev => ({ ...prev, scale: newScale }));
      } else {
          // Pan
          setViewport(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
      }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 overflow-hidden relative select-none">
        
        {/* Top Controls */}
        <div className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                <ToolbarButton active={activeTab === 'beds'} onClick={() => setActiveTab('beds')} icon={<Box size={18} />} label="Garden Beds" />
                <ToolbarButton active={activeTab === 'structures'} onClick={() => setActiveTab('structures')} icon={<Home size={18} />} label="Structures" />
                <ToolbarButton active={activeTab === 'plants'} onClick={() => setActiveTab('plants')} icon={<Flower2 size={18} />} label="Plants" />
                <ToolbarButton active={activeTab === 'zones'} onClick={() => setActiveTab('zones')} icon={<Sun size={18} />} label="Zones" />
            </div>
            
            <div className="flex items-center gap-2">
                <div className="flex bg-stone-100 rounded-lg p-1 mr-2">
                    <button onClick={undo} disabled={historyIndex <= 0} className="p-2 hover:bg-white rounded-md disabled:opacity-30 transition-all shadow-sm"><Undo size={18} /></button>
                    <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-white rounded-md disabled:opacity-30 transition-all shadow-sm"><Redo size={18} /></button>
                </div>
                <div className="flex bg-stone-100 rounded-lg p-1">
                    <button onClick={() => setViewport(p => ({...p, scale: Math.max(0.2, p.scale - 0.2)}))} className="p-2 hover:bg-white rounded-md transition-all shadow-sm"><ZoomOut size={18} /></button>
                    <span className="px-2 py-2 text-xs font-mono text-stone-500 w-12 text-center">{Math.round(viewport.scale * 100)}%</span>
                    <button onClick={() => setViewport(p => ({...p, scale: Math.min(3, p.scale + 0.2)}))} className="p-2 hover:bg-white rounded-md transition-all shadow-sm"><ZoomIn size={18} /></button>
                </div>
                <button onClick={centerView} className="p-2.5 bg-stone-100 text-stone-600 hover:bg-white hover:text-emerald-600 rounded-lg transition-colors shadow-sm ml-2" title="Center View">
                   <Focus size={20} />
                </button>
                <button 
                    onClick={() => setShow3D(true)} 
                    className="ml-2 bg-stone-800 text-white p-2.5 rounded-lg hover:bg-stone-700 transition-colors shadow-lg"
                    title="View in 3D"
                >
                    <Cuboid size={20} />
                </button>
            </div>
        </div>

        {/* Main Workspace */}
        <div className="flex flex-1 overflow-hidden relative">
            
            {/* Sidebar Tools */}
            <div className="w-64 bg-white border-r border-stone-200 overflow-y-auto p-4 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-all">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 px-1">{activeTab} Library</h3>
                
                <div className="space-y-3 animate-fadeIn">
                    {activeTab === 'beds' && (
                        <>
                            <ElementButton onClick={() => addElement('bed', 'raised_bed')} icon={<Box />} label="Raised Bed" color="bg-amber-700" />
                            <ElementButton onClick={() => addElement('bed', 'ground_bed')} icon={<Minimize2 />} label="Ground Patch" color="bg-stone-600" />
                            <ElementButton onClick={() => addElement('bed', 'pot')} icon={<CircleIcon />} label="Planter Pot" color="bg-orange-600" />
                            <ElementButton onClick={() => addElement('bed', 'greenhouse')} icon={<Warehouse />} label="Greenhouse" color="bg-sky-500" />
                        </>
                    )}
                    
                    {activeTab === 'structures' && (
                        <>
                            <ElementButton onClick={() => addElement('structure', 'house')} icon={<Home />} label="House" color="bg-rose-500" />
                            <ElementButton onClick={() => addElement('structure', 'shed')} icon={<Warehouse />} label="Shed" color="bg-amber-600" />
                            <ElementButton onClick={() => addElement('structure', 'basic_tree')} icon={<Trees />} label="Tree" color="bg-emerald-600" />
                            <ElementButton onClick={() => addElement('structure', 'path')} icon={<GripHorizontal />} label="Stone Path" color="bg-stone-400" />
                            <ElementButton onClick={() => addElement('structure', 'fence')} icon={<GripHorizontal />} label="Fence" color="bg-orange-400" />
                        </>
                    )}

                    {activeTab === 'plants' && (
                        <div className="space-y-2">
                            {INITIAL_CROPS.map(crop => (
                                <div key={crop.id} className="flex gap-1 group">
                                    <button
                                        onClick={() => addElement('plant', null, crop)}
                                        className="flex-1 flex items-center gap-3 p-2 bg-white rounded-xl border border-stone-100 hover:border-emerald-300 hover:bg-emerald-50 text-left transition-all relative overflow-hidden"
                                    >
                                        <span className="text-2xl z-10">{crop.icon}</span>
                                        <div className="z-10">
                                            <div className="text-sm font-medium text-stone-800">{crop.name}</div>
                                            <div className="text-[10px] text-stone-500">{crop.daysToMaturity} days</div>
                                        </div>
                                        {crop.coldHardy && <Snowflake size={14} className="absolute right-2 top-2 text-blue-200" />}
                                    </button>
                                    <button 
                                        onClick={() => { setViewCrop(crop); setViewVariety(crop.varieties?.[0] || null); }}
                                        className="p-2 text-stone-300 hover:text-emerald-600 hover:bg-stone-100 rounded-lg transition-colors"
                                    >
                                        <Info size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'zones' && (
                         <>
                            <ElementButton onClick={() => addElement('zone', 'full')} icon={<Sun />} label="Full Sun Zone" color="bg-yellow-500" />
                            <ElementButton onClick={() => addElement('zone', 'partial')} icon={<CloudSun />} label="Partial Shade" color="bg-orange-400" />
                            <ElementButton onClick={() => addElement('zone', 'shade')} icon={<Cloud />} label="Full Shade" color="bg-blue-500" />
                        </>
                    )}
                </div>
            </div>

            {/* Canvas */}
            <div 
                ref={canvasRef}
                className="flex-1 relative overflow-hidden cursor-crosshair bg-stone-100"
                onMouseDown={(e) => onMouseDown(e)}
                onWheel={handleWheel}
                style={{ 
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                    backgroundSize: `${GRID_SIZE * viewport.scale}px ${GRID_SIZE * viewport.scale}px`,
                    backgroundPosition: `${viewport.x}px ${viewport.y}px`
                }}
            >
                <div 
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`
                    }}
                >
                    {elements.map(el => (
                        <CanvasElement
                            key={el.id}
                            element={el}
                            isSelected={selectedId === el.id}
                            viewportScale={viewport.scale}
                            currentDate={currentDate}
                            onMouseDown={onMouseDown}
                            onTouchStart={() => {}}
                        />
                    ))}
                </div>

                {/* Canvas Overlay Hints */}
                <div className="absolute bottom-4 left-4 pointer-events-none bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-mono text-stone-500 flex items-center gap-2 border border-stone-200">
                    <Move size={12}/> Space + Drag to Pan • Scroll to Zoom
                </div>
            </div>

            {/* Right Panel (Properties) */}
            {selectedId && elements.find(e => e.id === selectedId) && (
                <ElementProperties
                    element={elements.find(e => e.id === selectedId)!}
                    onUpdate={(u) => updateElement(selectedId, u)}
                    onDelete={deleteSelected}
                    onDuplicate={() => {
                        const original = elements.find(e => e.id === selectedId);
                        if (original) {
                            const copy = { ...original, id: crypto.randomUUID(), x: original.x + 2, y: original.y + 2 };
                            commitToHistory([...elements, copy]);
                            setSelectedId(copy.id);
                        }
                    }}
                    onMoveLayer={(dir) => {
                        const idx = elements.findIndex(e => e.id === selectedId);
                        if (idx === -1) return;
                        const copy = [...elements];
                        if (dir === 'up' && idx < elements.length - 1) {
                            [copy[idx], copy[idx+1]] = [copy[idx+1], copy[idx]];
                        } else if (dir === 'down' && idx > 0) {
                            [copy[idx], copy[idx-1]] = [copy[idx-1], copy[idx]];
                        }
                        commitToHistory(copy);
                    }}
                    currentDate={currentDate}
                />
            )}
        </div>

        {/* Modals */}
        {show3D && <Garden3DView elements={elements} onClose={() => setShow3D(false)} />}
        {viewCrop && (
            <CropInfoModal 
                crop={viewCrop} 
                selectedVariety={viewVariety} 
                onSelectVariety={setViewVariety} 
                onClose={() => setViewCrop(null)} 
                onAskAI={onAskAI}
            />
        )}

    </div>
  );
};
