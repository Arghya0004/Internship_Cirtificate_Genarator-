import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActiveView, openLoginModal } = useApp();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
          <Award className="w-4 h-4 text-blue-600" />
          <span>Academic & Industry Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About InternTrack
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          InternTrack was founded to establish absolute credibility and transparent tracking for professional university internships and practicum programs.
        </p>
      </div>

      {/* Core Mission & Triad of Integrity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Automated Shift Math</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminating guesswork and inflated hour claims. When interns enter entry and exit times, the engine dynamically computes exact work durations with minute-level precision.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Administrative Oversight</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every candidate registration must be validated and authorized by an approved administrator before access is granted. Mentors review daily deliverables prior to certificate generation.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Tamper-Proof Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Each endorsed certificate receives a unique, collision-free identification code. External recruiters and admissions committees can verify student achievements instantly.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          The Two-Tier Governance Model
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1</span>
              <span>Candidate Admission & Work Logging</span>
            </h4>
            <p>
              Students begin by submitting verified email contact details and educational affiliations. The central administrative directorate inspects applicant credentials and activates their Student Login ID. From their first day on site, interns record shift timings and detail specific technical milestones achieved.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">2</span>
              <span>Practicum Review & Endorsement</span>
            </h4>
            <p>
              Upon completing their required tenure, students formally submit an issuance request via the Certificate Generator tab. Program directors evaluate cumulative hours, review task quality, assign a final performance grade, and digitally endorse the certificate.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Adhering to IEEE and ABET university practicum guidelines for experiential engineering education.
          </div>
          <button
            onClick={() => setActiveView('certificate-generator')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Test Certificate Generator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
