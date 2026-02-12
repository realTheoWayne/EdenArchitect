import React, { useState, useRef, useEffect } from 'react';
import { askGardenAssistant } from '../services/geminiService';
import { GardenSettings, GardenTask, GardenElement } from '../types';
import { Send, Bot, User, Sprout, CheckCircle2, Circle, Plus, ListTodo } from 'lucide-react';

interface AIConsultantProps {
  settings: GardenSettings;
  tasks: GardenTask[];
  setTasks: React.Dispatch<React.SetStateAction<GardenTask[]>>;
  initialPrompt?: string;
  setInitialPrompt?: (val: string) => void;
  gardenElements: GardenElement[];
  currentDate: string;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ settings, tasks, setTasks, initialPrompt, setInitialPrompt, gardenElements, currentDate }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: `Hello! I see you're in Zone ${settings.zone} with ${settings.soilType} soil. I've analyzed your current garden plan. How can I help you today?` }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [newTaskInput, setNewTaskInput] = useState('');

  useEffect(() => {
    if (initialPrompt) {
        setInput(initialPrompt);
        if (setInitialPrompt) setInitialPrompt(''); // Clear after setting
    }
  }, [initialPrompt, setInitialPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const context = {
        zone: settings.zone,
        soilType: settings.soilType,
        gardenElements: gardenElements,
        currentDate: currentDate,
        averageHumidity: settings.averageHumidity,
        soilPh: settings.soilPh
    };

    const response = await askGardenAssistant(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask: GardenTask = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTaskInput,
        date: new Date().toISOString(),
        completed: false,
        type: 'care'
    };
    setTasks([...tasks, newTask]);
    setNewTaskInput('');
  };

  return (
    <div className="flex h-full bg-stone-50 p-4 max-w-6xl mx-auto w-full gap-4">
      
      {/* Left Column: Chat */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
            <Sprout />
          </div>
          <div>
            <h2 className="text-white font-bold font-serif">Garden Consultant</h2>
            <p className="text-emerald-200 text-xs">Powered by Gemini AI • Zone {settings.zone} • {settings.soilType}</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${msg.role === 'ai' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}
              `}>
                {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`
                max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${msg.role === 'ai' 
                  ? 'bg-stone-100 text-stone-800 rounded-tl-none' 
                  : 'bg-emerald-600 text-white rounded-tr-none shadow-md'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {loading && (
             <div className="flex gap-3">
               <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                 <Bot size={18} />
               </div>
               <div className="bg-stone-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                 <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about soil, crops, or pests..."
              className="flex-1 border border-stone-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm shadow-sm"
              disabled={loading}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Tasks */}
      <div className="w-80 bg-white rounded-xl shadow-sm border border-stone-200 flex flex-col overflow-hidden hidden md:flex">
         <div className="bg-stone-100 p-4 border-b border-stone-200 flex items-center gap-2">
            <ListTodo size={20} className="text-stone-600"/>
            <h3 className="font-bold text-stone-800 font-serif">Action Plan</h3>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2">
             {tasks.map(task => (
                 <button 
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 group relative overflow-hidden
                        ${task.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-stone-200 hover:border-emerald-300'}
                    `}
                 >
                    <div className={`mt-0.5 transition-colors ${task.completed ? 'text-emerald-600' : 'text-stone-300 group-hover:text-emerald-400'}`}>
                        {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </div>
                    <span className={`text-sm ${task.completed ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                        {task.title}
                    </span>
                    {/* Simple animation effect element */}
                    {task.completed && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></div>
                        </div>
                    )}
                 </button>
             ))}
         </div>
         <div className="p-3 bg-stone-50 border-t border-stone-200">
             <div className="flex gap-2">
                 <input 
                    type="text" 
                    placeholder="Add task..." 
                    className="flex-1 bg-white border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                 />
                 <button onClick={addTask} className="bg-stone-200 text-stone-700 p-2 rounded hover:bg-stone-300">
                     <Plus size={18} />
                 </button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default AIConsultant;
