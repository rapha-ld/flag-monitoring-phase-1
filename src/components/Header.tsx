import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import NavTabs from './NavTabs';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
  environment: string;
  onEnvironmentChange: (value: string) => void;
}

const Header = ({ 
  timeframe, 
  onTimeframeChange, 
  environment, 
  onEnvironmentChange,
  className, 
  ...props 
}: HeaderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("monitoring");

  const handleDateSelect = (date: Date | undefined, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleApplyCustomRange = () => {
    if (startDate && endDate) {
      const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      onTimeframeChange(`custom-${diffDays}d`);
      setIsDialogOpen(false);
    }
  };

  return (
    <header className={cn("pb-4 animate-slide-down space-y-4", className)} {...props}>
      {/* Breadcrumb */}
      <div className="flex items-center text-textBase">
        <span className="text-textSecondary">Flags</span>
        <ChevronRight className="h-4 w-4 mx-1 text-textSecondary" />
        <span className="font-medium">New Checkout</span>
      </div>
      
      {/* Tab Navigation */}
      <NavTabs activeTab={activeTab} onChange={setActiveTab} />
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Environment Selector */}
        <Select value={environment} onValueChange={onEnvironmentChange}>
          <SelectTrigger className="h-9 w-[120px] bg-background border">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Timeframe Button Group */}
        <div className="flex items-center space-x-2">
          <Button 
            variant={timeframe === "7d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("7d")}
          >
            7d
          </Button>
          <Button 
            variant={timeframe === "14d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("14d")}
          >
            14d
          </Button>
          <Button 
            variant={timeframe === "30d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("30d")}
          >
            30d
          </Button>
          <Button 
            variant={timeframe === "90d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("90d")}
          >
            90d
          </Button>
          
          {/* Date Range Picker */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                <span>Date Range</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Select Date Range</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 py-4">
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium">Start Date</span>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleDateSelect(date, 'start')}
                    initialFocus
                    className="p-3 pointer-events-auto border rounded-md"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium">End Date</span>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleDateSelect(date, 'end')}
                    disabled={startDate 
                      ? { before: new Date(startDate) } 
                      : undefined}
                    className="p-3 pointer-events-auto border rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                >
                  Reset
                </Button>
                <Button
                  onClick={handleApplyCustomRange}
                  disabled={!startDate || !endDate}
                >
                  Apply Range
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
