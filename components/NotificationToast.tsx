
import React, { useEffect, useState } from 'react';
import { useNotifications, AppNotification } from '../contexts/NotificationContext';
import { X, Bell, AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

const NotificationToast: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();
  const [activeToasts, setActiveToasts] = useState<AppNotification[]>([]);

  useEffect(() => {
    // Mostrar apenas as últimas 3 notificações não lidas que chegaram nos últimos 10 segundos
    const now = Date.now();
    const recent = notifications
      .filter(n => !n.read && (now - n.timestamp < 8000))
      .slice(0, 3);
    
    setActiveToasts(recent);
  }, [notifications]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-600 border-red-700 text-white';
      case 'warning': return 'bg-yellow-500 border-yellow-600 text-white';
      case 'success': return 'bg-green-600 border-green-700 text-white';
      default: return 'bg-darkblue border-blue-900 text-white';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <ShieldAlert size={18} />;
      case 'warning': return <AlertTriangle size={18} />;
      case 'success': return <CheckCircle size={18} />;
      default: return <Bell size={18} />;
    }
  };

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {activeToasts.map((notif) => (
        <div 
          key={notif.id}
          className={`
            ${getTypeStyles(notif.type)}
            w-80 p-4 rounded-xl shadow-2xl border-l-4 flex gap-3 
            pointer-events-auto animate-in slide-in-from-right fade-in duration-300
          `}
        >
          <div className="flex-shrink-0 mt-1">
            {getIcon(notif.type)}
          </div>
          <div className="flex-1">
            <h4 className="font-black text-sm uppercase tracking-tight">{notif.title}</h4>
            <p className="text-xs opacity-90 leading-tight">{notif.message}</p>
          </div>
          <button 
            onClick={() => markAsRead(notif.id)}
            className="flex-shrink-0 self-start p-1 hover:bg-black/10 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
