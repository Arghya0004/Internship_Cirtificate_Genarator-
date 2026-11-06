import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  User, 
  ShieldCheck, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  UserPlus, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    authSession, 
    logout, 
    openLoginModal 
  } = useApp();

  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveView('home');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Intern<span className="text-blue-600">Track</span>
              </span>
            </button>
          </div>

          {/* Zone 2: 4 nav links: Home, About, Contact Us, Certificate Generator */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveView('home')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeView === 'home'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveView('about')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeView === 'about'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : ''
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveView('contact')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeView === 'contact'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : ''
              }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => setActiveView('certificate-generator')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 pb-0.5 ${
                activeView === 'certificate-generator'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : ''
              }`}
            >
              <span>Certificate Generator</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </button>
          </nav>

          {/* Zone 3: 1 primary action / login group */}
          <div className="flex items-center gap-3 shrink-0">
            {authSession ? (
              <div className="flex items-center gap-3">
                {/* Active Session info */}
                {authSession.role === 'student' && authSession.student ? (
                  <button
                    onClick={() => setActiveView('student-dashboard')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      activeView === 'student-dashboard'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {authSession.student.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline max-w-[120px] truncate">{authSession.student.name}</span>
                    <span className="font-mono-num text-slate-400">({authSession.student.id})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveView('admin-dashboard')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      activeView === 'admin-dashboard'
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-slate-900">Admin Control</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown containing Student and Admin login */}
                {isLoginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      Select Portal Access
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsLoginDropdownOpen(false);
                        openLoginModal('student');
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-blue-700">Student Login</div>
                        <div className="text-xs text-slate-500">ID & Password access</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsLoginDropdownOpen(false);
                        openLoginModal('admin');
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 group-hover:text-amber-800">Admin Login</div>
                        <div className="text-xs text-slate-500">Track data & approvals</div>
                      </div>
                    </button>

                    <div className="my-1.5 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        setIsLoginDropdownOpen(false);
                        openLoginModal('student-register');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-blue-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>New Student? Register here</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile nav drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => {
              setActiveView('home');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeView === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveView('about');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeView === 'about' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            About
          </button>
          <button
            onClick={() => {
              setActiveView('contact');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeView === 'contact' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Contact Us
          </button>
          <button
            onClick={() => {
              setActiveView('certificate-generator');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeView === 'certificate-generator' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Certificate Generator
          </button>
        </div>
      )}
    </header>
  );
};
