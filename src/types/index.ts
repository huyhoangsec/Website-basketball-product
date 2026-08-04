// ==========================================
// OceanBasketball — TypeScript Type Definitions
// ==========================================

// --- Enums ---

export enum UserRole {
  ADMIN = "admin",
  COACH = "coach",
}

export enum AttendanceStatus {
  PRESENT = "present",
  CANCELLED = "cancelled",
  EXCUSED = "excused",
  UNEXCUSED = "unexcused",
  DROPPED = "dropped",
}

export enum StudentStatus {
  ACTIVE = "active",
  TRIAL = "trial",
  INACTIVE = "inactive",
  DROPPED = "dropped",
}

export enum TrainingLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  ELITE = "elite",
}

export enum TournamentStatus {
  UPCOMING = "upcoming",
  ONGOING = "ongoing",
  COMPLETED = "completed",
}

// --- Interfaces ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  specialization: string;
  experience: string;
  achievements: string[];
  bio: string;
  isActive: boolean;
}

export interface Court {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  facilities: string[];
  classCount: number;
}

export interface ClassSchedule {
  dayOfWeek: number; // 0=CN, 1=T2, ..., 6=T7
  startTime: string; // "17:00"
  endTime: string; // "18:30"
}

export interface ClassInfo {
  id: string;
  name: string;
  courtId: string;
  coachId: string;
  court: Court;
  coach: Coach;
  level: TrainingLevel;
  schedule: ClassSchedule[];
  maxStudents: number;
  currentStudents: number;
  trialStudents: number;
}

export interface Student {
  id: string;
  name: string;
  birthYear: number;
  parentName: string;
  parentPhone: string;
  classId: string;
  className?: string;
  status: StudentStatus;
  joinDate: string;
  notes?: string;
}

export interface TrialRegistration {
  id: string;
  parentName: string;
  parentPhone: string;
  studentName: string;
  studentBirthYear: number;
  preferredCourt: string;
  notes?: string;
  status: "pending" | "approved" | "rejected" | "converted";
  createdAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  banner?: string;
  status: TournamentStatus;
}

export interface TuitionPlan {
  id: string;
  name: string;
  price: number;
  duration: string; // e.g., "1 tháng", "3 tháng"
  sessionsPerWeek: number;
  features: string[];
  isPopular?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export interface Review {
  id: string;
  parentName: string;
  avatar?: string;
  rating: number; // 1-5
  content: string;
  studentName?: string;
  isVisible: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  pendingTrials: number;
  attendanceRate: number;
  totalCoaches: number;
  totalCourts: number;
}

// --- Form Types ---

export interface TrialFormData {
  parentName: string;
  parentPhone: string;
  studentName: string;
  studentBirthYear: number;
  preferredCourt: string;
  notes?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
