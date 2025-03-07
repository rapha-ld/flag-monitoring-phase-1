
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
      <TabsList className="grid grid-cols-4 w-full max-w-md bg-background border">
        <TabsTrigger value="targeting" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Targeting</span>
        </TabsTrigger>
        <TabsTrigger value="variations" className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          <span className="hidden sm:inline">Variations</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          <span className="hidden sm:inline">Reporting and analytics</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NavTabs;
