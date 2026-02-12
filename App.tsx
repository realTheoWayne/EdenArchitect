import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Sprout,
  LayoutGrid,
  Calendar as CalendarIcon,
  Play,
  Pause,
  Home,
  MessageSquare,
  Settings,
  LogOut,
  Mail
} from 'lucide-react';

import { PlannerCanvas } from './components/PlannerCanvas';
import CalendarView from './components/CalendarView';
import AIConsultant from './components/AIConsultant';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';

import { getAlmanacPrediction } from './services/geminiService';
import { GardenElement, GardenTask, GardenSettings, CustomScheduleItem, ViewMode } from './types';

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

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(normalizeEmail(email));

const trackProfile = (email: string) => {
  try {
    const normalized = normalizeEmail(email);
    const existing = JSON.parse(localStorage.getItem('eden_profiles') || '[]') as string[];
    if (!existing.includes(normalized)) {
      localStorage.setItem('eden_profiles', JSON.stringify([...existing, normalized]));
    }
  } catch (error) {
    console.warn('Could not track profile list.', error);
  }
};

const getProfileStorageKey = (email: string | null, baseKey: string) => {
  const scope = email ? `eden_profile_${normalizeEmail(email)}` : 'eden_profile_guest';
  return `${scope}_${baseKey}`;
};

const migrateLegacyKey = <T,>(scopedKey: string, legacyKey: string) => {
  const hasScoped = localStorage.getItem(scopedKey) !== null;
  const legacy = localStorage.getItem(legacyKey);
  if (!hasScoped && legacy !== null) {
    localStorage.setItem(scopedKey, legacy);
  }
};

const useScopedLocalStorage = <T,>(
  email: string | null,
  baseKey: string,
  legacyKey: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const storageKey = useMemo(() => getProfileStorageKey(email, baseKey), [email, baseKey]);
  const initialRef = useRef(initialValue);
  const [state, setState] = useState<T>(initialRef.current);

  useEffect(() => {
    try {
      migrateLegacyKey<T>(storageKey, legacyKey);
      const item = localStorage.getItem(storageKey);
      setState(item ? JSON.parse(item) : initialRef.current);
    } catch (error) {
      console.warn(`Error reading scoped localStorage key "${storageKey}":`, error);
      setState(initialRef.current);
    }
  }, [storageKey, legacyKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error writing scoped localStorage key "${storageKey}":`, error);
    }
  }, [storageKey, state]);

  return [state, setState];
};

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

const App: React.FC = () => {
  const persistedLastUser = typeof window !== 'undefined' ? localStorage.getItem('eden_last_user') : null;

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(persistedLastUser));
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(persistedLastUser);
  const [emailInput, setEmailInput] = useState(persistedLastUser || '');
  const [loginError, setLoginError] = useState('');

  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [showSettings, setShowSettings] = useState(false);

  const [settings, setSettings] = useScopedLocalStorage<GardenSettings>(currentUserEmail, 'settings', 'eden_settings', DEFAULT_SETTINGS);
  const [elements, setElements] = useScopedLocalStorage<GardenElement[]>(currentUserEmail, 'elements', 'eden_elements', []);
  const [tasks, setTasks] = useScopedLocalStorage<GardenTask[]>(currentUserEmail, 'tasks', 'eden_tasks', DEFAULT_TASKS);
  const [customItems, setCustomItems] = useScopedLocalStorage<CustomScheduleItem[]>(currentUserEmail, 'custom_items', 'eden_custom_items', []);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [simulationDate, setSimulationDate] = useState(today);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [consultantPrompt, setConsultantPrompt] = useState('');
  const [almanacData, setAlmanacData] = useState<any>(null);

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

  useEffect(() => {
    if (isLoggedIn && !almanacData) {
      getAlmanacPrediction(settings.zone, today)
        .then(setAlmanacData)
        .catch(console.error);
    }
  }, [isLoggedIn, settings.zone, today, almanacData]);

  const handleEmailLogin = () => {
    const normalized = normalizeEmail(emailInput);
    if (!isValidEmail(normalized)) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    setLoginError('');
    setCurrentUserEmail(normalized);
    setIsLoggedIn(true);
    localStorage.setItem('eden_last_user', normalized);
    trackProfile(normalized);
    setCurrentView('dashboard');
    setAlmanacData(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
    setIsPlaying(false);
    setSimulationDate(today);
    setAlmanacData(null);
  };

  const togglePlayback = () => setIsPlaying(p => !p);
  const toggleSpeed = () => setPlaybackSpeed(s => (s === 1 ? 7 : 1));

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-full bg-[#fdfbf7] flex flex-col items-center justify-center relative overflow-hidden">
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
          <p className="text-stone-500 mb-8 text-lg font-light">Create your profile with email to save and resume your garden anytime.</p>

          <div className="space-y-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@example.com"
                className="w-full py-3.5 pl-10 pr-4 bg-white border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            {loginError && <p className="text-left text-sm text-rose-500">{loginError}</p>}

            <button
              onClick={handleEmailLogin}
              className="w-full py-3.5 px-6 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              Continue with Email
            </button>
            <p className="text-xs text-stone-400">Your planner, calendar, settings, and tasks are auto-saved to this profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#fdfbf7] text-stone-800">
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
          <span className="hidden lg:inline text-xs text-stone-500 mr-2">{currentUserEmail}</span>
          <NavButton icon={<Home size={20} />} active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} label="Dashboard" />
          <NavButton icon={<LayoutGrid size={20} />} active={currentView === 'planner'} onClick={() => setCurrentView('planner')} label="Planner" />
          <NavButton icon={<CalendarIcon size={20} />} active={currentView === 'calendar'} onClick={() => setCurrentView('calendar')} label="Calendar" />
          <NavButton icon={<MessageSquare size={20} />} active={currentView === 'consultant'} onClick={() => setCurrentView('consultant')} label="AI Consultant" />

          <div className="w-px h-8 bg-stone-200 mx-2 hidden md:block"></div>

          <button onClick={() => setShowSettings(true)} className="p-2 text-stone-400 hover:text-emerald-600 transition-colors"><Settings size={20} /></button>
          <button onClick={handleLogout} className="p-2 text-stone-400 hover:text-rose-500 transition-colors" title="Log out"><LogOut size={20} /></button>
        </div>
      </nav>

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
