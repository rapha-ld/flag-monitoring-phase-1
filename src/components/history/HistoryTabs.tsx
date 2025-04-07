
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HistoryTabsProps {
  activeTab: string;
  onChange: (value: string) => void;
}

const HistoryTabs = ({ activeTab, onChange }: HistoryTabsProps) => {
  return (
    <TabsList className="w-full max-w-md bg-white">
      <TabsTrigger 
        value="history" 
        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
      >
        <div className="flex items-center gap-1.5">
          Flag history
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Use Shift+click to select a range, or Ctrl/Cmd+click to select individual rows</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TabsTrigger>
      <TabsTrigger 
        value="sessions" 
        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#425EFF] data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground"
      >
        Sessions
      </TabsTrigger>
    </TabsList>
  );
};

export default HistoryTabs;
