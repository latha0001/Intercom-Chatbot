import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Sidebar from './Sidebar';
import ConversationsList from './ConversationsList';
import ConversationDetail from './ConversationDetail';
import Header from './Header';
import AIPanel from './AIPanel';

const Dashboard: React.FC = () => {
  const { showAIPanel, currentConversationId } = useAppContext();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-surface">
      <Header 
        onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - hidden on mobile until toggled */}
        <div className={`
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 fixed md:relative z-30 h-[calc(100vh-64px)] w-64 
          transition-transform duration-300 ease-in-out
        `}>
          <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
        </div>
        
        {/* Mobile backdrop when sidebar is open */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        {/* Main content */}
        <div className="flex-1 flex md:ml-0 overflow-hidden">
          {/* Conversations list - shown always on tablets, only when no conversation is selected on mobile */}
          <div className={`
            ${currentConversationId && 'hidden'} sm:block
            w-full sm:w-80 lg:w-96 border-r border-border overflow-y-auto
          `}>
            <ConversationsList />
          </div>
          
          {/* Conversation detail - full screen on mobile when conversation is selected */}
          <div className={`
            ${!currentConversationId && 'hidden'} sm:block
            flex-1 flex flex-col overflow-hidden relative
          `}>
            {currentConversationId ? (
              <ConversationDetail conversationId={currentConversationId} />
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-text-light">
                <div className="text-center">
                  <p className="text-lg">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
          
          {/* AI Assistant Panel */}
          {showAIPanel && currentConversationId && (
            <div className="hidden lg:block w-80 border-l border-border overflow-y-auto animate-slide-in-right">
              <AIPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;