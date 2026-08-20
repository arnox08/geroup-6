import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { AccessControlBanner } from './components/common/AccessControlBanner';
import { AdminAccessGuard } from './components/common/AdminAccessGuard';
import { LoginForm } from './components/auth/LoginForm';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainApp: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 antialiased selection:bg-purple-500 selection:text-white">
      <Header />
      <AccessControlBanner />
      <main className="pb-16">
        {currentUser.role === 'admin' ? (
          <AdminAccessGuard>
            <AdminDashboard />
          </AdminAccessGuard>
        ) : (
          <UserDashboard />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

