import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Sparkles, 
  Calendar, 
  Building, 
  Briefcase, 
  Mail, 
  Phone,
  RefreshCw,
  ExternalLink,
  Check,
  AlertCircle
} from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../../data/seedData';

export const AdminDashboard: React.FC = () => {
  const { 
    students, 
    logs, 
    approveStudent, 
    rejectStudent, 
    approveCertificateRequest, 
    rejectCertificateRequest, 
    resetAllData,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'logs' | 'certificates' | 'settings'>('approvals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');

  // Certificate approval modal / inline state
  const [approvingCertStudentId, setApprovingCertStudentId] = useState<string | null>(null);
  const [certGrade, setCertGrade] = useState('Grade A+ (Outstanding Distinction)');
  const [certNotes, setCertNotes] = useState('Demonstrated exceptional engineering rigor and collaborative leadership throughout the internship practicum.');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Rejection modal state
  const [rejectingStudentId, setRejectingStudentId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Prerequisite academic credits incomplete.');

  // Metrics
  const pendingRegistrations = useMemo(() => {
    return students.filter((s) => s.status === 'pending_approval');
  }, [students]);

  const approvedStudents = useMemo(() => {
    return students.filter((s) => s.status === 'approved');
  }, [students]);

  const pendingCertRequests = useMemo(() => {
    return students.filter((s) => s.certificate.status === 'pending');
  }, [students]);

  const approvedCertificates = useMemo(() => {
    return students.filter((s) => s.certificate.status === 'approved');
  }, [students]);

  const totalAllHours = useMemo(() => {
    return Math.round(logs.reduce((acc, curr) => acc + curr.totalHours, 0) * 10) / 10;
  }, [logs]);

  // Filtered daily logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesStudent = selectedStudentFilter === 'all' || log.studentId === selectedStudentFilter;
      const matchesSearch = 
        log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.tasksCompleted.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.date.includes(searchQuery);
      return matchesStudent && matchesSearch;
    });
  }, [logs, selectedStudentFilter, searchQuery]);

  const handleApproveRegistration = (studentId: string) => {
    approveStudent(studentId);
    setActionSuccessMsg(`Student ID ${studentId} has been officially approved and activated.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleConfirmRejectStudent = () => {
    if (!rejectingStudentId) return;
    rejectStudent(rejectingStudentId, rejectReason);
    setRejectingStudentId(null);
    setActionSuccessMsg(`Application for ${rejectingStudentId} has been declined.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleConfirmApproveCertificate = () => {
    if (!approvingCertStudentId) return;
    approveCertificateRequest(approvingCertStudentId, {
      grade: certGrade,
      mentorNotes: certNotes,
    });
    setApprovingCertStudentId(null);
    setActionSuccessMsg(`Certificate officially generated and endorsed for student.`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleExportJSON = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      students,
      dailyWorkLogs: logs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interntrack_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Program Director Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Administrative Control & Verification Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Supervising {students.length} interns · {totalAllHours} total verified practicum hours across all domains.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Database</span>
            </button>
            <button
              onClick={resetAllData}
              title="Reset state to initial sample records"
              className="px-3.5 py-2 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* 4 Quantitative Admin Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Students</div>
            <div className="text-2xl font-bold font-mono-num text-white mt-1">
              {approvedStudents.length} <span className="text-xs text-slate-400 font-normal">interns</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Enrolled & logging</div>
          </div>

          <div className={`p-4 rounded-xl border transition-colors ${
            pendingRegistrations.length > 0 
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
          }`}>
            <div className="text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>Pending ID Approvals</span>
              {pendingRegistrations.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <div className="text-2xl font-bold font-mono-num text-amber-300 mt-1">
              {pendingRegistrations.length} <span className="text-xs text-amber-200/70 font-normal">applicants</span>
            </div>
            <div className="text-[11px] mt-0.5">Requires admin sign-off</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Work Logged</div>
            <div className="text-2xl font-bold font-mono-num text-white mt-1">
              {totalAllHours} <span className="text-xs text-slate-400 font-normal">hours</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">{logs.length} timesheets recorded</div>
          </div>

          <div className={`p-4 rounded-xl border transition-colors ${
            pendingCertRequests.length > 0
              ? 'bg-blue-950/40 border-blue-500/50 text-blue-200'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
          }`}>
            <div className="text-[11px] font-semibold uppercase tracking-wider">Pending Certificates</div>
            <div className="text-2xl font-bold font-mono-num text-blue-300 mt-1">
              {pendingCertRequests.length} <span className="text-xs text-blue-200/70 font-normal">requests</span>
            </div>
            <div className="text-[11px] mt-0.5">Awaiting certification review</div>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tabs Switcher Bar */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold text-slate-500 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'approvals'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Approvals & Directory</span>
          {pendingRegistrations.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {pendingRegistrations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'certificates'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificate Endorsements</span>
          {pendingCertRequests.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-bold">
              {pendingCertRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'logs'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Daily Timesheet Logs ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: Student Registrations & Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-8">
          
          {/* Section 1: Pending Student Approvals Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Pending Registration Endorsement Queue</span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono-num font-bold">
                    {pendingRegistrations.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  New users register and verify email. The admin must click &ldquo;Approve&rdquo; to activate their Unique Student ID for login.
                </p>
              </div>
            </div>

            {pendingRegistrations.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs font-medium text-slate-700">No pending registrations.</p>
                <p className="text-[11px] text-slate-400">All student IDs have been reviewed and activated.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingRegistrations.map((student) => (
                  <div key={student.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{student.name}</span>
                        <span className="font-mono-num text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
                          {student.id}
                        </span>
                        <span className="text-[10px] text-amber-700 font-semibold uppercase bg-amber-100 px-2 py-0.5 rounded">
                          Awaiting Approval
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.college}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.domain}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.email}</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono-num">
                        Registered: {new Date(student.registeredAt).toLocaleString()} · Term: {student.startDate} to {student.endDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveRegistration(student.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Activate ID</span>
                      </button>

                      <button
                        onClick={() => setRejectingStudentId(student.id)}
                        className="px-3 py-2 border border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Active Interns Directory */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Active Enrolled Interns Directory</h3>
                <p className="text-xs text-slate-500">Currently active students tracking daily attendance and hours.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3">Institution</th>
                    <th className="py-2.5 px-3 text-right">Logged Hours</th>
                    <th className="py-2.5 px-3">Certificate</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {approvedStudents.map((st) => {
                    const stLogs = logs.filter((l) => l.studentId === st.id);
                    const hours = Math.round(stLogs.reduce((acc, curr) => acc + curr.totalHours, 0) * 10) / 10;
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{st.name}</div>
                          <div className="font-mono-num text-[11px] text-slate-500">{st.id}</div>
                        </td>
                        <td className="py-3 px-3 max-w-[180px] truncate">{st.domain}</td>
                        <td className="py-3 px-3 max-w-[200px] truncate">{st.college}</td>
                        <td className="py-3 px-3 text-right font-mono-num font-bold text-slate-900">
                          {hours} hrs ({stLogs.length} d)
                        </td>
                        <td className="py-3 px-3">
                          {st.certificate.status === 'approved' ? (
                            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Issued: {st.certificate.certificateId}
                            </span>
                          ) : st.certificate.status === 'pending' ? (
                            <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              Request Pending
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Logging Work
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedStudentFilter(st.id);
                              setActiveTab('logs');
                            }}
                            className="text-blue-600 hover:underline font-semibold text-[11px]"
                          >
                            View Timesheet →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Certificate Endorsements */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          
          {/* Pending Endorsement Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Certificate Issuance Requests</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono-num font-bold">
                  {pendingCertRequests.length}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Review student performance and logged hours. Endorsing here generates their official verifiable certificate immediately.
              </p>
            </div>

            {pendingCertRequests.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-xs font-medium text-slate-700">No pending certificate requests.</p>
                <p className="text-[11px] text-slate-400">All requests have been evaluated.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingCertRequests.map((st) => {
                  const stLogs = logs.filter((l) => l.studentId === st.id);
                  const hours = Math.round(stLogs.reduce((acc, curr) => acc + curr.totalHours, 0) * 10) / 10;
                  return (
                    <div key={st.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">{st.name}</span>
                          <span className="font-mono-num text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                            {st.id}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>Domain: <strong>{st.domain}</strong></span>
                          <span>·</span>
                          <span>Institution: <strong>{st.college}</strong></span>
                          <span>·</span>
                          <span className="text-emerald-700 font-bold font-mono-num">
                            {hours} Verified Hours ({stLogs.length} Days)
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Requested: {new Date(st.certificate.requestedAt || Date.now()).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setApprovingCertStudentId(st.id);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Award className="w-4 h-4 text-amber-200" />
                          <span>Endorse & Issue Certificate</span>
                        </button>

                        <button
                          onClick={() => rejectCertificateRequest(st.id, 'Logged hours do not satisfy the minimum required curriculum credits.')}
                          className="px-3 py-2 border border-slate-300 text-slate-600 hover:text-red-700 text-xs font-semibold rounded-lg hover:bg-red-50"
                        >
                          Request Revisions
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Already Issued Certificates */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Issued & Verifiable Certificates ({approvedCertificates.length})</h3>
              <p className="text-xs text-slate-500">Official digital credentials accessible to students and verifiable by employers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedCertificates.map((st) => (
                <div key={st.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-num text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      {st.certificate.certificateId}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Endorsed
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                  <div className="text-xs text-slate-600">{st.domain} · {st.college}</div>
                  
                  <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-amber-200/60">
                    <span>Grade: <strong>{st.certificate.performanceGrade}</strong></span>
                    <button
                      onClick={() => setActiveView('certificate-generator')}
                      className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>View Full Certificate</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: Daily Timesheet Logs Across All Interns */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">All Daily Work Records ({filteredLogs.length})</h3>
              <p className="text-xs text-slate-500">&ldquo;Admin will keep track of all the data&rdquo; — real-time timesheets and task descriptions.</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedStudentFilter}
                onChange={(e) => setSelectedStudentFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">All Interns</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id})
                  </option>
                ))}
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search work logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-44"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Shift Times</th>
                  <th className="py-2.5 px-3 text-right">Hours</th>
                  <th className="py-2.5 px-3">Tasks Completed (Manual Log)</th>
                  <th className="py-2.5 px-3">Tech Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono-num font-semibold text-slate-800 whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{log.studentName}</div>
                      <div className="font-mono-num text-[10px] text-slate-400">{log.studentId}</div>
                    </td>
                    <td className="py-3 px-3 font-mono-num text-slate-600 whitespace-nowrap">
                      {log.entryTime} – {log.exitTime}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-num font-bold text-blue-700 whitespace-nowrap">
                      {log.totalHours} hrs
                    </td>
                    <td className="py-3 px-3 max-w-md">
                      <p className="line-clamp-2 text-slate-700">{log.tasksCompleted}</p>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {log.technologiesUsed?.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Endorse & Issue Certificate */}
      {approvingCertStudentId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Endorse & Generate Certificate</span>
              </h3>
              <button
                onClick={() => setApprovingCertStudentId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              You are endorsing candidate <strong className="text-slate-900">{approvingCertStudentId}</strong>. This assigns an authentic cryptographic Certificate ID and publishes it to the verification registrar.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Awarded Performance Standing / Grade
                </label>
                <select
                  value={certGrade}
                  onChange={(e) => setCertGrade(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Grade A+ (Outstanding Distinction)">Grade A+ (Outstanding Distinction)</option>
                  <option value="Grade A (Excellence)">Grade A (Excellence)</option>
                  <option value="Grade B+ (Merit & Proficiency)">Grade B+ (Merit & Proficiency)</option>
                  <option value="Honors Completion">Honors Completion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Director / Mentor Remarks
                </label>
                <textarea
                  rows={3}
                  value={certNotes}
                  onChange={(e) => setCertNotes(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setApprovingCertStudentId(null)}
                className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproveCertificate}
                className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Confirm & Issue Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Decline Student Application */}
      {rejectingStudentId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Decline Student Registration</h3>
            <p className="text-xs text-slate-600">
              Provide feedback for the applicant regarding the decision:
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg resize-none"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRejectingStudentId(null)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRejectStudent}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
