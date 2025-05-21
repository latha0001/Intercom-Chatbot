import React, { useState } from 'react';
import { 
  Search, Bell, HelpCircle, MessageSquare, Menu,
  BarChart2, Zap, Moon, Sun
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { showAIPanel, setShowAIPanel, currentConversationId, isDarkMode, toggleDarkMode } = useAppContext();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-16 bg-background border-b border-border px-4 flex items-center justify-between z-10 dark:bg-gray-800 dark:border-gray-700">
      {/* Left section */}
      <div className="flex items-center">
        <button 
          className="mr-4 p-2 rounded-full hover:bg-secondary/10 md:hidden dark:hover:bg-gray-700" 
          onClick={onMenuToggle}
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:flex items-center">
          <div className="text-primary font-semibold mr-4 text-lg dark:text-blue-400">
            <span className="flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Intercom
            </span>
          </div>
        </div>
      </div>

      {/* Center - Search */}
      <div className={`
        hidden md:block absolute left-1/2 transform -translate-x-1/2
        w-1/3 max-w-md transition-all duration-200
        ${searchFocused ? 'w-2/5' : 'w-1/3'}
      `}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations, users..."
            className="input py-1.5 pl-9 pr-4 w-full bg-secondary/5 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light dark:text-gray-400">
            <Search size={16} />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Mobile search */}
        <button className="p-2 rounded-full hover:bg-secondary/10 md:hidden dark:hover:bg-gray-700">
          <Search size={20} />
        </button>
        
        {/* Dark mode toggle */}
        <button 
          className="p-2 rounded-full hover:bg-secondary/10 dark:hover:bg-gray-700"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* AI Assistant toggle */}
        {currentConversationId && (
          <button 
            className={`
              hidden lg:flex items-center px-3 py-1.5 rounded-full text-sm font-medium
              ${showAIPanel 
                ? 'bg-primary text-white dark:bg-blue-600' 
                : 'bg-secondary/10 hover:bg-secondary/20 text-secondary dark:bg-gray-700 dark:text-gray-300'}
            `}
            onClick={() => setShowAIPanel(!showAIPanel)}
          >
            <Zap size={16} className="mr-1" />
            AI Assistant
          </button>
        )}
        
        <button className="p-2 rounded-full hover:bg-secondary/10 relative dark:hover:bg-gray-700">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary dark:bg-blue-400"></span>
        </button>
        
        <button className="p-2 rounded-full hover:bg-secondary/10 dark:hover:bg-gray-700">
          <BarChart2 size={20} />
        </button>
        
        <button className="p-2 rounded-full hover:bg-secondary/10 dark:hover:bg-gray-700">
          <HelpCircle size={20} />
        </button>
        
        <button className="ml-2 flex items-center">
          <div className="avatar w-8 h-8 overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150" 
              alt="Profile" 
            />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;