
import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle, className, ...props }: HeaderProps) => {
  return (
    <header className={cn("pb-4 animate-slide-down", className)} {...props}>
      <div className="flex flex-col gap-1">
        <div className="inline-flex items-center h-5">
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full animate-fade-in">
            Dashboard
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="7d">
              <SelectTrigger className="h-9 w-[100px] bg-background border">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 hours</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              <span>Date Range</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0">
              <FilterIcon className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
