
export enum HackathonStatus {
  REGISTERED = 'Registered',
  BUILDING = 'Building',
  SUBMITTED = 'Submitted',
  SHORTLISTED = 'Shortlisted',
  WINNER = 'Winner',
  NOT_SELECTED = 'Not Selected'
}

export enum ProjectStatus {
  IDEA = 'Idea',
  DESIGNING = 'Designing',
  BUILDING = 'Building',
  TESTING = 'Testing',
  SHIPPED = 'Shipped'
}

export enum InternshipStatus {
  APPLIED = 'Applied',
  OA = 'OA Received',
  INTERVIEW_SCHEDULED = 'Interview Scheduled',
  INTERVIEW_DONE = 'Interview Done',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
  GHOSTED = 'Ghosted'
}

export interface TechStack {
  frontend?: string;
  backend?: string;
  databases?: string;
  apis?: string;
  devops?: string;
}

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  type: 'Team' | 'Solo';
  startDate: string;
  endDate: string;
  deadline: string;
  theme: string;
  techStack: TechStack;
  repoUrl?: string;
  demoUrl?: string;
  status: HackathonStatus;
  notes: string;
}

export interface Project {
  id: string;
  title: string;
  type: 'Personal' | 'Hackathon' | 'Internship' | 'Freelance';
  status: ProjectStatus;
  progress: number; // 0-100
  techStack: TechStack;
  repoUrl: string;
  demoUrl: string;
  designUrl?: string;
  description: string;
  features: { id: string, text: string, completed: boolean }[];
  learnings?: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  platform: string;
  location: string;
  isPaid: boolean;
  appliedDate: string;
  status: InternshipStatus;
  interviewDates: string[];
  resumeVersion?: string;
  stipend?: string;
  notes: string;
}

export type TrackType = 'dashboard' | 'hackathons' | 'projects' | 'internships' | 'insights' | 'calendar';
