export type UserRole = 'student' | 'admin';

export type StudentStatus = 'pending_approval' | 'approved' | 'rejected';

export type CertificateStatus = 'not_requested' | 'pending' | 'approved' | 'rejected';

export interface CertificateInfo {
  status: CertificateStatus;
  certificateId?: string;
  requestedAt?: string;
  issuedAt?: string;
  performanceGrade?: string;
  mentorNotes?: string;
  rejectionReason?: string;
}

export interface Student {
  id: string; // e.g. "INT-2026-8821"
  name: string;
  email: string;
  phone: string;
  college: string;
  domain: string;
  startDate: string;
  endDate: string;
  password: string;
  status: StudentStatus;
  registeredAt: string;
  approvedAt?: string;
  certificate: CertificateInfo;
}

export interface DailyWorkLog {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  entryTime: string; // "09:30"
  exitTime: string; // "17:30"
  totalHours: number; // e.g. 8.0
  tasksCompleted: string;
  technologiesUsed?: string[];
  status: 'submitted' | 'approved';
  createdAt: string;
}

export interface AuthSession {
  role: UserRole;
  student?: Student;
  adminEmail?: string;
}

export type ActiveView = 
  | 'home' 
  | 'about' 
  | 'contact' 
  | 'certificate-generator' 
  | 'student-dashboard' 
  | 'admin-dashboard';
