
import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  return (
    <header className={cn("pb-4 animate-slide-down", className)} {...props}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-textBase">
          <span className="text-textSecondary">Flags</span>
          <ChevronRight className="h-4 w-4 mx-1 text-textSecondary" />
          <span className="font-medium">New Checkout</span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          <Select value={environment} onValueChange={onEnvironmentChange}>
            <SelectTrigger className="h-9 w-[120px] bg-background border">
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="h-9 w-[100px] bg-background border">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="14d">14 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
