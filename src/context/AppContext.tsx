import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, DailyWorkLog, AuthSession, ActiveView } from '../types';
import { INITIAL_STUDENTS, INITIAL_LOGS, ADMIN_CREDENTIALS } from '../data/seedData';

interface AppContextType {
  students: Student[];
  logs: DailyWorkLog[];
  authSession: AuthSession | null;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isLoginModalOpen: boolean;
  loginModalInitialTab: 'student' | 'student-register' | 'admin';
  openLoginModal: (tab?: 'student' | 'student-register' | 'admin') => void;
  closeLoginModal: () => void;
  studentLogin: (loginIdOrEmail: string, password: string) => { success: boolean; message: string; student?: Student };
  adminLogin: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  registerStudent: (data: {
    name: string;
    email: string;
    phone: string;
    college: string;
    domain: string;
    startDate: string;
    endDate: string;
    password: string;
  }) => { success: boolean; studentId: string; message: string };
  approveStudent: (studentId: string) => void;
  rejectStudent: (studentId: string, reason?: string) => void;
  addDailyLog: (logData: {
    studentId: string;
    date: string;
    entryTime: string;
    exitTime: string;
    tasksCompleted: string;
    technologiesUsed?: string[];
  }) => { success: boolean; hours: number; message: string };
  requestCertificate: (studentId: string) => { success: boolean; message: string };
  approveCertificateRequest: (studentId: string, details?: { grade?: string; mentorNotes?: string }) => void;
  rejectCertificateRequest: (studentId: string, reason: string) => void;
  verifyCertificateById: (query: string) => { found: boolean; student?: Student; logCount?: number; totalHours?: number };
  calculateHours: (entryTime: string, exitTime: string) => number;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_STUDENTS_KEY = 'interntrack_students_v1';
const STORAGE_LOGS_KEY = 'interntrack_logs_v1';
const STORAGE_SESSION_KEY = 'interntrack_session_v1';

export function calculateHoursDifference(entryTime: string, exitTime: string): number {
  if (!entryTime || !exitTime) return 0;
  const [entryH, entryM] = entryTime.split(':').map(Number);
  const [exitH, exitM] = exitTime.split(':').map(Number);
  
  if (isNaN(entryH) || isNaN(entryM) || isNaN(exitH) || isNaN(exitM)) return 0;
  
  let totalMinutes = (exitH * 60 + exitM) - (entryH * 60 + entryM);
  // Handle overnight shift if exit time is smaller than entry time
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }
  
  const hours = totalMinutes / 60;
  return Math.round(hours * 10) / 10; // 1 decimal place (e.g. 8.5)
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STUDENTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [logs, setLogs] = useState<DailyWorkLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOGS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalInitialTab, setLoginModalInitialTab] = useState<'student' | 'student-register' | 'admin'>('student');

  // Persist students
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  // Persist logs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs to localStorage', e);
    }
  }, [logs]);

  // Persist session
  useEffect(() => {
    try {
      if (authSession) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(authSession));
      } else {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  }, [authSession]);

  // Keep authSession.student synchronized with latest student record
  useEffect(() => {
    if (authSession?.role === 'student' && authSession.student) {
      const updatedStudent = students.find((s) => s.id === authSession.student!.id);
      if (updatedStudent && JSON.stringify(updatedStudent) !== JSON.stringify(authSession.student)) {
        setAuthSession({
          ...authSession,
          student: updatedStudent,
        });
      }
    }
  }, [students, authSession]);

  const openLoginModal = (tab: 'student' | 'student-register' | 'admin' = 'student') => {
    setLoginModalInitialTab(tab);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const studentLogin = (loginIdOrEmail: string, password: string) => {
    const trimmedInput = loginIdOrEmail.trim().toLowerCase();
    const student = students.find(
      (s) => (s.id.toLowerCase() === trimmedInput || s.email.toLowerCase() === trimmedInput) && s.password === password
    );

    if (!student) {
      return { success: false, message: 'Invalid Student ID or Password. Please try again.' };
    }

    if (student.status === 'pending_approval') {
      return {
        success: false,
        message: 'Your registration is currently PENDING Admin Approval. Once an administrator approves your account, your Login ID will be active.',
      };
    }

    if (student.status === 'rejected') {
      return {
        success: false,
        message: 'Your registration application was declined. Please contact the administrative office.',
      };
    }

    const session: AuthSession = {
      role: 'student',
      student,
    };
    setAuthSession(session);
    setActiveView('student-dashboard');
    closeLoginModal();
    return { success: true, message: 'Login successful!', student };
  };

  const adminLogin = (email: string, password: string) => {
    if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
      const session: AuthSession = {
        role: 'admin',
        adminEmail: email,
      };
      setAuthSession(session);
      setActiveView('admin-dashboard');
      closeLoginModal();
      return { success: true, message: 'Welcome to Admin Control Center.' };
    }
    return { success: false, message: 'Invalid Admin credentials.' };
  };

  const logout = () => {
    setAuthSession(null);
    setActiveView('home');
  };

  const registerStudent = (data: {
    name: string;
    email: string;
    phone: string;
    college: string;
    domain: string;
    startDate: string;
    endDate: string;
    password: string;
  }) => {
    // Check if email already exists
    const existing = students.find((s) => s.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, studentId: '', message: 'A student with this email address is already registered.' };
    }

    // Generate unique Login ID format: INT-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newStudentId = `INT-2026-${randomSuffix}`;

    const newStudent: Student = {
      id: newStudentId,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      college: data.college.trim(),
      domain: data.domain.trim(),
      startDate: data.startDate,
      endDate: data.endDate,
      password: data.password,
      status: 'pending_approval', // Admin approval is required to activate
      registeredAt: new Date().toISOString(),
      certificate: {
        status: 'not_requested',
      },
    };

    setStudents((prev) => [newStudent, ...prev]);

    return {
      success: true,
      studentId: newStudentId,
      message: `Registration successful! Your generated Login ID is ${newStudentId}. It is currently pending Admin Approval.`,
    };
  };

  const approveStudent = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: 'approved',
              approvedAt: new Date().toISOString(),
            }
          : s
      )
    );
  };

  const rejectStudent = (studentId: string, reason?: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: 'rejected',
              certificate: {
                ...s.certificate,
                rejectionReason: reason || 'Application did not meet admission criteria.',
              },
            }
          : s
      )
    );
  };

  const addDailyLog = (logData: {
    studentId: string;
    date: string;
    entryTime: string;
    exitTime: string;
    tasksCompleted: string;
    technologiesUsed?: string[];
  }) => {
    const student = students.find((s) => s.id === logData.studentId);
    if (!student) {
      return { success: false, hours: 0, message: 'Student record not found.' };
    }

    const calculatedHours = calculateHoursDifference(logData.entryTime, logData.exitTime);
    if (calculatedHours <= 0) {
      return { success: false, hours: 0, message: 'Exit time must be after entry time.' };
    }

    // Check if entry for date already exists
    const existingIndex = logs.findIndex(
      (l) => l.studentId === logData.studentId && l.date === logData.date
    );

    const newLogId = `LOG-${student.id.replace('INT-2026-', '')}-${Date.now().toString().slice(-4)}`;
    const newLog: DailyWorkLog = {
      id: newLogId,
      studentId: student.id,
      studentName: student.name,
      date: logData.date,
      entryTime: logData.entryTime,
      exitTime: logData.exitTime,
      totalHours: calculatedHours,
      tasksCompleted: logData.tasksCompleted.trim(),
      technologiesUsed: logData.technologiesUsed || [],
      status: 'approved',
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing entry
      setLogs((prev) => {
        const next = [...prev];
        next[existingIndex] = newLog;
        return next;
      });
      return { success: true, hours: calculatedHours, message: `Work log for ${logData.date} updated successfully (${calculatedHours} hrs).` };
    } else {
      setLogs((prev) => [newLog, ...prev]);
      return { success: true, hours: calculatedHours, message: `Work log for ${logData.date} recorded successfully (${calculatedHours} hrs).` };
    }
  };

  const requestCertificate = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) {
      return { success: false, message: 'Student not found.' };
    }

    const studentLogs = logs.filter((l) => l.studentId === studentId);
    if (studentLogs.length === 0) {
      return {
        success: false,
        message: 'You have not logged any daily work entries yet. Please submit your timesheet before requesting certification.',
      };
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              certificate: {
                ...s.certificate,
                status: 'pending',
                requestedAt: new Date().toISOString(),
              },
            }
          : s
      )
    );

    return {
      success: true,
      message: 'Certificate request submitted to Admin for verification and endorsement.',
    };
  };

  const approveCertificateRequest = (
    studentId: string,
    details?: { grade?: string; mentorNotes?: string }
  ) => {
    const certNumber = `CERT-${studentId}`;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              certificate: {
                status: 'approved',
                certificateId: certNumber,
                issuedAt: new Date().toISOString(),
                performanceGrade: details?.grade || 'Grade A+ (Distinction)',
                mentorNotes: details?.mentorNotes || 'Consistently fulfilled all internship objectives with professional rigor.',
              },
            }
          : s
      )
    );
  };

  const rejectCertificateRequest = (studentId: string, reason: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              certificate: {
                ...s.certificate,
                status: 'rejected',
                rejectionReason: reason,
              },
            }
          : s
      )
    );
  };

  const verifyCertificateById = (query: string) => {
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) return { found: false };

    const student = students.find(
      (s) =>
        (s.certificate.certificateId && s.certificate.certificateId.toUpperCase() === trimmed) ||
        s.id.toUpperCase() === trimmed ||
        s.email.toLowerCase() === query.trim().toLowerCase()
    );

    if (student && student.certificate.status === 'approved') {
      const studentLogs = logs.filter((l) => l.studentId === student.id);
      const totalHours = studentLogs.reduce((acc, curr) => acc + curr.totalHours, 0);
      return {
        found: true,
        student,
        logCount: studentLogs.length,
        totalHours: Math.round(totalHours * 10) / 10,
      };
    }

    return { found: false };
  };

  const resetAllData = () => {
    setStudents(INITIAL_STUDENTS);
    setLogs(INITIAL_LOGS);
    setAuthSession(null);
    localStorage.removeItem(STORAGE_STUDENTS_KEY);
    localStorage.removeItem(STORAGE_LOGS_KEY);
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setActiveView('home');
  };

  return (
    <AppContext.Provider
      value={{
        students,
        logs,
        authSession,
        activeView,
        setActiveView,
        isLoginModalOpen,
        loginModalInitialTab,
        openLoginModal,
        closeLoginModal,
        studentLogin,
        adminLogin,
        logout,
        registerStudent,
        approveStudent,
        rejectStudent,
        addDailyLog,
        requestCertificate,
        approveCertificateRequest,
        rejectCertificateRequest,
        verifyCertificateById,
        calculateHours: calculateHoursDifference,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
