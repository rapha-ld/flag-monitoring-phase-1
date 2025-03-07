
import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
}

const Header = ({ timeframe, onTimeframeChange, className, ...props }: HeaderProps) => {
  return (
    <header className={cn("pb-4 animate-slide-down", className)} {...props}>
      <div className="flex items-center gap-2">
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
    </header>
  );
};

export default Header;
