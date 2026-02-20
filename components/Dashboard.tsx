
import React, { useState, useEffect } from 'react';
import { BranchId } from '../types';
import { BRANCHES } from '../constants';
import Sidebar from './Sidebar';
import BranchView from './BranchView';
import DirectorDashboard from './DirectorDashboard';
import MeetingRoom from './MeetingRoom';
import ReportsView from './ReportsView';
import LogisticsMap from './LogisticsMap';
import { Menu, LogOut, ShieldAlert, Bell, Video, Map } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

interface DashboardProps {
  user: { email: string; branchId: BranchId };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const { notifications, markAsRead, clearAll, requestPermission } = useNotifications();
  
  const branch = BRANCHES[user.branchId];
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="flex-1 flex flex-col w-full relative">
        <header className="bg-darkblue text-white h-16 flex items-center justify-between px-4 sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="font-bold text-lg hidden sm:block">JULFERIIN B GLOBAL</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="p-2 hover:bg-white/10 rounded-full relative transition-all active:scale-95"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-maroon text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-darkblue animate-bounce">
                    {unreadCount > 9 ? '+9' : unreadCount}
                  </span>
                )}
              </button>

              {showNotificationPanel && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 text-darkblue overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-sm">Alertas de Sistema</h3>
                    <button onClick={clearAll} className="text-[10px] text-maroon font-bold hover:underline">Limpar Tudo</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <Bell size={24} className="mx-auto mb-2 opacity-20" />
                        <p className="text-xs italic">Sem novas notificações</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markAsRead(n.id)}
                          className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${n.read ? 'opacity-50' : 'bg-blue-50/30'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-black uppercase px-1.5 rounded ${
                              n.type === 'error' ? 'bg-red-100 text-red-600' :
                              n.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {n.type}
                            </span>
                            <span className="text-[9px] text-gray-400">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="font-bold text-xs truncate">{n.title}</p>
                          <p className="text-[11px] text-gray-500 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="text-right hidden md:block">
              <p className="text-xs text-skylight font-bold">{branch.name}</p>
              <p className="text-xs opacity-70">{user.email}</p>
            </div>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 bg-maroon px-3 py-1.5 rounded-lg text-sm hover:bg-red-800 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          {activeTab === 'Dashboard' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-maroon">
                <div className="flex items-center gap-3 mb-4 text-maroon">
                  <ShieldAlert size={24} />
                  <h2 className="text-xl font-bold">Painel do Ramo</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-green-800 font-bold">Status: Operacional</p>
                    <p className="text-sm text-green-700">Sem alertas críticos no momento.</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg border-l-4 border-darkblue">
                    <p className="text-darkblue font-bold">Áreas Ativas</p>
                    <p className="text-sm text-blue-700">{branch.areas.length} áreas de negócio</p>
                  </div>
                </div>
              </div>

              <BranchView branch={branch} />
              <DirectorDashboard />
            </div>
          )}

          {activeTab === 'Logística & GPS' && (
            <LogisticsMap />
          )}

          {activeTab === 'Relatórios' && (
            <ReportsView branch={branch} />
          )}

          {activeTab === 'Meeting Zoom' && (
            <div className="bg-white p-6 rounded-3xl shadow-xl min-h-[500px] border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                 <div className="bg-darkblue text-white p-2 rounded-xl shadow-lg">
                    <Video size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-darkblue uppercase tracking-tight">Meeting Zoom Global</h2>
                    <p className="text-xs text-gray-400 font-bold">REUNIÃO ESTRATÉGICA DE DIREÇÃO</p>
                 </div>
              </div>
              <MeetingRoom onBack={() => setActiveTab('Dashboard')} />
            </div>
          )}

          {activeTab !== 'Dashboard' && activeTab !== 'Meeting Zoom' && activeTab !== 'Relatórios' && activeTab !== 'Logística & GPS' && (
            <div className="bg-white p-6 rounded-xl shadow-sm min-h-[400px]">
              <h2 className="text-2xl font-bold text-darkblue mb-6">{activeTab}</h2>
              <BranchView branch={branch} boxType={activeTab} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
