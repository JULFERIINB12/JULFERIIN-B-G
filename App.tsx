
import React, { useState } from 'react';
import { BranchId } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationToast from './components/NotificationToast';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string; branchId: BranchId } | null>(null);

  const handleLogin = (email: string, branchId: BranchId) => {
    setUser({ email, branchId });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Dashboard user={user} onLogout={handleLogout} />
        )}
        <NotificationToast />
      </div>
    </NotificationProvider>
  );
};

export default App;
