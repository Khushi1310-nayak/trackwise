import React, { useState, useEffect, useMemo } from 'react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  Github,
  ExternalLink,
  Trash2,
  Edit3,
  X,
  Trophy,
  Code2,
  Briefcase,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Rocket,
  Link as LinkIcon,
  Users,
  Target,
  BarChart3,
  Layers,
  Server,
  Database as DbIcon,
  Globe,
  Cloud,
  AlertTriangle,
  ChevronLeft,
  MapPin,
  CalendarDays
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';

import { 
  Hackathon, 
  Project, 
  Internship, 
  HackathonStatus, 
  ProjectStatus, 
  InternshipStatus,
  TrackType,
  TechStack
} from './types';
import { 
  NAV_ITEMS, 
  STATUS_COLORS, 
  STATUS_ICONS 
} from './constants';
import { getBuilderAdvice } from './geminiService';

// --- Local Storage Helpers ---
const STORAGE_KEY = 'trackwise_v3_data';
const loadData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return { hackathons: [], projects: [], internships: [] };
};
const saveData = (data: any) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

// --- Sub-components ---

const Badge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 uppercase tracking-widest ${STATUS_COLORS[status] || 'bg-slate-500/10 text-slate-400'}`}>
    {STATUS_ICONS[status]}
    {status}
  </span>
);

const Sidebar: React.FC<{ activeTab: TrackType, onTabChange: (tab: TrackType) => void }> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  return (
    <aside className="w-64 border-r border-white/5 hidden lg:flex flex-col h-screen sticky top-0 bg-black/20 backdrop-blur-3xl">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            TW
          </div>
          <h1 className="text-2xl font-black tracking-tighter cyan-glow">Trackwise</h1>
        </div>
        
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id as TrackType);
                navigate(item.id === 'dashboard' ? '/' : `/${item.id}`);
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-white/10 text-cyan-400 border border-white/10 shadow-inner' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400 transition-colors'}`}>
                {item.icon}
              </span>
              <span className="font-semibold tracking-tight">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto animate-pulse" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-2xl p-5 border border-white/10 backdrop-blur-xl">
          <p className="text-[10px] text-cyan-400 mb-2 uppercase tracking-widest font-black">Builder Mindset</p>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">Ship early, fail fast, iterate constantly.</p>
        </div>
      </div>
    </aside>
  );
};

const MobileNav: React.FC<{ activeTab: TrackType, onTabChange: (tab: TrackType) => void }> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 px-2 sm:px-4 py-2 flex items-center justify-around shadow-2xl">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            onTabChange(item.id as TrackType);
            navigate(item.id === 'dashboard' ? '/' : `/${item.id}`);
          }}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 flex-1 ${
            activeTab === item.id ? 'text-cyan-400 bg-white/5 scale-105' : 'text-slate-500'
          }`}
        >
          {/* Fix: Casting to React.ReactElement<any> to resolve TypeScript error where 'size' property is not recognized on generic ReactElement during cloneElement */}
          {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
          <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-tighter truncate w-full text-center">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const Header: React.FC<{ title: string; subtitle: string; onAdd?: () => void }> = ({ title, subtitle, onAdd }) => (
  <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-10">
    <div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight cyan-glow">{title}</h2>
      <p className="text-slate-400 mt-1 font-medium text-xs sm:text-sm md:text-base leading-relaxed">{subtitle}</p>
    </div>
    {onAdd && (
      <button 
        onClick={onAdd}
        className="glass-btn flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all w-full md:w-auto text-sm"
      >
        <Plus size={18} />
        Add Entry
      </button>
    )}
  </header>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`track-card rounded-2xl p-4 sm:p-5 md:p-6 ${className}`}>
    {children}
  </div>
);

const TechStackDisplay: React.FC<{ stack: TechStack }> = ({ stack }) => {
  const items = [
    { label: 'FE', value: stack?.frontend, icon: <Layers size={10} /> },
    { label: 'BE', value: stack?.backend, icon: <Server size={10} /> },
    { label: 'DB', value: stack?.databases, icon: <DbIcon size={10} /> },
    { label: 'API', value: stack?.apis, icon: <Globe size={10} /> },
    { label: 'OPS', value: stack?.devops, icon: <Cloud size={10} /> },
  ].filter(i => i.value && i.value.trim() !== "");

  if (items.length === 0) return <span className="text-[10px] text-slate-500 italic">No tech stack added</span>;

  return (
    <div className="flex flex-wrap gap-1 md:gap-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5 px-2 py-0.5 md:py-1 rounded bg-white/5 border border-white/5" title={`${item.label}: ${item.value}`}>
          <span className="text-cyan-400">{item.icon}</span>
          <span className="text-[9px] font-black uppercase text-slate-300 truncate max-w-[50px] sm:max-w-[80px]">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

// --- Feature Views ---

const DashboardView: React.FC<{ data: any, onTabChange: (tab: TrackType) => void }> = ({ data, onTabChange }) => {
  const navigate = useNavigate();
  const stats = useMemo(() => [
    { label: 'Hackathons', value: data.hackathons.length, color: 'text-cyan-400', icon: <Trophy size={20} /> },
    { label: 'Live Projects', value: data.projects.filter((p:any) => p.status !== ProjectStatus.SHIPPED).length, color: 'text-indigo-400', icon: <Code2 size={20} /> },
    { label: 'Applications', value: data.internships.length, color: 'text-pink-400', icon: <Briefcase size={20} /> },
  ], [data]);

  const upcomingDeadlines = useMemo(() => {
    const deadlines = [
      ...data.hackathons.map((h: any) => ({ name: h.name, date: h.deadline, type: 'Hackathon' })),
      ...data.internships.filter((i:any) => i.interviewDates?.length).map((i: any) => ({ name: `${i.company} Interview`, date: i.interviewDates[0], type: 'Interview' }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return deadlines.slice(0, 3);
  }, [data]);

  const unifiedChartData = useMemo(() => [
    { name: 'Hackathons', count: data.hackathons.length, color: '#06b6d4' },
    { name: 'Projects', count: data.projects.length, color: '#8b5cf6' },
    { name: 'Internships', count: data.internships.length, color: '#ec4899' },
  ], [data]);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <Header title="Mission Control" subtitle="Your journey at a glance. Keep pushing boundaries." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="flex flex-col items-center justify-center py-6 md:py-10">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${stat.color} bg-white/5 mb-4 md:mb-6 border border-white/5 shadow-inner`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest">{stat.label}</p>
            <h4 className="text-3xl md:text-5xl font-black text-white mt-1 md:mt-2 tabular-nums">{stat.value}</h4>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <Card className="h-[280px] sm:h-[350px] md:h-[400px]">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h5 className="text-base md:text-xl font-black flex items-center gap-3">
              <TrendingUp size={20} className="text-cyan-400" />
              Distribution
            </h5>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={unifiedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {unifiedChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="flex flex-col">
          <h5 className="text-base md:text-xl font-black mb-4 md:mb-8 flex items-center gap-3">
            <CalendarIcon size={20} className="text-pink-400" />
            Deadlines
          </h5>
          <div className="space-y-3">
            {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-cyan-500/30 transition-all">
                <div>
                  <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-0.5">{d.type}</p>
                  <p className="font-bold text-white text-xs sm:text-sm group-hover:text-cyan-400 transition-colors truncate max-w-[150px] sm:max-w-none">{d.name}</p>
                </div>
                <div className="text-right min-w-fit pl-2">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-300">{new Date(d.date).toLocaleDateString()}</p>
                  <p className="text-[7px] sm:text-[8px] text-slate-500 uppercase font-black">Due Date</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-500">
                <Target size={24} className="mb-3 opacity-20" />
                <p className="text-xs">No immediate deadlines.</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => { onTabChange('calendar'); navigate('/calendar'); }}
            className="mt-6 w-full glass-btn py-3 rounded-xl font-black text-[9px] md:text-xs uppercase tracking-widest active:scale-95 transition-transform"
          >
            View Full Calendar
          </button>
        </Card>
      </div>
    </div>
  );
};

const CalendarView: React.FC<{ data: any }> = ({ data }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const events = useMemo(() => {
    const list: any[] = [];
    data.hackathons.forEach((h: Hackathon) => {
      if (h.deadline) list.push({ date: new Date(h.deadline), name: h.name, type: 'Hackathon', color: 'bg-cyan-500', fullData: h });
    });
    data.internships.forEach((i: Internship) => {
      if (i.interviewDates) {
        i.interviewDates.forEach(dateStr => {
           list.push({ date: new Date(dateStr), name: `${i.company} Interview`, type: 'Interview', color: 'bg-pink-500', fullData: i });
        });
      }
    });
    return list;
  }, [data]);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <Header title="Deadlines Tracker" subtitle="Stay ahead of the competition." />
      
      <Card className="min-h-[400px] sm:min-h-[500px] flex flex-col p-2 sm:p-4 md:p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-lg md:text-2xl font-black text-white">{monthNames[month]} {year}</h3>
          <div className="flex gap-2 sm:gap-4">
            <button onClick={prevMonth} className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all"><ChevronLeft size={18} /></button>
            <button onClick={nextMonth} className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1 min-w-[300px]">
          {["S", "M", "T", "W", "T", "F", "S"].map(d => (
            <div key={d} className="text-center text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 py-1 sm:py-2">
              {d}
            </div>
          ))}
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="h-14 sm:h-20 md:h-32 bg-transparent opacity-0" />;
            const dayEvents = events.filter(e => e.date.getDate() === day && e.date.getMonth() === month && e.date.getFullYear() === year);
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            return (
              <div key={day} className={`h-14 sm:h-20 md:h-32 border border-white/5 rounded-lg sm:rounded-xl p-1 sm:p-2 transition-all hover:bg-white/5 overflow-hidden flex flex-col gap-0.5 ${isToday ? 'ring-1 ring-cyan-500/50 bg-cyan-500/5' : ''}`}>
                <span className={`text-[10px] font-bold ${isToday ? 'text-cyan-400' : 'text-slate-400'}`}>{day}</span>
                <div className="flex flex-col gap-0.5 overflow-y-auto custom-scrollbar flex-1">
                  {dayEvents.map((e, i) => (
                    <button key={i} onClick={() => setSelectedEvent(e)} className={`text-left text-[6px] sm:text-[8px] font-black uppercase px-1 py-0.5 rounded ${e.color} text-white truncate w-full shadow-sm`}>
                      {e.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* --- EVENT DETAIL MODAL --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedEvent(null)} />
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-lg relative z-10 shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 pr-4">
                <Badge status={selectedEvent.fullData.status} />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-4 tracking-tight leading-tight">{selectedEvent.name}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                  {selectedEvent.type} • {selectedEvent.fullData.organizer || selectedEvent.fullData.role}
                </p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white transition-colors p-1"><X size={20} /></button>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                 <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Key Date</p>
                    <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm"><CalendarDays size={14} className="text-cyan-400" />{selectedEvent.date.toLocaleDateString()}</div>
                 </div>
                 <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Mode</p>
                    <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm"><MapPin size={14} className="text-indigo-400" />{selectedEvent.fullData.mode || selectedEvent.fullData.location || "Remote"}</div>
                 </div>
               </div>

               {selectedEvent.fullData.techStack && (
                 <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Tech Stack</p>
                    <TechStackDisplay stack={selectedEvent.fullData.techStack} />
                 </div>
               )}

               <div className="pt-6 border-t border-white/5">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Notes</p>
                 <p className="text-slate-400 text-xs sm:text-sm italic leading-relaxed">{selectedEvent.fullData.notes || "No additional notes."}</p>
               </div>
            </div>

            <button onClick={() => setSelectedEvent(null)} className="w-full mt-8 py-3.5 sm:py-4 rounded-2xl bg-cyan-600 text-white font-black uppercase text-[10px] sm:text-xs tracking-[0.2em] shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- View Component Props ---
interface TrackViewProps<T> {
  data: T[];
  onUpdate: (item: T) => void;
  onDelete: (item: T) => void;
  onEdit: (item: T) => void;
}

// --- View: Hackathons ---
const HackathonsView: React.FC<TrackViewProps<Hackathon>> = ({ data, onUpdate, onDelete, onEdit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {data.length > 0 ? data.map(h => (
        <Card key={h.id} className="group flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <Badge status={h.status} />
            <div className="flex gap-1.5">
              <button onClick={() => onEdit(h)} className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all"><Edit3 size={16} /></button>
              <button onClick={() => onDelete(h)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
            </div>
          </div>
          <h4 className="text-lg md:text-xl font-black text-white mb-1 group-hover:text-cyan-400 transition-colors leading-tight">{h.name}</h4>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-4">{h.organizer} • {h.mode}</p>
          
          <div className="mb-4">
            <TechStackDisplay stack={h.techStack} />
          </div>

          <div className="space-y-2 mb-6 text-[11px] sm:text-xs">
             <div className="flex items-center gap-2.5 text-slate-400"><CalendarIcon size={12} className="text-cyan-400" /><span>Starts: {new Date(h.startDate).toLocaleDateString()}</span></div>
             {h.repoUrl && (<a href={h.repoUrl} target="_blank" className="flex items-center gap-2.5 text-indigo-400 hover:text-indigo-300"><Github size={12} /><span>Repo</span></a>)}
          </div>

          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <select 
              value={h.status}
              onChange={(e) => onUpdate({ ...h, status: e.target.value as HackathonStatus })}
              className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest text-slate-400 focus:ring-0 cursor-pointer p-0"
            >
              {Object.values(HackathonStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {h.demoUrl && (<a href={h.demoUrl} target="_blank" className="p-2 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"><ExternalLink size={14} /></a>)}
          </div>
        </Card>
      )) : (
        <div className="col-span-full py-16 text-center text-slate-500 border border-dashed border-white/10 rounded-3xl">
          <Trophy size={40} className="mx-auto mb-4 opacity-10" />
          <p className="font-bold text-sm">No hackathons tracked. Arena is empty.</p>
        </div>
      )}
    </div>
  );
};

// --- View: Projects ---
const ProjectsView: React.FC<TrackViewProps<Project>> = ({ data, onUpdate, onDelete, onEdit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
      {data.length > 0 ? data.map(p => (
        <Card key={p.id} className="relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2"><Badge status={p.status} /><span className="text-[9px] font-black uppercase text-slate-500">{p.type}</span></div>
            <div className="flex gap-1.5">
              <button onClick={() => onEdit(p)} className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all"><Edit3 size={16} /></button>
              <button onClick={() => onDelete(p)} className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/20 transition-all"><Trash2 size={16} /></button>
            </div>
          </div>
          <h4 className="text-lg md:text-xl font-black text-white mb-2">{p.title}</h4>
          <p className="text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed">{p.description}</p>
          <div className="mb-4"><TechStackDisplay stack={p.techStack} /></div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1.5"><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ship Progress</span><span className="text-[9px] font-black text-cyan-400">{p.progress}%</span></div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-600 transition-all duration-700" style={{ width: `${p.progress}%` }} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6">
            <a href={p.repoUrl} target="_blank" className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold transition-all"><Github size={12} /> Repo</a>
            <a href={p.demoUrl} target="_blank" className="flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold transition-all"><ExternalLink size={12} /> Live</a>
          </div>
          <div className="pt-4 border-t border-white/5">
            <select 
              value={p.status}
              onChange={(e) => onUpdate({ ...p, status: e.target.value as ProjectStatus })}
              className="bg-transparent border-none text-[9px] font-black uppercase text-slate-400 focus:ring-0 cursor-pointer p-0"
            >
              {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </Card>
      )) : (
        <div className="col-span-full py-16 text-center text-slate-500 border border-dashed border-white/10 rounded-3xl">
          <Code2 size={40} className="mx-auto mb-4 opacity-10" />
          <p className="font-bold text-sm">No projects building. Launch an idea!</p>
        </div>
      )}
    </div>
  );
};

// --- View: Insights ---
const InsightsView: React.FC<{ data: any }> = ({ data }) => {
  const [advice, setAdvice] = useState<string[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingAdvice(true);
      const context = `I have ${data.projects.length} projects and ${data.hackathons.length} hackathons. Current focus is building a professional portfolio and tracking internship applications.`;
      const result = await getBuilderAdvice(context, 'project');
      setAdvice(result);
      setLoadingAdvice(false);
    };
    fetchAdvice();
  }, [data.projects.length, data.hackathons.length]);

  const projectStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(ProjectStatus).forEach(s => counts[s] = 0);
    data.projects.forEach((p: any) => counts[p.status]++);
    const list = Object.entries(counts).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
    return list.length ? list : [{ name: 'N/A', value: 1 }];
  }, [data.projects]);

  const internshipStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(InternshipStatus).forEach(s => counts[s] = 0);
    data.internships.forEach((i: any) => counts[i.status]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data.internships]);

  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b', '#ef4444'];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <Header title="Strategic Insights" subtitle="Data-driven career engineering." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <Card className="h-[320px] sm:h-[400px] flex flex-col">
          <h5 className="text-base md:text-xl font-black mb-4 flex items-center gap-3"><Code2 size={20} className="text-indigo-400" />Project Lifecycle</h5>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={projectStatusData} innerRadius="55%" outerRadius="80%" paddingAngle={5} dataKey="value">
                  {projectStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.name === 'N/A' ? '#1e293b' : COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="h-[320px] sm:h-[400px] flex flex-col">
          <h5 className="text-base md:text-xl font-black mb-4 flex items-center gap-3"><Briefcase size={20} className="text-pink-400" />Funnel Status</h5>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={internshipStatusData} layout="vertical" margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={8} width={80} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border-cyan-500/20 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20"><Sparkles size={20} /></div>
          <div><h5 className="text-lg md:text-xl font-black text-white leading-none">AI Strategic Advice</h5><p className="text-slate-400 text-[10px] md:text-sm font-medium mt-1">Mentor's steps based on your metrics.</p></div>
        </div>
        {loadingAdvice ? (
          <div className="flex items-center gap-3 text-slate-400 py-8 px-4"><div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" /><p className="text-[9px] md:text-xs font-black uppercase tracking-widest">Generating roadmap...</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {advice.map((tip, i) => (
              <div key={i} className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-2xl font-black text-white/5 group-hover:text-cyan-500/10 transition-colors">0{i+1}</div>
                <p className="text-slate-200 text-xs leading-relaxed font-semibold relative z-10">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// --- Main Application Component ---

export default function App() {
  const [data, setData] = useState(loadData());
  const [activeTab, setActiveTab] = useState<TrackType>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TrackType>('dashboard');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, type: TrackType, name: string } | null>(null);

  useEffect(() => { saveData(data); }, [data]);

  const handleAddOrUpdate = (type: string, item: any) => {
    if (editingItem) {
      setData((prev: any) => ({ ...prev, [type]: prev[type].map((i: any) => i.id === editingItem.id ? { ...item, id: editingItem.id } : i) }));
    } else {
      setData((prev: any) => ({ ...prev, [type]: [...prev[type], { ...item, id: Date.now().toString() }] }));
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdate = (type: string, updatedItem: any) => {
    setData((prev: any) => ({ ...prev, [type]: prev[type].map((item: any) => item.id === updatedItem.id ? updatedItem : item) }));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    setData((prev: any) => ({ ...prev, [type]: prev[type].filter((item: any) => item.id !== id) }));
    setDeleteTarget(null);
  };

  const handleEdit = (type: TrackType, item: any) => { setModalType(type); setEditingItem(item); setIsModalOpen(true); };
  const openAddModal = (type: TrackType) => { setModalType(type); setEditingItem(null); setIsModalOpen(true); };

  return (
    <Router>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#020617]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-14 max-w-7xl mx-auto w-full overflow-y-auto pb-24 lg:pb-14">
          <div className="lg:hidden flex items-center mb-6 sm:mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-xs">TW</div>
              <h1 className="text-lg sm:text-xl font-black tracking-tighter cyan-glow">Trackwise</h1>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<DashboardView data={data} onTabChange={setActiveTab} />} />
            <Route path="/hackathons" element={<div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-4 duration-500"><Header title="Hackathon Arena" subtitle="Building winners, shipping code." onAdd={() => openAddModal('hackathons')} /><HackathonsView data={data.hackathons} onUpdate={(h) => handleUpdate('hackathons', h)} onDelete={(h) => setDeleteTarget({ id: h.id, type: 'hackathons', name: h.name })} onEdit={(h) => handleEdit('hackathons', h)} /></div>} />
            <Route path="/projects" element={<div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-4 duration-500"><Header title="Projects Lab" subtitle="Transforming ideas into production assets." onAdd={() => openAddModal('projects')} /><ProjectsView data={data.projects} onUpdate={(p) => handleUpdate('projects', p)} onDelete={(p) => setDeleteTarget({ id: p.id, type: 'projects', name: p.title })} onEdit={(p) => handleEdit('projects', p)} /></div>} />
            <Route path="/internships" element={<div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-4 duration-500"><Header title="Career Path" subtitle="The hunt for the next big role." onAdd={() => openAddModal('internships')} /><div className="grid grid-cols-1 gap-4">{data.internships.length > 0 ? data.internships.map((i: Internship) => (<Card key={i.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6"><div className="flex items-center gap-4 w-full sm:w-auto"><div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-cyan-400 text-sm">{i.company.charAt(0)}</div><div className="truncate flex-1"><h4 className="text-base sm:text-lg font-black text-white truncate">{i.company}</h4><p className="text-slate-400 text-[10px] sm:text-xs font-bold truncate">{i.role} • {i.location}</p></div></div><div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2"><Badge status={i.status} /><span className="text-[8px] sm:text-[9px] text-slate-500 font-black uppercase tracking-widest">Applied: {new Date(i.appliedDate).toLocaleDateString()}</span></div><div className="flex items-center justify-between w-full sm:w-auto gap-2"><select value={i.status} onChange={(e) => handleUpdate('internships', { ...i, status: e.target.value as InternshipStatus })} className="bg-white/5 border-none rounded-lg text-[9px] font-black uppercase text-slate-400 py-1.5 px-2 cursor-pointer">{Object.values(InternshipStatus).map(s => <option key={s} value={s}>{s}</option>)}</select><div className="flex items-center gap-1"><button onClick={() => handleEdit('internships', i)} className="text-slate-400 hover:text-cyan-400 p-2 rounded-lg hover:bg-cyan-500/10"><Edit3 size={16} /></button><button onClick={() => setDeleteTarget({ id: i.id, type: 'internships', name: i.company })} className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10"><Trash2 size={16} /></button></div></div></Card>)) : (<div className="flex flex-col items-center justify-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10 text-slate-500 text-center"><Briefcase size={30} className="mb-4 opacity-10" /><p className="font-bold text-xs">No career tracks active. Ship some resumes!</p></div>)}</div></div>} />
            <Route path="/calendar" element={<CalendarView data={data} />} />
            <Route path="/insights" element={<InsightsView data={data} />} />
          </Routes>
        </main>

        {/* --- DELETE CONFIRMATION --- */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-sm relative z-10 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-5 shadow-inner"><AlertTriangle size={28} /></div>
                <h3 className="text-lg font-black text-white mb-2">Confirm Removal</h3>
                <p className="text-slate-400 text-xs mb-8 leading-relaxed">Permanently delete <span className="text-white font-bold">"{deleteTarget.name}"</span>? This action is irreversible.</p>
                <div className="flex gap-3 w-full">
                  <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold text-xs hover:bg-white/10 transition-all border border-white/5">Cancel</button>
                  <button onClick={confirmDelete} className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ENTRY MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setEditingItem(null); }} />
            <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter">{editingItem ? 'Update' : 'Register'} {modalType.slice(0, -1)}</h3>
                <button onClick={() => { setIsModalOpen(false); setEditingItem(null); }} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <form className="p-6 md:p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newItem: any = {};
                const techStack: any = {};
                formData.forEach((value, key) => {
                  if (['frontend', 'backend', 'databases', 'apis', 'devops'].includes(key)) techStack[key] = value as string;
                  else if (key === 'progress') newItem[key] = parseInt(value as string);
                  else if (key === 'isPaid') newItem[key] = value === 'on';
                  else newItem[key] = value;
                });
                if (modalType === 'hackathons' || modalType === 'projects') newItem.techStack = techStack;
                handleAddOrUpdate(modalType, newItem);
              }}>
                {modalType === 'hackathons' && (
                  <div className="space-y-4">
                    <input name="name" defaultValue={editingItem?.name} placeholder="Hackathon Name" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none focus:ring-1 focus:ring-cyan-500" />
                    <input name="organizer" defaultValue={editingItem?.organizer} placeholder="Organizer (Devpost, MLH...)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <select name="mode" defaultValue={editingItem?.mode || "Online"} className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none"><option value="Online">Online</option><option value="Offline">Offline</option><option value="Hybrid">Hybrid</option></select>
                      <select name="type" defaultValue={editingItem?.type || "Solo"} className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none"><option value="Solo">Solo</option><option value="Team">Team</option></select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Starts</label><input name="startDate" defaultValue={editingItem?.startDate} type="date" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-xs outline-none" /></div>
                      <div className="space-y-1"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Deadline</label><input name="deadline" defaultValue={editingItem?.deadline} type="date" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-xs outline-none" /></div>
                    </div>
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Tech Stack</p>
                      <div className="grid grid-cols-2 gap-3">
                        <input name="frontend" defaultValue={editingItem?.techStack?.frontend} placeholder="Frontend" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                        <input name="backend" defaultValue={editingItem?.techStack?.backend} placeholder="Backend" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                        <input name="databases" defaultValue={editingItem?.techStack?.databases} placeholder="DB" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                        <input name="apis" defaultValue={editingItem?.techStack?.apis} placeholder="APIs" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                      </div>
                    </div>
                  </div>
                )}
                {/* Simplified Project & Internship forms for brevity, mirroring the structure above */}
                {modalType === 'projects' && (
                  <div className="space-y-4">
                    <input name="title" defaultValue={editingItem?.title} placeholder="Project Title" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none" />
                    <textarea name="description" defaultValue={editingItem?.description} placeholder="Short brief..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none h-20" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/5">
                      <input name="frontend" defaultValue={editingItem?.techStack?.frontend} placeholder="Frontend" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                      <input name="backend" defaultValue={editingItem?.techStack?.backend} placeholder="Backend" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                      <input name="databases" defaultValue={editingItem?.techStack?.databases} placeholder="Database" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                      <input name="progress" defaultValue={editingItem?.progress || 10} type="number" min="0" max="100" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none" />
                    </div>
                  </div>
                )}
                {modalType === 'internships' && (
                  <div className="space-y-4">
                    <input name="company" defaultValue={editingItem?.company} placeholder="Company Name" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none" />
                    <input name="role" defaultValue={editingItem?.role} placeholder="Role (e.g. SDE Intern)" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-sm outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Applied Date</label><input name="appliedDate" defaultValue={editingItem?.appliedDate} type="date" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white text-xs outline-none" /></div>
                      <div className="flex items-center gap-3 pt-4"><input name="isPaid" defaultChecked={editingItem?.isPaid} type="checkbox" className="w-5 h-5 bg-white/5 border-white/10 rounded accent-cyan-400" /><span className="text-xs font-bold text-slate-300">Paid Role</span></div>
                    </div>
                  </div>
                )}
                <button type="submit" className="w-full glass-btn font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl mt-4 active:scale-95 transition-all">Submit Track Entry</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}
