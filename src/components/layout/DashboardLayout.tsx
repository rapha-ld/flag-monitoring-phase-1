
import React from 'react';
import { cn } from '@/lib/utils';
import LeftSidebar from './LeftSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Navigation - fixed width sidebar */}
      <div className="fixed left-0 top-0 h-full w-[244px] bg-white border-r border-border z-10">
        <LeftSidebar />
      </div>
      
      {/* Main Content with padding to account for sidebars */}
      <div className="fixed inset-0 pt-0 pb-0 pl-[244px] pr-[300px] overflow-y-auto">
        {children}
      </div>
      
      {/* Right Sidebar - fixed width navigation */}
      <div className="fixed right-0 top-0 h-full w-[300px] bg-white border-l border-border z-10">
        <img 
          src="/lovable-uploads/8481db1a-24b4-402f-95c5-235ada172dfa.png" 
          alt="App Navigation" 
          className="w-full object-contain"
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
