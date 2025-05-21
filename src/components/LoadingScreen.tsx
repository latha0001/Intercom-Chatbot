import React from 'react';
import { MessageSquare } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
      <div className="relative">
        <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary rounded-full animate-pulse-slow"></div>
      </div>
      
      <h1 className="mt-6 text-xl font-medium">Intercom Admin</h1>
      <p className="mt-2 text-text-light text-sm">Loading your experience...</p>
      
      <div className="mt-8 w-48 h-1 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-loading-bar"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;