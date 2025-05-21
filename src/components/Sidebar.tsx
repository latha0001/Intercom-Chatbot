import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { 
  Home, Users, BarChart2, Settings, HelpCircle, MessageSquare, Tag, 
  X, PieChart, AlertCircle
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { currentUser, selectedFilter, setSelectedFilter } = useAppContext();

  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, filter: 'all' },
    { name: 'Inbox', icon: <MessageSquare size={20} />, filter: 'all', badge: 5 },
    { name: 'Unassigned', icon: <AlertCircle size={20} />, filter: 'unassigned', badge: 3 },
    { name: 'Assigned', icon: <Tag size={20} />, filter: 'assigned' },
    { name: 'My Conversations', icon: <Users size={20} />, filter: 'mine' },
    { name: 'Resolved', icon: <Tag size={20} />, filter: 'resolved' },
  ];

  const otherItems = [
    { name: 'Team', icon: <Users size={20} /> },
    { name: 'Analytics', icon: <BarChart2 size={20} /> },
    { name: 'Reports', icon: <PieChart size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
    { name: 'Help & Support', icon: <HelpCircle size={20} /> },
  ];

  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
    onClose(); // Close mobile sidebar on selection
  };

  return (
    <div className="h-full flex flex-col bg-background border-r border-border">
      {/* Mobile close button */}
      <div className="p-4 flex justify-between items-center md:hidden">
        <div className="font-semibold">Intercom</div>
        <button 
          className="p-1 rounded-full hover:bg-secondary/10 transition-colors" 
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* User info */}
      <div className="p-4 flex items-center space-x-3 mb-4">
        <div className="avatar w-10 h-10 overflow-hidden">
          <img src={currentUser?.avatar} alt={currentUser?.name} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{currentUser?.name}</p>
          <p className="text-xs text-text-light truncate">{currentUser?.role}</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        <div className="space-y-1 mb-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`
                flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors
                ${selectedFilter === item.filter 
                  ? 'bg-primary text-white' 
                  : 'text-text hover:bg-secondary/10'}
              `}
              onClick={() => handleSelectFilter(item.filter)}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <span className={`
                  px-2 py-0.5 text-xs rounded-full
                  ${selectedFilter === item.filter 
                    ? 'bg-white/20 text-white' 
                    : 'bg-secondary/10 text-text'}
                `}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-border space-y-1">
          {otherItems.map((item) => (
            <button
              key={item.name}
              className="flex items-center w-full px-3 py-2 text-sm rounded-md text-text hover:bg-secondary/10 transition-colors"
            >
              <span className="mr-3">{item.icon}</span>
              <span className="flex-1 text-left">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-xs text-text-light">Intercom Admin v1.0</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;