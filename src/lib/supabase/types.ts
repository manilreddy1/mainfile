
// Types related to Supabase auth and profiles
export enum UserType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  VERIFICATION_MEMBER = 'verification_member'
}

export enum VerificationStatus {
  WAITING_DEMO = 'waiting_demo',
  PENDING_VERIFICATION = 'pending_verification',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  VERIFICATION_MEMBER = 'verification_member'
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: UserType;
  subject?: string;
  avatar_url?: string;
  bio?: string;
  contact_details?: string;
  role?: UserRole;
  verification_status?: VerificationStatus;
}

// Types for dashboard data
export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  status: 'scheduled' | 'live' | 'completed';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'not-started';
  description?: string;
  grade?: string;
  feedback?: string;
  urgency?: 'urgent' | 'soon' | 'normal';
}

export interface Activity {
  id: string;
  type: 'class' | 'assignment' | 'appointment';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'book' | 'pdf' | 'video' | 'interactive';
  subject: string;
  description: string;
  date: string;
  downloadable: boolean;
  url?: string;
}

export interface Appointment {
  id: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'in-person';
  feedback?: string;
}

export interface TeacherSlot {
  id: string;
  teacher: string;
  subject: string;
  availableDates: {
    date: string;
    slots: string[];
  }[];
}

export interface TeacherVerification {
  id: string;
  teacher_id: string;
  demo_video_url: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  status: VerificationStatus;
}
