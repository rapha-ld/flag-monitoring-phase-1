import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  return <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left Navigation - fixed width sidebar */}
      <div className="fixed left-0 top-0 h-full w-[244px] bg-white border-r border-border z-10">
        <img alt="Sidebar" className="w-full object-contain" src="/lovable-uploads/1b00cb07-3221-4941-b360-90318154102b.png" />
      </div>
      
      {/* Main Content with padding to account for sidebars */}
      <div className="fixed inset-0 pt-0 pb-0 pl-[244px] pr-[300px] overflow-y-auto bg-white">
        {/* Removed duplicate CollapsibleBanner */}
        
        {/* Main content */}
        {children}
      </div>
      
      {/* Right Sidebar - fixed width navigation */}
      <div className="fixed right-0 top-0 h-full w-[300px] z-10 flex flex-col">
        {/* White background area for the top section */}
        <div className="bg-white border-l border-border">
          <img alt="App Navigation" className="w-full object-contain" src="/lovable-uploads/fc0c88a8-77bf-455a-86ad-7da8992398b4.png" />
        </div>
        
        {/* Rest of the sidebar with the original background */}
        <div className="flex-1 border-l border-border bg-white"></div>
      </div>
    </div>;
};

export default DashboardLayout;
