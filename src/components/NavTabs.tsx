
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Layout, BarChart, Settings } from 'lucide-react';

interface NavTabsProps {
  activeTab: string;
  onChange: (value: string) => void;
}

const NavTabs = ({ activeTab, onChange }: NavTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-md bg-transparent border-b border-muted">
        <TabsTrigger 
          value="targeting" 
          className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Targeting</span>
        </TabsTrigger>
        <TabsTrigger 
          value="variations" 
          className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          <Layout className="h-4 w-4" />
          <span className="hidden sm:inline">Variations</span>
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          <BarChart className="h-4 w-4" />
          <span className="hidden sm:inline">Reporting and analytics</span>
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NavTabs;
