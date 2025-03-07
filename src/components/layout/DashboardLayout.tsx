
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Navigation */}
      <div className="fixed left-0 top-0 h-full w-[244px] bg-white border-r border-border">
        <img 
          src="/lovable-uploads/8481db1a-24b4-402f-95c5-235ada172dfa.png" 
          alt="App Navigation" 
          className="h-full w-full object-cover"
        />
      </div>
      
      {/* Main Content with padding to account for sidebars */}
      <div className="ml-[244px] mr-[300px] flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Right Sidebar */}
      <div className="fixed right-0 top-0 h-full w-[300px] bg-white border-l border-border">
        <img 
          src="/lovable-uploads/d7b57556-8338-4df5-b726-151da5a62c8f.png" 
          alt="Sidebar" 
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
