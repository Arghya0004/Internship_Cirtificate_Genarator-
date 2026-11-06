import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  ShieldCheck, 
  Lock, 
  Mail, 
  School, 
  Briefcase, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../../data/seedData';

export const LoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    loginModalInitialTab, 
    studentLogin, 
    adminLogin,
    registerStudent,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'student' | 'student-register' | 'admin'>('student');

  // Student Login state
  const [studentIdInput, setStudentIdInput] = useState('');
  const [studentPasswordInput, setStudentPasswordInput] = useState('');
  const [studentError, setStudentError] = useState('');

  // Admin Login state
  const [adminEmailInput, setAdminEmailInput] = useState(ADMIN_CREDENTIALS.email);
  const [adminPasswordInput, setAdminPasswordInput] = useState(ADMIN_CREDENTIALS.password);
  const [adminError, setAdminError] = useState('');

  // Student Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCollege, setRegCollege] = useState('');
  const [regDomain, setRegDomain] = useState('Full-Stack Software Engineering');
  const [regStartDate, setRegStartDate] = useState('2026-11-01');
  const [regEndDate, setRegEndDate] = useState('2026-12-31');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // Verification simulation state
  const [verificationStep, setVerificationStep] = useState<'form' | 'verify' | 'completed'>('form');
  const [simulatedCode, setSimulatedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [regError, setRegError] = useState('');
  const [generatedId, setGeneratedId] = useState('');

  useEffect(() => {
    if (isLoginModalOpen) {
      setActiveTab(loginModalInitialTab);
      setStudentError('');
      setAdminError('');
      setRegError('');
      setVerificationStep('form');
    }
  }, [isLoginModalOpen, loginModalInitialTab]);

  if (!isLoginModalOpen) return null;

  // Handle Student Login
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');
    if (!studentIdInput.trim() || !studentPasswordInput) {
      setStudentError('Please enter both Login ID and password.');
      return;
    }
    const res = studentLogin(studentIdInput, studentPasswordInput);
    if (!res.success) {
      setStudentError(res.message);
    }
  };

  // Handle Admin Login
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!adminEmailInput.trim() || !adminPasswordInput) {
      setAdminError('Please enter admin credentials.');
      return;
    }
    const res = adminLogin(adminEmailInput, adminPasswordInput);
    if (!res.success) {
      setAdminError(res.message);
    }
  };

  // Step 1: Initiate verification
  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regCollege.trim() || !regPassword) {
      setRegError('Please complete all required fields.');
      return;
    }
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setRegError('Please provide a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedCode(code);
    setEnteredCode('');
    setVerificationStep('verify');
  };

  // Step 2: Confirm OTP & finalize registration
  const handleConfirmCodeAndRegister = () => {
    if (enteredCode.trim() !== simulatedCode) {
      setRegError('Invalid verification code. Please check and re-enter.');
      return;
    }

    const result = registerStudent({
      name: regName,
      email: regEmail,
      phone: regPhone || '+1 (555) 000-0000',
      college: regCollege,
      domain: regDomain,
      startDate: regStartDate,
      endDate: regEndDate,
      password: regPassword,
    });

    if (result.success) {
      setGeneratedId(result.studentId);
      setVerificationStep('completed');
    } else {
      setRegError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden transition-all my-8 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Portal Authentication</h3>
              <p className="text-xs text-slate-500">Access student workspace or administrative console</p>
            </div>
          </div>
          <button 
            onClick={closeLoginModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1.5">
          <button
            onClick={() => {
              setActiveTab('student');
              setStudentError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student Login</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('student-register');
              setRegError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'student-register'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>New Registration</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('admin');
              setAdminError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-white text-amber-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin</span>
          </button>
        </div>

        {/* Tab 1: Student Login */}
        {activeTab === 'student' && (
          <div className="p-6">
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              {studentError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{studentError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student Login ID or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INT-2026-8821 or email"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono-num"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Provided during registration after administrative confirmation.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter your account password"
                    value={studentPasswordInput}
                    onChange={(e) => setStudentPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Student Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Credentials shortcut */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Quick Test Accounts (Click to Fill):
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStudentIdInput('INT-2026-8821');
                    setStudentPasswordInput('password123');
                    setStudentError('');
                  }}
                  className="p-2.5 text-left border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="font-semibold text-slate-900 group-hover:text-blue-700">Alex Morgan</div>
                  <div className="font-mono-num text-[11px] text-slate-500">INT-2026-8821</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Certified & Approved</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStudentIdInput('INT-2026-4402');
                    setStudentPasswordInput('password123');
                    setStudentError('');
                  }}
                  className="p-2.5 text-left border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="font-semibold text-slate-900 group-hover:text-blue-700">Rohan Sharma</div>
                  <div className="font-mono-num text-[11px] text-slate-500">INT-2026-4402</div>
                  <div className="text-[10px] text-blue-600 font-medium">Active (Logging Hours)</div>
                </button>
              </div>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('student-register')}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Need an account? Register new student profile →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: New Student Registration */}
        {activeTab === 'student-register' && (
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {verificationStep === 'form' && (
              <form onSubmit={handleStartVerification} className="space-y-3.5">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 leading-relaxed">
                  <span className="font-semibold">Workflow note:</span> After submitting your details and verifying your email, the application generates your unique Student ID. The <strong>Administrator must approve</strong> your profile before you can log in.
                </div>

                {regError && (
                  <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (for verification) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="intern@university.edu"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College / University / Institution *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <School className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. University of California, Berkeley"
                      value={regCollege}
                      onChange={(e) => setRegCollege(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internship Domain / Track *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <select
                      value={regDomain}
                      onChange={(e) => setRegDomain(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    >
                      <option value="Full-Stack Software Engineering">Full-Stack Software Engineering</option>
                      <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                      <option value="Cloud Architecture & DevOps">Cloud Architecture & DevOps</option>
                      <option value="Data Analytics & Business Intelligence">Data Analytics & Business Intelligence</option>
                      <option value="Cybersecurity & Defense">Cybersecurity & Defense</option>
                      <option value="Mobile App Development (React Native & Flutter)">Mobile App Development</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={regStartDate}
                      onChange={(e) => setRegStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Expected End Date
                    </label>
                    <input
                      type="date"
                      value={regEndDate}
                      onChange={(e) => setRegEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Set Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min. 6 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-type password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Verify Email & Submit Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: Email Verification */}
            {verificationStep === 'verify' && (
              <div className="space-y-4 py-2">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">Verify Email Address</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    We sent a 6-digit confirmation code to <strong>{regEmail}</strong>. Please enter it below to confirm identity.
                  </p>
                </div>

                {/* Simulated Verification Notice */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <div className="font-semibold flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Simulated Email Delivery:</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Your Verification Code is: <strong className="font-mono-num text-sm text-slate-900 tracking-wider">{simulatedCode}</strong></span>
                    <button
                      type="button"
                      onClick={() => setEnteredCode(simulatedCode)}
                      className="text-[11px] font-semibold text-blue-700 bg-white border border-blue-200 px-2 py-1 rounded shadow-xs hover:bg-blue-50"
                    >
                      Autofill Code
                    </button>
                  </div>
                </div>

                {regError && (
                  <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    className="w-48 mx-auto block px-4 py-2.5 text-center text-xl tracking-widest font-mono-num font-bold bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setVerificationStep('form')}
                    className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
                  >
                    Back to Form
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCodeAndRegister}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Confirm & Complete
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Registration Success & Admin Approval Required Notice */}
            {verificationStep === 'completed' && (
              <div className="text-center space-y-4 py-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Registration Submitted!</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Your unique Student Identification Number has been generated:
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-inner font-mono-num text-xl font-bold tracking-wider text-blue-400">
                  {generatedId}
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-left space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Administrator Approval Required</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    As specified by policy, the administrator must endorse your registration before your Login ID is activated. Once approved by the Admin, you can log in using your ID (<strong>{generatedId}</strong>) and password.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('admin');
                      setAdminError('');
                    }}
                    className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Switch to Admin to Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('student');
                      setStudentIdInput(generatedId);
                    }}
                    className="flex-1 py-2.5 px-3 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Back to Student Login
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Admin Login */}
        {activeTab === 'admin' && (
          <div className="p-6">
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
              <div className="font-semibold flex items-center gap-1.5 mb-0.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Management Console</span>
              </div>
              <p className="text-amber-800">
                Track all student registrations, approve new IDs, verify daily work timesheets, and endorse certificates.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {adminError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={adminEmailInput}
                    onChange={(e) => setAdminEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Key / Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Admin Console</span>
              </button>
            </form>

            <div className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
              <span className="text-slate-600">Demo Key: <code className="font-mono-num font-semibold text-slate-800">admin@certitrack.io / admin123</code></span>
              <button
                type="button"
                onClick={() => {
                  setAdminEmailInput(ADMIN_CREDENTIALS.email);
                  setAdminPasswordInput(ADMIN_CREDENTIALS.password);
                }}
                className="text-[11px] font-semibold text-amber-700 hover:underline"
              >
                Autofill
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
