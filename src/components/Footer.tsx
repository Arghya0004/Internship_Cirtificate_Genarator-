import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, ShieldCheck, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, openLoginModal } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Intern<span className="text-blue-600">Track</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Standardized practicum timesheet monitoring, administrative authorization pipelines, and cryptographic certification generation for professional interns.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span>IEEE & ABET Aligned</span>
              <span>·</span>
              <span>Tamper-Proof Verification</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => setActiveView('home')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-blue-600 transition-colors"
                >
                  About Organization
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('contact')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('certificate-generator')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Certificate Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Access Portals */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Portals
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => openLoginModal('student')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Student Workspace Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLoginModal('student-register')}
                  className="hover:text-blue-600 transition-colors"
                >
                  New Student Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLoginModal('admin')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Admin Control Console
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            © {new Date().getFullYear()} InternTrack Consortium. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Framework</span>
            <span>·</span>
            <span className="hover:text-slate-600 cursor-pointer">Credential Verification Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
