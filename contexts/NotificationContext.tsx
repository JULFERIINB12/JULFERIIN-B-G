
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  requestPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    // Tentar carregar notificações do localStorage para persistência simples
    const saved = localStorage.getItem('jb_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar notificações");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const requestPermission = async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Disparar notificação do browser se permitido
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`JULFERIIN: ${newNotif.title}`, {
        body: newNotif.message,
        icon: '/favicon.ico' // Ajustar conforme necessário
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll, requestPermission }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
