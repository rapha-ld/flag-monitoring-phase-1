
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search, Plus, Flag, Bot, Users, Settings, Shield, AlertTriangle, Activity, Fingerprint, FlaskConical, BarChart3, GitBranch, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavItem = ({ 
  icon: Icon, 
  label, 
  active = false,
  className = '' 
}: { 
  icon: React.ElementType; 
  label: string; 
  active?: boolean;
  className?: string;
}) => (
  <div className={cn(
    "flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-slate-100 rounded-md transition-colors",
    active && "bg-slate-100",
    className
  )}>
    <Icon className="h-5 w-5 text-slate-600" />
    <span className="text-[15px] text-slate-700">{label}</span>
  </div>
);

const NavSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <div className="px-4 py-2 text-sm font-medium text-slate-500">{title}</div>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const LeftSidebar = () => {
  return (
    <div className="flex flex-col h-full w-full py-4 overflow-y-auto">
      <div className="px-4 mb-6">
        <div className="flex items-center mb-6">
          <ArrowLeft className="h-6 w-6 mr-2" strokeWidth={1.5} />
          <div className="h-7 w-7 bg-slate-200 rounded ml-auto"></div>
        </div>
        
        <div className="relative mb-3">
          <div className="flex items-center justify-between border rounded-md px-4 py-2">
            <span className="text-[15px] font-medium">LaunchDarkly</span>
            <ChevronDown className="h-5 w-5 text-slate-500" />
          </div>
          <Search className="absolute right-[-40px] top-[9px] h-5 w-5 text-slate-600" />
        </div>
        
        <Button className="w-full bg-blue-500 hover:bg-blue-600 mb-4">
          <Plus className="h-4 w-4 mr-2" /> Create
        </Button>
        
        <div className="space-y-3 mb-8">
          <NavItem icon={Settings} label="Insights" />
          <NavItem icon={Users} label="Approvals" />
        </div>
      </div>
      
      <NavSection title="Release">
        <NavItem icon={Search} label="Flags" active={true} className="bg-slate-100" />
        <NavItem icon={Bot} label="Release assistant" />
        <NavItem icon={Users} label="Segments" />
        <NavItem icon={Settings} label="AI configs" />
        <NavItem icon={Settings} label="Cleanup" />
      </NavSection>
      
      <NavSection title="Monitor">
        <NavItem icon={Shield} label="Guarded rollouts" />
        <NavItem icon={AlertTriangle} label="Error monitoring" />
        <NavItem icon={Activity} label="Live events" />
        <NavItem icon={Fingerprint} label="Contexts" />
      </NavSection>
      
      <NavSection title="Optimize">
        <NavItem icon={FlaskConical} label="Experiments" />
        <NavItem icon={BarChart3} label="Metrics" />
        <NavItem icon={GitBranch} label="Holdouts" />
      </NavSection>
    </div>
  );
};

export default LeftSidebar;
