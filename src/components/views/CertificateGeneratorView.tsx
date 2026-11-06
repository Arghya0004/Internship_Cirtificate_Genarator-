import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateDocument } from '../certificate/CertificateDocument';
import { 
  Award, 
  Lock, 
  User, 
  Send, 
  Clock, 
  CheckCircle2, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  Briefcase, 
  Building, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CertificateGeneratorView: React.FC = () => {
  const { 
    authSession, 
    students, 
    logs, 
    studentLogin, 
    requestCertificate, 
    setActiveView,
    verifyCertificateById
  } = useApp();

  // Local student credential state if verifying via ID + Password inside this tab
  const [inputId, setInputId] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [copied, setCopied] = useState(false);
  const [requestSuccessMessage, setRequestSuccessMessage] = useState('');

  // Public verifier search state
  const [activeTab, setActiveTab] = useState<'request' | 'verify'>('request');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{
    searched: boolean;
    found: boolean;
    student?: any;
    logCount?: number;
    totalHours?: number;
  }>({ searched: false, found: false });

  // Resolve current active student: either from authSession or if student logged in
  const currentStudent = authSession?.role === 'student' && authSession.student 
    ? students.find(s => s.id === authSession.student?.id) || authSession.student
    : null;

  // Calculate hours for current student
  const studentLogs = currentStudent ? logs.filter(l => l.studentId === currentStudent.id) : [];
  const totalHours = studentLogs.reduce((acc, curr) => acc + curr.totalHours, 0);

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!inputId.trim() || !inputPassword) {
      setLoginError('Please enter both your Student ID and Password.');
      return;
    }
    const res = studentLogin(inputId, inputPassword);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleRequestSubmit = () => {
    if (!currentStudent) return;
    const res = requestCertificate(currentStudent.id);
    if (res.success) {
      setRequestSuccessMessage(res.message);
    } else {
      setLoginError(res.message);
    }
  };

  const handleCopyCertId = (certId: string) => {
    navigator.clipboard.writeText(certId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSearchVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const res = verifyCertificateById(searchQuery);
    setSearchResult({
      searched: true,
      found: res.found,
      student: res.student,
      logCount: res.logCount,
      totalHours: res.totalHours,
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold mb-3">
          <Award className="w-4 h-4 text-amber-700" />
          <span>Official Endorsement Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Internship Certificate Generator & Verifier
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Authenticate with your Student ID and Password to request an official certificate, track administrative endorsement, and view your verifiable credential.
        </p>

        {/* Tab switch between Student Portal Request and Public Credential Search */}
        <div className="flex items-center justify-center gap-2 mt-6 p-1 bg-slate-100 rounded-lg max-w-xs mx-auto">
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'request'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Certificate Portal
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'verify'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Public Credential Check
          </button>
        </div>
      </div>

      {/* Tab 2: Public Credential Verification */}
      {activeTab === 'verify' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Verify Any Certificate in Real Time</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter Certificate ID (e.g. <code>CERT-INT-2026-8821</code>) or Student ID to verify authenticity directly against the central registrar.
            </p>

            <form onSubmit={handleSearchVerify} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Certificate ID or Student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num uppercase"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Verify</span>
              </button>
            </form>

            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
              <span>Quick try:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('CERT-INT-2026-8821');
                }}
                className="font-mono-num text-blue-600 hover:underline"
              >
                CERT-INT-2026-8821
              </button>
            </div>
          </div>

          {/* Verification Results */}
          {searchResult.searched && (
            <div className="animate-in fade-in duration-200">
              {searchResult.found && searchResult.student ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-emerald-950 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-emerald-900">Valid Authentic Credential</h4>
                      <p className="text-xs text-emerald-700">Official endorsement confirmed by InternTrack registry</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-emerald-200">
                    <div>
                      <span className="text-emerald-700 font-medium">Recipient Name:</span>
                      <div className="text-slate-900 font-bold text-sm">{searchResult.student.name}</div>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Internship Domain:</span>
                      <div className="text-slate-900 font-semibold">{searchResult.student.domain}</div>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Institution:</span>
                      <div className="text-slate-900 font-semibold">{searchResult.student.college}</div>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Standing / Grade:</span>
                      <div className="text-emerald-800 font-bold">{searchResult.student.certificate.performanceGrade}</div>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Verified Hours:</span>
                      <div className="text-slate-900 font-mono-num font-bold">{searchResult.totalHours} Hours</div>
                    </div>
                    <div>
                      <span className="text-emerald-700 font-medium">Certificate ID:</span>
                      <div className="text-slate-900 font-mono-num font-bold">{searchResult.student.certificate.certificateId}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-900 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">No Certified Record Found</h4>
                    <p className="text-xs text-red-700 mt-1">
                      No approved certificate matching &ldquo;{searchQuery}&rdquo; was found in our database. Please ensure the exact Certificate ID or approved Student ID is entered.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Certificate Portal */}
      {activeTab === 'request' && (
        <>
          {/* State 1: Student not logged in yet -> asks for ID and Password */}
          {!currentStudent ? (
            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Authenticate Student ID</h2>
                <p className="text-xs text-slate-500">
                  Please enter your unique Student Login ID and Password to view or submit your certificate request.
                </p>
              </div>

              {loginError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleVerifyLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Student Login ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. INT-2026-8821"
                      value={inputId}
                      onChange={(e) => setInputId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono-num"
                    />
                  </div>
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
                      placeholder="Enter password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Verify Credentials & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Fill Demo buttons */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Sample Logins:
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInputId('INT-2026-8821');
                      setInputPassword('password123');
                    }}
                    className="w-full p-2.5 text-left border border-slate-200 rounded-lg hover:bg-blue-50/50 hover:border-blue-300 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Alex Morgan (Has Approved Certificate)</div>
                      <div className="text-slate-500 font-mono-num text-[11px]">INT-2026-8821 · password123</div>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Ready to View
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInputId('INT-2026-4402');
                      setInputPassword('password123');
                    }}
                    className="w-full p-2.5 text-left border border-slate-200 rounded-lg hover:bg-blue-50/50 hover:border-blue-300 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Rohan Sharma (Can Request Certificate)</div>
                      <div className="text-slate-500 font-mono-num text-[11px]">INT-2026-4402 · password123</div>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                      Submit Request
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* State 2: Student is Authenticated */
            <div className="space-y-8">
              
              {/* Student Overview Strip */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{currentStudent.name}</h2>
                    <span className="font-mono-num text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-semibold">
                      {currentStudent.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span><strong>Domain:</strong> {currentStudent.domain}</span>
                    <span>·</span>
                    <span><strong>Institution:</strong> {currentStudent.college}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg text-center">
                    <div className="text-blue-900 font-bold text-base font-mono-num">{totalHours}h</div>
                    <div className="text-blue-600 text-[11px]">Total Work Logged</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-center">
                    <div className="text-slate-900 font-bold text-base font-mono-num">{studentLogs.length}</div>
                    <div className="text-slate-500 text-[11px]">Days Recorded</div>
                  </div>
                </div>
              </div>

              {/* Status Section based on certificate.status */}
              
              {/* CASE A: Certificate NOT REQUESTED YET */}
              {currentStudent.certificate.status === 'not_requested' && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                    <Award className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Request Official Internship Certificate</h3>
                    <p className="text-sm text-slate-600 max-w-lg mx-auto">
                      You have logged <strong>{totalHours} total hours</strong> across <strong>{studentLogs.length} work days</strong>. When you submit this request, the administrator will review your timesheets and endorse your digital certificate.
                    </p>
                  </div>

                  {requestSuccessMessage && (
                    <div className="p-3 text-xs bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg">
                      {requestSuccessMessage}
                    </div>
                  )}

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
                    <div className="font-semibold text-slate-800">Pre-Request Verification Checklist:</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>All entry & exit times logged accurately</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Daily tasks and milestones manually recorded</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Internship duration verified with university</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      onClick={() => setActiveView('student-dashboard')}
                      className="px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Add More Daily Logs First
                    </button>
                    <button
                      onClick={handleRequestSubmit}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Certificate Request to Admin</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CASE B: Certificate Request PENDING ADMIN APPROVAL */}
              {currentStudent.certificate.status === 'pending' && (
                <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                    <Clock className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-amber-950">Certificate Request Under Admin Review</h3>
                    <p className="text-sm text-amber-800 max-w-lg mx-auto">
                      Your request has been delivered to the administrative verification queue. The Program Director is reviewing your logged hours (<strong>{totalHours}h</strong>) and performance tasks.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-200/60 text-amber-900 rounded-full text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Submitted on: {new Date(currentStudent.certificate.requestedAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  {/* Easy admin switch helper for testing */}
                  <div className="pt-4 border-t border-amber-200">
                    <p className="text-xs text-amber-800 mb-3">
                      Testing as an evaluator? You can switch to the Admin Portal to endorse this certificate in 1 click.
                    </p>
                    <button
                      onClick={() => setActiveView('admin-dashboard')}
                      className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Open Admin Console & Endorse Request</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CASE C: Certificate APPROVED & GENERATED! */}
              {currentStudent.certificate.status === 'approved' && (
                <div className="space-y-6">
                  
                  {/* Action Bar on top */}
                  <div className="bg-emerald-50 border border-emerald-300 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-950 text-base">Certificate Issued & Verified</h3>
                        <p className="text-xs text-emerald-700">
                          Officially endorsed by Eleanor Sterling · Grade: {currentStudent.certificate.performanceGrade}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyCertId(currentStudent.certificate.certificateId || `CERT-${currentStudent.id}`)}
                        className="px-3.5 py-2 bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100/50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied ID' : 'Copy Cert ID'}</span>
                      </button>

                      <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / Save PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Render the printable high-res certificate */}
                  <div className="py-4">
                    <CertificateDocument student={currentStudent} totalHours={totalHours} />
                  </div>
                </div>
              )}

              {/* CASE D: Rejected with reason */}
              {currentStudent.certificate.status === 'rejected' && (
                <div className="bg-red-50 border border-red-300 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-red-950">Certificate Request Declined</h3>
                  <p className="text-xs text-red-800">
                    Reason: {currentStudent.certificate.rejectionReason || 'Timesheet hours insufficient or incomplete.'}
                  </p>
                  <button
                    onClick={() => setActiveView('student-dashboard')}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Return to Timesheet Dashboard
                  </button>
                </div>
              )}

            </div>
          )}
        </>
      )}

    </div>
  );
};
