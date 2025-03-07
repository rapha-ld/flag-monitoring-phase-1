
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

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
  const [dateSelectionStep, setDateSelectionStep] = useState<'start' | 'end'>('start');

  const handleDateSelect = (date: Date | undefined) => {
    if (dateSelectionStep === 'start') {
      setStartDate(date);
      setDateSelectionStep('end');
    } else {
      setEndDate(date);
      if (date && startDate) {
        const diffDays = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        onTimeframeChange(`custom-${diffDays}d`);
        setIsDialogOpen(false);
        setDateSelectionStep('start');
      }
    }
  };

  return (
    <header className={cn("pb-4 animate-slide-down", className)} {...props}>
      {/* Breadcrumb */}
      <div className="flex items-center text-textBase mb-4">
        <span className="text-textSecondary">Flags</span>
        <ChevronRight className="h-4 w-4 mx-1 text-textSecondary" />
        <span className="font-medium">New Checkout</span>
      </div>
      
      {/* Controls - moved below breadcrumb */}
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
            7 days
          </Button>
          <Button 
            variant={timeframe === "14d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("14d")}
          >
            14 days
          </Button>
          <Button 
            variant={timeframe === "30d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("30d")}
          >
            30 days
          </Button>
          <Button 
            variant={timeframe === "90d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("90d")}
          >
            90 days
          </Button>
          
          {/* Date Range Picker */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                <span>Date Range</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{dateSelectionStep === 'start' ? 'Select Start Date' : 'Select End Date'}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-4">
                {startDate && dateSelectionStep === 'end' && (
                  <div className="mb-4 text-sm text-textSecondary">
                    Start date: {format(startDate, "MMMM d, yyyy")}
                  </div>
                )}
                <Calendar
                  mode="single"
                  selected={dateSelectionStep === 'start' ? startDate : endDate}
                  onSelect={handleDateSelect}
                  disabled={dateSelectionStep === 'end' && startDate 
                    ? { before: new Date(startDate) } 
                    : undefined}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
                {dateSelectionStep === 'end' && (
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setDateSelectionStep('start');
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }}
                  >
                    Reset Selection
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
