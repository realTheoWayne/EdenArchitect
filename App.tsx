import React, { useEffect, useState, useMemo } from 'react';
import {
  Sprout,
  LayoutGrid,
  Calendar as CalendarIcon,
  Play,
  Pause,
  Home,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';

import { PlannerCanvas } from './components/PlannerCanvas';
import CalendarView from './components/CalendarView';
import AIConsultant from './components/AIConsultant';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';

import { getAlmanacPrediction } from './services/geminiService';
import { GardenElement, GardenTask, GardenSettings, CustomScheduleItem, ViewMode } from './types';

// --- Default Configuration ---
const DEFAULT_SETTINGS: GardenSettings = {
    zone: '6b',
    soilType: 'loam',
    firstFrostDate: '2025-10-15',
    lastFrostDate: '2025-05-15',
    width: 25,
    height: 20,
    averageHumidity: 50,
    soilPh: 6.5
};

const DEFAULT_TASKS: GardenTask[] = [
    { id: '1', title: 'Test Soil pH', date: new Date().toISOString(), completed: false, type: 'care' },
    { id: '2', title: 'Amend with compost', date: new Date().toISOString(), completed: false, type: 'care' },
];

// --- Helper: Safe Local Storage ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

// --- Helper Components ---
const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label?: string }) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
      active 
        ? 'bg-emerald-100 text-emerald-800 shadow-sm ring-1 ring-emerald-200' 
        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
    }`}
  >
    {icon}
  </button>
);

// --- Main Component ---
const App: React.FC = () => {
  // Application State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  
  // Data State
  const [settings, setSettings] = useLocalStorage<GardenSettings>('eden_settings', DEFAULT_SETTINGS);
  const [elements, setElements] = useLocalStorage<GardenElement[]>('eden_elements', []);
  const [tasks, setTasks] = useLocalStorage<GardenTask[]>('eden_tasks', DEFAULT_TASKS);
  const [customItems, setCustomItems] = useLocalStorage<CustomScheduleItem[]>('eden_custom_items', []);

  // Simulation & AI State
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [simulationDate, setSimulationDate] = useState(today);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [consultantPrompt, setConsultantPrompt] = useState('');
  const [almanacData, setAlmanacData] = useState<any>(null);

  // --- Effects ---

  // Simulation Loop
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setSimulationDate(prev => {
          const d = new Date(prev);
          d.setDate(d.getDate() + playbackSpeed);
          return d.toISOString().split('T')[0];
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Initial Weather Fetch
  useEffect(() => {
    if (isLoggedIn && !almanacData) {
      getAlmanacPrediction(settings.zone, today)
        .then(setAlmanacData)
        .catch(console.error);
    }
  }, [isLoggedIn, settings.zone, today, almanacData]);

  // --- Handlers ---
  const handleLogin = () => setIsLoggedIn(true);
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
    setIsPlaying(false);
    setSimulationDate(today);
  };

  const togglePlayback = () => setIsPlaying(p => !p);
  const toggleSpeed = () => setPlaybackSpeed(s => (s === 1 ? 7 : 1));

  // --- Render ---

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-full bg-[#fdfbf7] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
           <div className="absolute top-20 left-20 text-9xl">🌿</div>
           <div className="absolute bottom-20 right-20 text-9xl">🌻</div>
           <div className="absolute top-1/2 left-1/4 text-8xl">🥕</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-xl border border-white/50 text-center z-10 max-w-md w-full animate-fadeIn">
          <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-inner">
            <Sprout size={48} />
          </div>
          <h1 className="text-5xl font-serif font-bold text-emerald-900 mb-3 tracking-tight">Eden Architect</h1>
          <p className="text-stone-500 mb-8 text-lg font-light">Design, plan, and grow your perfect garden.</p>
          
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full py-3.5 px-6 bg-white border border-stone-200 rounded-xl flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors text-stone-700 font-medium shadow-sm"
            >
               Continue with Google
            </button>
            <button
              onClick={handleLogin}
              className="w-full py-3.5 px-6 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              Enter as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#fdfbf7] text-stone-800">
      {/* Navigation Bar */}
      <nav className="h-20 bg-white border-b border-stone-100 flex items-center justify-between px-6 shrink-0 z-50 shadow-sm relative">
        <div 
          className="flex items-center gap-3 font-serif text-2xl font-bold text-emerald-900 cursor-pointer select-none"
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
            <Sprout size={24} />
          </div>
          <span className="hidden md:inline">Eden</span>
        </div>

        {/* Simulation Controls (Visible in Planner) */}
        {currentView === 'planner' && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-4 bg-stone-50 px-4 py-2 rounded-2xl border border-stone-200 shadow-inner">
             <button onClick={togglePlayback} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-stone-600 hover:text-emerald-600">
               {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
             </button>
             
             <div className="flex flex-col w-48 gap-1">
                <input 
                  type="range" 
                  className="w-full h-1.5 bg-emerald-100 rounded-full appearance-none cursor-pointer accent-emerald-500"
                  min={new Date(today).getTime()} 
                  max={new Date('2026-01-01').getTime()}
                  step={86400000}
                  value={new Date(simulationDate).getTime()}
                  onChange={(e) => setSimulationDate(new Date(Number(e.target.value)).toISOString().split('T')[0])}
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                   <span>{simulationDate}</span>
                   <button onClick={toggleSpeed} className="hover:text-emerald-600 transition-colors">{playbackSpeed}x Speed</button>
                </div>
             </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <NavButton icon={<Home size={20} />} active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} label="Dashboard" />
          <NavButton icon={<LayoutGrid size={20} />} active={currentView === 'planner'} onClick={() => setCurrentView('planner')} label="Planner" />
          <NavButton icon={<CalendarIcon size={20} />} active={currentView === 'calendar'} onClick={() => setCurrentView('calendar')} label="Calendar" />
          <NavButton icon={<MessageSquare size={20} />} active={currentView === 'consultant'} onClick={() => setCurrentView('consultant')} label="AI Consultant" />
          
          <div className="w-px h-8 bg-stone-200 mx-2 hidden md:block"></div>
          
          <button onClick={() => setShowSettings(true)} className="p-2 text-stone-400 hover:text-emerald-600 transition-colors"><Settings size={20} /></button>
          <button onClick={handleLogout} className="p-2 text-stone-400 hover:text-rose-500 transition-colors"><LogOut size={20} /></button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-stone-50/50">
        {currentView === 'dashboard' && (
          <Dashboard 
            settings={settings}
            almanac={almanacData}
            today={today}
            onNavigate={setCurrentView}
          />
        )}
        
        {currentView === 'planner' && (
          <PlannerCanvas
            elements={elements}
            setElements={setElements}
            currentDate={simulationDate}
            onAskAI={(q) => {
              setConsultantPrompt(q);
              setCurrentView('consultant');
            }}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            customItems={customItems}
            setCustomItems={setCustomItems}
            gardenElements={elements}
            settings={settings}
          />
        )}

        {currentView === 'consultant' && (
          <AIConsultant
            settings={settings}
            tasks={tasks}
            setTasks={setTasks}
            initialPrompt={consultantPrompt}
            setInitialPrompt={setConsultantPrompt}
            gardenElements={elements}
            currentDate={simulationDate}
          />
        )}
      </main>

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          setShowSettings(false);
        }}
      />
    </div>
  );
};

export default App;
