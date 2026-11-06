import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { HomeView } from './components/views/HomeView';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { CertificateGeneratorView } from './components/views/CertificateGeneratorView';
import { StudentDashboard } from './components/views/StudentDashboard';
import { AdminDashboard } from './components/views/AdminDashboard';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'about' && <AboutView />}
        {activeView === 'contact' && <ContactView />}
        {activeView === 'certificate-generator' && <CertificateGeneratorView />}
        {activeView === 'student-dashboard' && <StudentDashboard />}
        {activeView === 'admin-dashboard' && <AdminDashboard />}
      </main>

      <Footer />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
