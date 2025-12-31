
import React from 'react';
import { 
  Trophy, 
  Code2, 
  Briefcase, 
  LayoutDashboard,
  BarChart3,
  Calendar,
  CheckCircle2,
  Send,
  Clock,
  Rocket,
  Wrench,
  Lightbulb,
  AlertCircle,
  FileText,
  Mail,
  Zap,
  Users,
  Eye,
  XCircle,
  Ghost
} from 'lucide-react';
import { HackathonStatus, ProjectStatus, InternshipStatus } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'hackathons', label: 'Hackathons', icon: <Trophy size={20} /> },
  { id: 'projects', label: 'Projects', icon: <Code2 size={20} /> },
  { id: 'internships', label: 'Internships', icon: <Briefcase size={20} /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  { id: 'insights', label: 'Insights', icon: <BarChart3 size={20} /> },
];

export const STATUS_COLORS: Record<string, string> = {
  [HackathonStatus.REGISTERED]: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  // HackathonStatus.BUILDING and ProjectStatus.BUILDING both share the string value 'Building'
  [HackathonStatus.BUILDING]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  [HackathonStatus.SUBMITTED]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  [HackathonStatus.SHORTLISTED]: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  [HackathonStatus.WINNER]: 'bg-green-500/10 text-green-400 border-green-500/20',
  [HackathonStatus.NOT_SELECTED]: 'bg-slate-500/10 text-slate-400 border-slate-500/20',

  [ProjectStatus.IDEA]: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  [ProjectStatus.DESIGNING]: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  // Removed duplicate 'Building' key to fix object literal property collision
  [ProjectStatus.TESTING]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  [ProjectStatus.SHIPPED]: 'bg-green-500/10 text-green-400 border-green-500/20',

  [InternshipStatus.APPLIED]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [InternshipStatus.OA]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  [InternshipStatus.INTERVIEW_SCHEDULED]: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  [InternshipStatus.INTERVIEW_DONE]: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  [InternshipStatus.OFFER]: 'bg-green-500/10 text-green-400 border-green-500/20',
  [InternshipStatus.REJECTED]: 'bg-red-500/10 text-red-400 border-red-500/20',
  [InternshipStatus.GHOSTED]: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

export const STATUS_ICONS: Record<string, React.ReactNode> = {
  [HackathonStatus.REGISTERED]: <Clock size={14} />,
  // HackathonStatus.BUILDING and ProjectStatus.BUILDING both share the string value 'Building'
  [HackathonStatus.BUILDING]: <Wrench size={14} />,
  [HackathonStatus.SUBMITTED]: <Send size={14} />,
  [HackathonStatus.SHORTLISTED]: <Zap size={14} />,
  [HackathonStatus.WINNER]: <Trophy size={14} />,
  [HackathonStatus.NOT_SELECTED]: <AlertCircle size={14} />,
  
  [ProjectStatus.IDEA]: <Lightbulb size={14} />,
  [ProjectStatus.DESIGNING]: <Eye size={14} />,
  // Removed duplicate 'Building' key to fix object literal property collision
  [ProjectStatus.TESTING]: <AlertCircle size={14} />,
  [ProjectStatus.SHIPPED]: <Rocket size={14} />,

  [InternshipStatus.APPLIED]: <Mail size={14} />,
  [InternshipStatus.OA]: <FileText size={14} />,
  [InternshipStatus.INTERVIEW_SCHEDULED]: <Calendar size={14} />,
  [InternshipStatus.INTERVIEW_DONE]: <CheckCircle2 size={14} />,
  [InternshipStatus.OFFER]: <Trophy size={14} />,
  [InternshipStatus.REJECTED]: <XCircle size={14} />,
  [InternshipStatus.GHOSTED]: <Ghost size={14} />,
};
