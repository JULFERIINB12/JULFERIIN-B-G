
import React from 'react';
import { Home, UserCheck, Activity, LogIn, LogOut, FileText, Bell, LayoutGrid, Video, Map } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const menuItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Logística & GPS', icon: Map },
    { name: 'Meeting Zoom', icon: Video },
    { name: 'Box RH (BRJ)', icon: UserCheck },
    { name: 'Box Actividades (BAJ)', icon: Activity },
    { name: 'Box Entradas (BEJ)', icon: LogIn },
    { name: 'Box Saídas (BSJ)', icon: LogOut },
    { name: 'Relatórios', icon: FileText },
    { name: 'Alertas', icon: Bell },
  ];

  return (
    <aside className={`
      fixed lg:static top-0 left-0 h-full w-64 bg-maroon text-white z-50 
      sidebar-transition transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 h-16 flex items-center border-b border-white/10">
        <LayoutGrid className="mr-3" />
        <span className="font-bold text-xl">MENU GLOBAL</span>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActiveTab(item.name);
              onClose();
            }}
            className={`
              w-full flex items-center px-6 py-4 transition-colors
              ${activeTab === item.name ? 'bg-skylight text-darkblue font-bold' : 'hover:bg-white/10'}
            `}
          >
            <item.icon className="mr-3" size={20} />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-0 w-full px-6 opacity-40 text-xs">
        v2.6.0-LOGISTICS
      </div>
    </aside>
  );
};

export default Sidebar;
