import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Calendar,
  Layers,
  ChevronRight,
  Zap,
  Building
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    openLoginModal, 
    setActiveView, 
    studentLogin, 
    adminLogin,
    verifyCertificateById 
  } = useApp();

  const [quickCertQuery, setQuickCertQuery] = useState('');
  const [quickVerifyResult, setQuickVerifyResult] = useState<{
    searched: boolean;
    found: boolean;
    student?: any;
    totalHours?: number;
  }>({ searched: false, found: false });

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCertQuery.trim()) return;
    const res = verifyCertificateById(quickCertQuery);
    setQuickVerifyResult({
      searched: true,
      found: res.found,
      student: res.student,
      totalHours: res.totalHours,
    });
  };

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6 pt-6 sm:pt-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>End-to-End Practicum Management & Official Certification</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Track Daily Internship Hours.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Generate Verifiable Credentials.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The premier platform for university interns and program administrators. Automated shift calculation, manual task logs, administrative approval pipelines, and cryptographic digital certificates.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openLoginModal('student')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <span>Student Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openLoginModal('admin')}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => setActiveView('certificate-generator')}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>Certificate Generator</span>
            </button>
          </div>

          {/* Interactive Test-Drive Pill Strip */}
          <div className="pt-6">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              1-Click Fast Evaluator Shortcuts:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => studentLogin('INT-2026-8821', 'password123')}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-slate-700 transition-colors shadow-xs"
              >
                🎓 Alex Morgan <span className="text-emerald-600 font-bold">(Approved Cert)</span>
              </button>

              <button
                type="button"
                onClick={() => studentLogin('INT-2026-4402', 'password123')}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-slate-700 transition-colors shadow-xs"
              >
                💻 Rohan Sharma <span className="text-blue-600 font-bold">(Log Hours & Request)</span>
              </button>

              <button
                type="button"
                onClick={() => adminLogin('admin@certitrack.io', 'admin123')}
                className="px-3 py-1.5 bg-amber-50 border border-amber-300 hover:bg-amber-100 rounded-lg text-amber-900 font-semibold transition-colors shadow-xs"
              >
                🛡️ Admin Eleanor Sterling <span className="text-amber-700">(Approve Everything)</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4-Step Architecture Walkthrough */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            System Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered Exactly for Your Requirements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Registration & ID</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              New students provide academic details, verify email, and receive a unique Login ID (<code className="font-mono-num font-semibold">INT-2026-XXXX</code>).
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Admin Approval</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Admin reviews candidate details and officially approves their registration to activate their Login ID for system access.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Hours & Work Logs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interns pick dates on the interactive calendar, input entry and exit times for automatic hours math, and record manual task summaries.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative group hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Verifiable Certificate</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student requests endorsement via the Certificate Generator tab. Once approved by Admin, an authentic, printable diploma is generated.
            </p>
          </div>

        </div>
      </section>

      {/* Live Certificate Verification Section on Home */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Verification Engine</span>
              </div>
              <h3 className="text-2xl font-bold">Verify Any Intern Certificate Instantly</h3>
              <p className="text-xs text-slate-400 mt-1">
                Employers, recruiters, and university deans can validate credential authenticity in real-time.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs font-mono-num text-slate-400">Database: LIVE</span>
            </div>
          </div>

          <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. CERT-INT-2026-8821 or Student ID"
              value={quickCertQuery}
              onChange={(e) => setQuickCertQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono-num"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Verify Credential</span>
            </button>
          </form>

          {/* Verification Feedback Banner */}
          {quickVerifyResult.searched && (
            <div className="animate-in fade-in duration-200">
              {quickVerifyResult.found && quickVerifyResult.student ? (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Official Credential Verified: {quickVerifyResult.student.certificate.certificateId}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 pt-1">
                    <div>Student: <strong className="text-white">{quickVerifyResult.student.name}</strong></div>
                    <div>Domain: <strong className="text-white">{quickVerifyResult.student.domain}</strong></div>
                    <div>Grade: <strong className="text-white">{quickVerifyResult.student.certificate.performanceGrade}</strong></div>
                    <div>Hours: <strong className="text-white font-mono-num">{quickVerifyResult.totalHours} hrs</strong></div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-950/60 border border-red-500/60 rounded-xl text-xs text-red-200">
                  No verified certificate found for &ldquo;{quickCertQuery}&rdquo;. Try <code>CERT-INT-2026-8821</code>.
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            <span>Try sample certificate:</span>
            <button
              type="button"
              onClick={() => setQuickCertQuery('CERT-INT-2026-8821')}
              className="text-blue-400 hover:underline font-mono-num"
            >
              CERT-INT-2026-8821 (Alex Morgan)
            </button>
          </div>
        </div>
      </section>

      {/* Featured Domain Tracks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Supported Internship Tracks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Standardized technical curriculum templates with automated practicum verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="font-bold text-slate-900 text-base">Full-Stack Software Engineering</div>
            <p className="text-xs text-slate-600">
              Modern frontend frameworks (React, Next.js), backend microservices, SQL/NoSQL schema modeling, and production cloud deploys.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="font-bold text-slate-900 text-base">Artificial Intelligence & ML</div>
            <p className="text-xs text-slate-600">
              Model training, fine-tuning, computer vision with PyTorch, NLP pipelines, vector databases, and scalable inference API deployment.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="font-bold text-slate-900 text-base">Cloud Architecture & DevOps</div>
            <p className="text-xs text-slate-600">
              Docker containerization, Kubernetes orchestration, CI/CD automated test pipelines, and enterprise infrastructure-as-code.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="font-bold text-slate-900 text-base">Data Analytics & BI</div>
            <p className="text-xs text-slate-600">
              Data warehousing, advanced ETL pipelines, executive KPI forecasting, and real-time visualization dashboards.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="font-bold text-slate-900 text-base">Cybersecurity & Defense</div>
            <p className="text-xs text-slate-600">
              Vulnerability assessment, network penetration auditing, zero-trust access architecture, and cryptographic key rotation.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="font-bold text-slate-900 text-base">Mobile App Development</div>
            <p className="text-xs text-slate-600">
              Cross-platform mobile applications with React Native and Flutter, offline SQLite caching, and native hardware API integrations.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
