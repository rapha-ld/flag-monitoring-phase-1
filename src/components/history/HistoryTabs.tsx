
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HistoryTabsProps {
  activeTab: string;
  onChange: (value: string) => void;
}

const HistoryTabs = ({ activeTab, onChange }: HistoryTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onChange} className="w-full">
      <TabsList className="w-full max-w-md bg-white">
        <TabsTrigger 
          value="history" 
          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          History
        </TabsTrigger>
        <TabsTrigger 
          value="sessions" 
          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          Sessions
        </TabsTrigger>
        <TabsTrigger 
          value="feedback" 
          className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
        >
          User Feedback
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default HistoryTabs;
