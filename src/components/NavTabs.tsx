
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NavTabsProps {
  activeTab: string;
  onChange: (value: string) => void;
}

const NavTabs = ({ activeTab, onChange }: NavTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-md bg-white border-b border-muted">
        <TabsTrigger 
          value="targeting" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          Targeting
        </TabsTrigger>
        <TabsTrigger 
          value="variations" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          Variations
        </TabsTrigger>
        <TabsTrigger 
          value="monitoring" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          Monitoring
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          Settings
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NavTabs;
