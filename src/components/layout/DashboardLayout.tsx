import React from 'react';
import { cn } from '@/lib/utils';
interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  return <div className="flex h-screen w-full overflow-hidden">
      {/* Left Navigation - fixed width sidebar */}
      <div className="fixed left-0 top-0 h-full w-[244px] bg-white border-r border-border z-10">
        <img alt="Sidebar" className="w-full object-contain" src="/lovable-uploads/1b00cb07-3221-4941-b360-90318154102b.png" />
      </div>
      
      {/* Main Content with padding to account for sidebars */}
      <div className="fixed inset-0 pt-0 pb-0 pl-[244px] pr-[300px] overflow-y-auto">
        {children}
      </div>
      
      {/* Right Sidebar - fixed width navigation */}
      <div className="fixed right-0 top-0 h-full w-[300px] z-10 flex flex-col">
        {/* White background area for the top section */}
        <div className="bg-white border-l border-border">
          <img src="/lovable-uploads/4e775057-b64f-42a8-83d9-29ae33ed1a2d.png" alt="App Navigation" className="w-full object-contain" />
        </div>
        
        {/* Rest of the sidebar with the original background */}
        <div className="flex-1 bg-sidebar border-l border-border"></div>
      </div>
    </div>;
};
export default DashboardLayout;